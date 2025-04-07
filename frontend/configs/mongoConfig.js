import { MongoClient } from "mongodb";

// Your MongoDB connection configuration
const mongoConfig = {
  uri: "mongodb://localhost:27017/BDA", // Local MongoDB URI, can be replaced with Atlas or remote URI
  dbName: "BDA"                         // Your MongoDB database name
};

// Declare variables to hold the MongoDB connection and client instances
let dbInstance = null;
let clientInstance = null;

// Initialize MongoDB
export async function initializeMongo() {
  if (dbInstance) {
    // If the database instance is already created, return it
    return dbInstance;
  }

  try {
    // Create a new MongoClient and connect to the MongoDB server
    clientInstance = new MongoClient(mongoConfig.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Wait for the client to connect to the database
    await clientInstance.connect();
    console.log("Connected to MongoDB");

    // Access the specified database and store the instance
    dbInstance = clientInstance.db(mongoConfig.dbName);
    
    return dbInstance; // Return the connected database instance
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw new Error("Failed to connect to MongoDB");
  }
}

// Optional: Function to close the connection (can be used for cleanup)
export async function closeMongoConnection() {
  if (clientInstance) {
    await clientInstance.close();
    console.log("MongoDB connection closed.");
  }
}

// Optional: Export the client instance if needed
export const getClient = () => clientInstance;
