import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export default function getMongoClientPromise() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!global.mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global.mongoClientPromise = client.connect();
  }

  return global.mongoClientPromise;
}
