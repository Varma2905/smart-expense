import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smartexpense';
    
    // Set connection options with timeout so fallback happens fast if local mongo is down
    const options = {
      serverSelectionTimeoutMS: 3000,
    };

    await mongoose.connect(mongoUri, options);
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to primary URI (${error.message}). Initializing In-Memory Mongo Server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB Memory Server] Connected successfully to ${uri}`);
    } catch (memErr) {
      console.error('[MongoDB] Memory server error:', memErr);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
