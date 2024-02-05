import LineChart from "./linechart";
import Article from "./article";
import { useState } from "react";
import { useWindowDimensions } from "../utils/windowhandler";

const ChartAndArticles = (props) => {
  const { stockData, newsData, title } = props;
  const { width } = useWindowDimensions();
  // 40 + 256 + 80 + chartWidth + 80 + 256 + 40
  // ml-10 + w-64 + divider + chartWidth + divider + w-64 + mr-10
  // bad pratice hardcoding values but cant dynamically get tailwindcss values
  const chartWidth = width - 752;
  const chartHeight = 384;
  const [articles, setArticles] = useState([]);
  const handleSetArticles = (articles) => {
    setArticles(articles);
  };

  let articleElements = [];

  articles.forEach((article) => {
    articleElements.push(
      <Article
        title={article.title}
        author={article.author}
        date={article.publishedAt}
        url={article.url}
        sentiment={article.s}
      />,
    );
  });

  return (
    <>
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{title}</h2>
          <LineChart
            stockData={stockData}
            newsData={newsData}
            width={chartWidth}
            height={chartHeight}
            handleSetArticles={handleSetArticles}
          />
        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>
      {articleElements.length === 0 ? (
        <div className="w-64 h-100"></div>
      ) : (
        <>
          <div className="overflow-y-scroll no-scrollbar w-64 h-100">
            {articleElements}
          </div>
        </>
      )}
    </>
  );
};

export default ChartAndArticles;