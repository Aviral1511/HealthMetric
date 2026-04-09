import express from 'express';
import cors from 'cors';

import vaccinesRoutes from './routes/vaccines.routes.js';
import summaryRoutes from './routes/summary.routes.js';
import insightsRoutes from './routes/insights.routes.js';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost (dev) & any vercel.app domain
    if (
      !origin || 
      origin.includes("localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/vaccines', vaccinesRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/insights', insightsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;
