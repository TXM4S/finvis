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
  const [newsLoading, setNewsLoading] = useState(true);
  const [daterange, setDaterange] = useState(12);
  const [sentimentDomain, setSentimentDomain] = useState(1);

  const to = new Date().toISOString().slice(0, 10);

  const from = new Date(new Date().setMonth(new Date().getMonth() - daterange))
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
      setNewsLoading(true);
      getNewsData({
        query: query,
        from: from,
        to: to,
      }).then((result) => {
        console.log(result);
        setNewsData(result.data);
        setNewsLoading(false);
      });
    }
  }, [user, isLoading, query, from, to, ticker, daterange, sentimentDomain]);

  const handleSave = () => {
    const uid = getUID();
    const name = ticker + " && " + query;
    const dateRange = from + " to " + to;
    addSnapshot({ uid, name, dateRange, stockData, newsData });
  };

  const handleSearch = () => {
    const queryInput = document.getElementById("queryInput").value || "Apple";
    const tickerSelect = document.getElementById("tickerSelect").value;
    const daterangeSelect = document.getElementById("dateRangeSelect").value;
    const sentimentDomainSelect = document.getElementById(
      "sentimentDomainSelect",
    ).value;
    setQuery(queryInput);
    setTicker(tickerSelect);
    setDaterange(daterangeSelect);
    setSentimentDomain(sentimentDomainSelect);
  };

  return isLoading ? (
    <></>
  ) : (
    <div className="flex flex-col space-y-10 items-center">
      <div className="flex flex-row w-screen">
        <h1 className="ml-10 text-5xl font-black self-start"> DASHBOARD </h1>
        <button
          className="btn btn-primary ml-auto self-end mr-10"
          onClick={handleSave}
        >
          {" "}
          Save{" "}
        </button>
      </div>
      <div className="flex flex-row justify-center w-screen h-110">
        <SearchBar handleSearch={handleSearch} />
        <div className="divider lg:divider-horizontal"></div>
        {newsLoading ? (
          <div className="flex flex-grow ml-10 self-center justify-center w-full">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <ChartAndArticles
            name={ticker + "&&" + query}
            stockData={stockData}
            newsData={newsData}
            sentimentDomain={sentimentDomain}
          />
        )}
      </div>
    </div>
  );
};

export default DashBoard;
