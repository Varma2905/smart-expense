import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  // Reuse active database connection in serverless environment
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      const options = {
        serverSelectionTimeoutMS: 5000,
      };
      await mongoose.connect(mongoUri, options);
      console.log(`[MongoDB] Connected successfully to Atlas/Remote DB`);
      return;
    } catch (error) {
      console.error(`[MongoDB] Primary connection error: ${error.message}`);
    }
  }

  // If on Vercel or production and MONGO_URI is missing/failing
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.warn(`[MongoDB] Running on Vercel/Production without a working MONGO_URI.`);
    try {
      const fallbackUri = mongoUri || 'mongodb://localhost:27017/smartexpense';
      await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 3000 });
    } catch (err) {
      console.error(`[MongoDB] Database connection failed: ${err.message}. Please set MONGO_URI in Vercel Environment Variables.`);
    }
    return;
  }

  // Local development fallback: MongoMemoryServer
  try {
    console.warn(`[MongoDB] Initializing In-Memory Mongo Server for local dev...`);
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`[MongoDB Memory Server] Connected successfully to ${uri}`);
  } catch (memErr) {
    console.error('[MongoDB] Memory server error:', memErr);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
