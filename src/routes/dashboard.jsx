import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/searchbar.jsx";
import ChartAndArticles from "../components/chartandarticles.jsx";
import { UserContext } from "../contexts/user";
import { addSnapshot, getNewsData, getStockData, getUID } from "../firebase.js";

const DashBoard = () => {
  const { user, isLoading } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, navigate, isLoading]);

  const [query, setQuery] = useState("Apple");
  const [ticker, setTicker] = useState("AAPL");

  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .slice(0, 10);

  const [stockData, setStockData] = useState([]);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    if (!isLoading && user) {
      getStockData({
        ticker: ticker,
        from: from,
        to: to,
      }).then((result) => {
        // Read result of the Cloud Function.
        console.log(result);
        setStockData(result.data);
        // ...
      });
      getNewsData({
        query: query,
        from: from,
        to: to,
      }).then((result) => {
        console.log(result);
        setNewsData(result.data);
      });
    }
  }, [user, isLoading, query, from, to, ticker]);

  const handleSave = () => {
    const uid = getUID();
    const name = ticker + " && " + query;
    const dateRange = from + " to " + to;
    addSnapshot({ uid, name, dateRange, stockData, newsData });
  };

  const handleSearch = () => {
    const queryInput = document.getElementById("queryInput").value || "Apple";
    const tickerSelect = document.getElementById("tickerSelect").value;
    setQuery(queryInput);
    setTicker(tickerSelect);
    // Trigger data fetch here
  };

  return isLoading ? (
    <></>
  ) : (
    <div className="flex flex-col space-y-10 items-center">
      <div className="flex flex-row w-full">
        <h1 className="ml-10 text-5xl font-black self-start"> DASHBOARD </h1>
        <button
          className="btn btn-primary ml-auto self-end"
          onClick={handleSave}
        >
          {" "}
          Save{" "}
        </button>
      </div>
      <div class="flex ml-10 flex-row justify-center">
        <SearchBar handleSearch={handleSearch} />
        <div className="divider lg:divider-horizontal"></div>
        <ChartAndArticles
          name={ticker + "&&" + query}
          stockData={stockData}
          newsData={newsData}
        />
      </div>
    </div>
  );
};

export default DashBoard;
