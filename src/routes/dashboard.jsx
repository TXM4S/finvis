import React, { useState, useEffect } from "react";
import LineChart from "../components/linechart.jsx";
import Article from "../components/article.jsx";
import { SyncLoader } from "react-spinners";
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
  const [from, setFrom] = useState("2023-11-12");
  const [to, setTo] = useState("2023-12-12");

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

  const handleSetArticles = (articles) => {
    setArticles(articles);
  };

  return isLoading ? (
    <></>
  ) : (
    <div class="flex flex-col justify-center w-full lg:flex-row">
      <div class="card w-fit bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Apple</h2>
          <LineChart
            stockData={stockData}
            newsData={newsData}
            width={1000}
            height={250}
            handleSetArticles={handleSetArticles}
          />
        </div>
      </div>
      {articleElements.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="divider lg:divider-horizontal"></div>
          <div className="overflow-y-scroll no-scrollbar h-96 ">
            {articleElements}
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
