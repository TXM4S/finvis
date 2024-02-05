import { onCall } from "firebase-functions/v2/https";
import { StockDataParams } from "./interfaces";

const isStockDataParams = (data: any) => {
  return (
    typeof data.ticker == "string" &&
    typeof data.from == "string" &&
    typeof data.to == "string"
  );
};

export const mutateStockData = ({ from, to, response }: any) => {
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(0, 0, 0, 0);

  const stockData = response;

  // normalize timestamps to midnight of each day and map to an object for easy access
  const stockDataMap = stockData.reduce(
    (acc: any, item: { t: number; c: number }) => {
      const date = new Date(item.t);
      date.setHours(0, 0, 0, 0);
      acc[date.getTime()] = item.c;
      return acc;
    },
    {},
  );

  let lastNonNullClose = 0;
  // create an array of all timestamps between fromDate and toDate
  const mutatedStockData = [];
  for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
    const timestamp = d.getTime();

    mutatedStockData.push({
      t: timestamp,
      c: stockDataMap[timestamp] || null,
      ec: stockDataMap[timestamp] ? null : lastNonNullClose,
    });

    if (stockDataMap[timestamp]) {
      lastNonNullClose = stockDataMap[timestamp];
    }
  }

  return mutatedStockData;
};

const getExternalStockData = async ({ ticker, from, to }: StockDataParams) => {
  const url =
    "https://api.polygon.io/v2/aggs/ticker/" +
    ticker +
    "/range/1/day/" +
    from +
    "/" +
    to +
    "?adjusted=true&sort=asc&apiKey=9kVdlgF1pSXdyja_Va0A_kaIY2M73Tqa";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return mutateStockData({ from, to, response: data.results });
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    throw error;
  }
};

exports.getStockData = onCall(
  {
    cors: [
      "https://finvis-8304.web.app",
      "http://127.0.0.1:5002",
      "http://localhost:5002",
      "http://localhost:3000",
    ],
    region: "europe-west2",
  },
  async (request) => {
    if (!isStockDataParams(request.data)) {
      throw new Error("Invalid request");
    }

    const [ticker, from, to] = [
      request.data.ticker,
      request.data.from,
      request.data.to,
    ];
    return await getExternalStockData({ ticker, from, to });
  },
);
