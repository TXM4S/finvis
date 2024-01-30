import { onCall } from "firebase-functions/v2/https";

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

const isNewsDataParams = (data: any) => {
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
