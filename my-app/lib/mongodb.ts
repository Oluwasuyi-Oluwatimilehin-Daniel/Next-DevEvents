import mongoose from "mongoose";

// Retrieve the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global interface to cache the mongoose connection.
 * Caching prevents establishing multiple connections during development hot-reloads.
 */
interface MongooseCached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declaring the cached variable on the global scope to ensure TypeScript is aware of it
declare global {
  var mongoose: MongooseCached | undefined;
}

// Access the global variable to check for existing connection caching
const cached: MongooseCached = global.mongoose || { conn: null, promise: null };

// If there's no cached object on global, assign it
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Returns the cached connection if already established.
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If connection is already established, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is not already in flight, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if connection drops
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, clear the promise cache so subsequent requests can retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
