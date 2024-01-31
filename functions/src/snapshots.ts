import { onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { SnapShot, ListParams, GetParams } from "./interfaces";

initializeApp();

const db = getFirestore();

const correctPostParams = (data: SnapShot) => {
  return (
    typeof data.uid == "string" &&
    typeof data.name == "string" &&
    typeof data.dateRange == "string" &&
    typeof data.stockData == "object" &&
    typeof data.newsData == "object"
  );
};

const correctGetParams = (data: GetParams) => {
  return typeof data.id == "string";
};

const correctListParams = (data: ListParams) => {
  return typeof data.uid == "string";
};

exports.list = onCall(
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
    if (!correctListParams(request.data)) {
      throw new Error("Invalid request");
    }

    const { uid } = request.data;

    const snapshot = db
      .collection("snapshots")
      .where("uid", "==", uid)
      .select("name", "dateRange")
      .get();

    const results = (await snapshot).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return results;
  },
);

exports.get = onCall(
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
    if (!correctGetParams(request.data)) {
      throw new Error("Invalid request");
    }

    const { id } = request.data;

    const snapshot = db.collection("snapshots").doc(id).get();

    const results = (await snapshot).data();

    return results;
  },
);

exports.add = onCall(
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
    if (!correctPostParams(request.data)) {
      throw new Error("Invalid request");
    }
    const { uid, name, dateRange, stockData, newsData } = request.data;

    db.collection("snapshots").add({
      uid,
      name,
      dateRange,
      stockData,
      newsData,
    });
  },
);
