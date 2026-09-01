import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
