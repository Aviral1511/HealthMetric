import express from 'express';
import cors from 'cors';

import vaccinesRoutes from './routes/vaccines.routes.js';
import summaryRoutes from './routes/summary.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vaccines', vaccinesRoutes);
app.use('/api/summary', summaryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;
