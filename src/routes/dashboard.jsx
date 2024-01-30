import React, { useState, useEffect } from "react";
import LineChart from "../components/linechart.jsx";
import Article from "../components/article.jsx";
import SearchBar from "../components/searchbar.jsx"
import { getStockData, getNewsData } from "../firebase.js";
import { UserContext } from "../contexts/user";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

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
  const from = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10);

  const [stockData, setStockData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [articles, setArticles] = useState([]);

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

  let articleElements = [];

  articles.forEach((article) => {
    articleElements.push(
      <Article
        title={article.title}
        author={article.author}
        date={article.publishedAt}
        url={article.url}
      />,
    );
  });

  const handleSearch = () => {
    const queryInput = document.getElementById('queryInput').value || 'Apple';
    const tickerSelect = document.getElementById('tickerSelect').value;
    setQuery(queryInput);
    setTicker(tickerSelect);
    // Trigger data fetch here
  };

  const handleSetArticles = (articles) => {
    setArticles(articles);
  };

  return isLoading ? (
    <></>
  ) : (
    <div className="flex flex-col space-y-10 items-center">
      <h1 className="ml-10 text-5xl font-black self-start"> DASHBOARD </h1>
      <SearchBar handleSearch={handleSearch} />
      <div class="flex flex-col justify-center w-full lg:flex-row">
        <div class="card w-fit bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">{query}</h2>
            <LineChart
              stockData={stockData}
              newsData={newsData}
              width={1000}
              height={250}
              handleSetArticles={handleSetArticles}
            />
          </div>
        </div>
        <div className="divider lg:divider-horizontal"></div>
        {articleElements.length === 0 ? (
          <div className="w-96 h-96"></div>
        ) : (
          <>
            <div className="overflow-y-scroll no-scrollbar h-96 ">
              {articleElements}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
