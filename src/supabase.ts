// backend/src/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from './types';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Now check the variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

console.log('✅ Supabase environment variables loaded successfully');

export const supabase = createClient(supabaseUrl, supabaseKey);

// Rest of the code remains the same...
export class LeaderboardService {
  async addEntry(entry: Omit<LeaderboardEntry, 'id' | 'analyzed_at'>): Promise<LeaderboardEntry> {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([entry])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add leaderboard entry: ${error.message}`);
    }

    return data;
  }

  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }

    return data || [];
  }

  async getEntryRank(score: number): Promise<number> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score')
      .gt('score', score)
      .order('score', { ascending: false });

    if (error) {
      throw new Error(`Failed to calculate rank: ${error.message}`);
    }

    return (data?.length || 0) + 1;
  }

  async getTotalEntries(): Promise<number> {
    const { count, error } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Failed to count entries: ${error.message}`);
    }

    return count || 0;
  }

  async entryExists(repo_url: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id')
      .eq('repo_url', repo_url)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to check entry existence: ${error.message}`);
    }

    return !!data;
  }
}