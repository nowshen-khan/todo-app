import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.DATABASE_URL) {
  throw new Error("Please add your MongoDB URI to .env");
}

if (process.env.NODE_ENV === "development") {
  // development: prevent multiple connections
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
