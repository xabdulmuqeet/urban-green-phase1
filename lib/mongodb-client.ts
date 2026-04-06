import { MongoClient } from "mongodb";
import { isValidMongoConnectionString } from "@/lib/mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export default function getMongoClientPromise() {
  if (!isValidMongoConnectionString(MONGODB_URI)) {
    throw new Error(
      "Missing or invalid MONGODB_URI environment variable. Add a real MongoDB connection string."
    );
  }

  const mongoUri = MONGODB_URI!;

  if (!global.mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    global.mongoClientPromise = client.connect();
  }

  return global.mongoClientPromise;
}
