// backend/src/types.ts
export interface LeaderboardEntry {
  id?: string;
  repo_url: string;
  repo_name: string;
  score: number;
  baseline_approved: boolean;
  suggestions_count: number;
  badges_earned: number;
  analyzed_at?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  message?: string;
  entry?: LeaderboardEntry;
  rank?: number;
  totalEntries?: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
}