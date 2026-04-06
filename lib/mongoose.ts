import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

function hasPlaceholderMongoValue(uri: string) {
  const normalized = uri.toLowerCase();

  return (
    normalized.includes("cluster.example.mongodb.net") ||
    normalized.includes("<password>") ||
    normalized.includes("<db_password>") ||
    normalized.includes("<dbname>") ||
    normalized.includes("username:password@")
  );
}

export function isValidMongoConnectionString(uri: string | undefined | null) {
  if (!uri) {
    return false;
  }

  const trimmed = uri.trim();

  if (!trimmed) {
    return false;
  }

  if (!trimmed.startsWith("mongodb://") && !trimmed.startsWith("mongodb+srv://")) {
    return false;
  }

  if (hasPlaceholderMongoValue(trimmed)) {
    return false;
  }

  return true;
}

export function isDatabaseConfigured() {
  return isValidMongoConnectionString(MONGODB_URI);
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase() {
  if (!isValidMongoConnectionString(MONGODB_URI)) {
    throw new Error(
      "Missing or invalid MONGODB_URI environment variable. Add a real MongoDB connection string."
    );
  }

  const mongoUri = MONGODB_URI!;

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      bufferCommands: false
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
