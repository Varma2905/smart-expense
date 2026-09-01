import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect Database & Start Express Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 SmartExpense Backend running on port ${PORT}`);
    console.log(`   Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);
  });
};

startServer();
