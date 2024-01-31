import { onCall } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

const correctPostParams = (data: any) => {
  return (
    typeof data.uid == "string" &&
    typeof data.stockData == "object" &&
    typeof data.newsData == "object"
  );
};

const correctGetParams = (data: any) => {
  return typeof data.uid == "string";
};

exports.post = onCall(
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
    const { uid, stockData, newsData } = request.data;

    db.collection("historicalData").add({ uid, stockData, newsData });
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

    const { uid } = request.data;

    // return all docs from historicalData where uid == uid
    //

    const docRef = db.collection("historicalData").where("uid", "==", uid);

    const docSnap = await docRef.get();

    return docSnap;
  },
);
