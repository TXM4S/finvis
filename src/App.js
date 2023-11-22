import './styles/App.css';
import LineChart from './components/linechart';
import Article from './components/article';
import * as d3 from 'd3';
import { useState, useEffect } from 'react';
import SyncLoader from "react-spinners/SyncLoader";

function App() {

  const ticker = "AAPL";
  // YYYY-MM-DD
  const from = "2023-10-22";
  const to = "2023-11-22";




  const [stockData, setStockData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(null);
  const [articles, setArticles] = useState([]);

  const handleRangeChange = (range) => {
    setRange(range);
  }

  const getStockData = () => {
    const url = "https://api.polygon.io/v2/aggs/ticker/" + ticker +  "/range/1/day/" + from + "/" + to + "?adjusted=true&sort=asc&apiKey=9kVdlgF1pSXdyja_Va0A_kaIY2M73Tqa";
    setLoading(true);
    return fetch(url)
    .then((response) => response.json())
    .then((data) => {setStockData(data.results); setLoading(false);})
  }

  const getNewsData = () => {
    if (range == null) {
        return null;
    }

    const from = parseDate(range[0]);
    const to = parseDate(range[1]);

    console.log(from);
    console.log(to);

    const url = "https://newsapi.org/v2/everything?q=AAPL&from="+ from +"&to="+ to +"&sortBy=publishedAt&apiKey=28741d24c78d4657b5de4ae5aa2080f1";

    console.log(url);

    return fetch(url)
    .then((response) => response.json())
    .then((data) => {setNewsData(data); setLoading(false);})
  }

  const populateArticles = () => { 
    if(newsData.articles == null) {
      return null;
    }
    let temp = [];
    newsData.articles.forEach((article) => {
      temp.push(
        <Article title={article.title} author={article.author} url={article.url} date={article.publishedAt} />
      );
    })
    setArticles(temp);
  }

  useEffect(() => {
    getStockData();
  }, []);

  useEffect(() => {
    getNewsData();
    populateArticles();
    console.log(articles)
  }, [range]);


  const parseDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


  return (
    <div className="App">
      <h1>FinVis</h1>
      <div className='Info'>
        <h2>Stock: {ticker}</h2>
        <h2>From: {from}</h2> 
        <h2>To: {to}</h2>
        {(range == null) ?  <h2>Range : unselected </h2> : <h2>Range: {parseDate(range[0])} to {parseDate(range[1])}</h2>}
      </div>
      {(loading) ? <SyncLoader color='white'/> : <LineChart data={stockData} width={1200} height={300} handleRangeChange={handleRangeChange} />}
      {articles}
    </div>
  );
}

export default App;
