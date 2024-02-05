export interface NewsDataParams {
  query: string;
  from: string;
  to: string;
}

export interface Article {
  title: string;
  author: string;
  source: {
    id: string;
    name: string;
  };
  publishedAt: string;
  url: string;
}

export interface StockDataParams {
  ticker: string;
  from: string;
  to: string;
}

export interface StockPoint {
  t: number;
  c: number | null;
  ec: number | null;
}

export interface SnapShot {
  uid: string;
  name: string;
  dateRange: string;
  stockData: StockPoint[];
  newsData: { [key: number]: Article[] };
}

export interface ListParams {
  uid: string;
}

export interface GetParams {
  id: string;
}
