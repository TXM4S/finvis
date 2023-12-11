import './styles/App.css';
import LineChart from './components/linechart';
import Article from './components/article';
import { useState, useEffect } from 'react';
import SyncLoader from "react-spinners/SyncLoader";

function App() {

  const ticker = "AAPL";
  // YYYY-MM-DD
  const from = "2023-11-11";
  const to = "2023-12-11";

  const [stockData, setStockData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  let articleElements = [];
  articles.forEach((article) => {
    articleElements.push(<Article title={article.title} author={article.author} date={article.publishedAt} url={article.url} />);
  })

  const handleSetArticles = (articles) => {
    setArticles(articles);
  }

  const getStockData = () => {
    const url = "https://api.polygon.io/v2/aggs/ticker/" + ticker +  "/range/1/day/" + from + "/" + to + "?adjusted=true&sort=asc&apiKey=9kVdlgF1pSXdyja_Va0A_kaIY2M73Tqa";
    setLoading(true);
    return fetch(url)
    .then((response) => response.json())
    .then((data) => {setStockData(data.results); setLoading(false);})
  }

  const getNewsData = () => {
    const url = "https://newsapi.org/v2/everything?q=apple&from="+ from +"&to="+ to +"&sortBy=popular&apiKey=28741d24c78d4657b5de4ae5aa2080f1";

    return fetch(url)
    .then((response) => response.json())
    .then((data) => {setNewsData(organiseNewsData(data)); setLoading(false);})
  }

  const organiseNewsData = (data) => {
    data.articles.map((article) => {
      let articleDate = new Date(article.publishedAt);
      articleDate.setHours(0,0,0,0);
      article.publishedAt = articleDate.getTime();
    })

    return Object.groupBy(data.articles, ({publishedAt}) => publishedAt);
  }

  useEffect(() => {
    getStockData();
    getNewsData();
  }, []);

  return (
    <div className="App">
      <h1>FinVis</h1>
      <div className='Info'>
        <h2>Stock: {ticker}</h2>
        <h2>From: {from}</h2> 
        <h2>To: {to}</h2>
      </div>
      {(loading) ? <SyncLoader color='white'/> : <LineChart stockData={stockData} newsData={newsData} width={1200} height={300} handleSetArticles={handleSetArticles} />}
      {articleElements}
    </div>
  );
}

export default App;
