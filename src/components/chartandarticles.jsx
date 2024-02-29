import Graph from "./graph";
import Article from "./article";
import GradientLegend from "./gradientlegend";
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
        date={article.published_date}
        url={article.link}
        sentiment={article.s}
      />,
    );
  });

  return (
    <>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body flex flex-col items-center">
          <h2 className="card-title">{title}</h2>
          <Graph
            stockData={stockData}
            newsData={newsData}
            width={chartWidth}
            height={chartHeight}
            handleSetArticles={handleSetArticles}
          />
          <GradientLegend width={chartWidth / 2} height={30} />
        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>
      {articleElements.length === 0 ? (
        <div className="w-64 h-100 mr-10"></div>
      ) : (
        <>
          <div className="overflow-y-scroll no-scrollbar w-64 h-100 mr-10">
            {articleElements}
          </div>
        </>
      )}
    </>
  );
};

export default ChartAndArticles;
