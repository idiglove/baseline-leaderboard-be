// backend/src/leaderboard.ts
import { Request, Response } from 'express';
import { LeaderboardService } from './supabase';
import { LeaderboardEntry, LeaderboardResponse } from './types';

const leaderboardService = new LeaderboardService();

export class LeaderboardController {
  async addEntry(req: Request, res: Response) {
    try {
      const entryData: Omit<LeaderboardEntry, 'id' | 'analyzed_at'> = req.body;

      // Validate required fields
      if (!entryData.repo_url || !entryData.repo_name || entryData.score === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: repo_url, repo_name, score'
        });
      }



      const entry = await leaderboardService.addEntry(entryData);
      const rank = await leaderboardService.getEntryRank(entryData.score);
      const totalEntries = await leaderboardService.getTotalEntries();

      const response: LeaderboardResponse = {
        success: true,
        message: 'Successfully added to leaderboard!',
        entry,
        rank,
        totalEntries
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  async getLeaderboard(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const entries = await leaderboardService.getLeaderboard(limit);

      res.json({
        success: true,
        data: entries,
        count: entries.length
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch leaderboard'
      });
    }
  }

  async healthCheck(req: Request, res: Response) {
    try {
      // Test database connection
      await leaderboardService.getTotalEntries();

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      });
    }
  }
}