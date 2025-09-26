// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { LeaderboardController } from './leaderboard';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔧 Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Routes
const leaderboardController = new LeaderboardController();

app.get('/health', (req, res) => leaderboardController.healthCheck(req, res));
app.post('/api/leaderboard', (req, res) => leaderboardController.addEntry(req, res));
app.get('/api/leaderboard', (req, res) => leaderboardController.getLeaderboard(req, res));

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(port, () => {
  console.log(`🚀 Baseline Leaderboard API running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});