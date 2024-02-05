import { onCall } from "firebase-functions/v2/https";
import { Article, NewsDataParams } from "./interfaces";
import * as vader from "vader-sentiment";

const isNewsDataParams = (data: NewsDataParams) => {
  return (
    typeof data.query == "string" &&
    typeof data.from == "string" &&
    typeof data.to == "string"
  );
};

export const mutateNewsData = (articles: Article[]) => {
  const articlesWithTimestamps = articles.map((article: Article) => {
    const articleDate = new Date(article.publishedAt);
    articleDate.setHours(0, 0, 0, 0);
    return { ...article, t: articleDate.getTime() };
  });

  const articlesWithSentiments = articlesWithTimestamps.map(
    (article: Article & { t: number }) => {
      const sentiment = getSentiment(article.title);
      return { ...article, s: sentiment };
    },
  );

  const reduced = articlesWithSentiments.reduce(
    (
      grouped: { [key: number]: (Article & { t: number; s: number })[] },
      article: Article & { t: number; s: number },
    ) => {
      (grouped[article.t] = grouped[article.t] || []).push(article);
      return grouped;
    },
    {},
  );

  delete reduced[0];

  return reduced;
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

const getSentiment = (text: string) => {
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  return intensity.compound;
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
