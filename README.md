# Baseline Leaderboard Backend

Backend API for the Baseline Upgrade CLI leaderboard feature.

## Features

- ✅ RESTful API for leaderboard submissions
- ✅ Supabase database integration
- ✅ Health check endpoints
- ✅ CORS enabled for web frontend
- ✅ Deployable on Vercel

## API Endpoints

- `GET /health` - Health check
- `POST /api/leaderboard` - Submit new entry
- `GET /api/leaderboard` - Get leaderboard entries

## Environment Variables

Create a `.env` file with:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
NODE_ENV=development
```
Development
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```