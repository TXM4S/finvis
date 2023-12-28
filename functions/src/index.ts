import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

interface StockDataParams {
  ticker: string;
  from: string;
  to: string;
}

interface NewsDataParams {
  query: string;
  from: string;
  to: string;
}

interface Article {
  title: string;
  author: string;
  source: {
    id: string;
    name: string;
  };
  publishedAt: string;
  url: string;
}

const isStockDataParams = (data: any) => {
  return (
    typeof data.ticker == "string" &&
    typeof data.from == "string" &&
    typeof data.to == "string"
  );
};

const isNewsDataParams = (data: any) => {
  return (
    typeof data.query == "string" &&
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

export const mutateNewsData = (articles: Article[]) => {
  const articlesWithTimestamps = articles.map((article: Article) => {
    const articleDate = new Date(article.publishedAt);
    articleDate.setHours(0, 0, 0, 0);
    return { ...article, t: articleDate.getTime() };
  });

  const reduced = articlesWithTimestamps.reduce(
    (grouped: { [key: number]: any[] }, article: { t: number }) => {
      (grouped[article.t] = grouped[article.t] || []).push(article);
      return grouped;
    },
    {},
  );

  delete reduced[0];

  return reduced;
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

const getExternalNewsData = async ({ query, from, to }: NewsDataParams) => {
  const url =
    "https://newsapi.org/v2/everything?q=" +
    query +
    "&from=" +
    from +
    "&to=" +
    to +
    "&sortBy=popularity&apiKey=28741d24c78d4657b5de4ae5aa2080f1";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return mutateNewsData(data.articles);
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    throw error;
  }
};

exports.getNewsData = onCall(
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
    if (!isNewsDataParams(request.data)) {
      throw new Error("Invalid request");
    }

    const [query, from, to] = [
      request.data.query,
      request.data.from,
      request.data.to,
    ];
    return await getExternalNewsData({ query, from, to });
  },
);
//     const url = "https://newsapi.org/v2/everything?q=apple&from="+ from +"&to="+ to +"&sortBy=popular&apiKey=28741d24c78d4657b5de4ae5aa2080f1";

//     return fetch(url)
//     .then((response) => response.json())
//     .then((data) => {setNewsData(organiseNewsData(data)); setLoading(false);})
//   }

//   const organiseNewsData = (data) => {
//     data.articles.map((article) => {
//       let articleDate = new Date(article.publishedAt);
//       articleDate.setHours(0,0,0,0);
//       article.publishedAt = articleDate.getTime();
//     })

//     return Object.groupBy(data.articles, ({publishedAt}) => publishedAt);
//   }

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
    logger.info("Hello logs!", { structuredData: true });
    return await getExternalStockData({ ticker, from, to });
  },
);
