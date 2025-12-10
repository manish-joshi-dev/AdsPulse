# AdsPulse - Google Ads Diagnostic Engine

AdsPulse is a full-stack diagnostic dashboard for Google Ads CSV exports. Advertisers upload a campaign performance CSV, the API normalizes the export, computes account and campaign-level metrics, produces a composite Performance Score, detects week-over-week anomalies, and generates prioritized recommendations with Gemini when `GEMINI_API_KEY` is configured.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Query, Recharts, Framer Motion
- Backend: Node.js, Express, MongoDB/Mongoose, Upstash Redis, Bull TCP fallback, Multer, csv-parse
- AI: Gemini via the official Google Generative AI SDK, installed through the `google-generativeai` npm alias
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database, Upstash Redis queue

## Local Development

1. Install backend dependencies.

   ```bash
   cd server
   npm install
   ```

2. Install frontend dependencies.

   ```bash
   cd ../client
   npm install
   ```

3. Create backend environment variables.

   ```bash
   cd ../
   cp .env.example server/.env
   ```

4. Start the API.

   ```bash
   cd server
   npm run dev
   ```

5. Start the React app in a second terminal.

   ```bash
   cd client
   npm run dev
   ```

6. Open `http://localhost:5173`.

The frontend proxies `/api` requests to `http://localhost:5000`. If MongoDB is not configured in development, the API uses in-memory report/user storage. If Upstash Redis is not configured, synchronous CSV analysis still works and async upload jobs are disabled.

## Environment Variables

Create `server/.env` from `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Optional locally | Gemini API key used for AI recommendations. If omitted, deterministic recommendations are generated from diagnostic rules. |
| `MONGODB_URI` | Required in production | MongoDB Atlas connection string for users and reports. |
| `UPSTASH_REDIS_REST_URL` | Required in production | Upstash Redis REST URL used for async analysis job records and queue polling. |
| `UPSTASH_REDIS_REST_TOKEN` | Required in production | Upstash Redis REST token. Keep this server-side only. |
| `REDIS_URL` | Optional fallback | Redis TCP connection string. Used only when Upstash REST credentials are not present. |
| `PORT` | Yes | Express server port. Defaults to `5000`. |
| `NODE_ENV` | Yes | `development`, `test`, or `production`. |
| `CLIENT_URL` | Yes | Allowed CORS origin for the frontend, such as `http://localhost:5173` or the Vercel URL. |
| `JWT_SECRET` | Required in production | Long random secret for signing auth tokens. |

## API Overview

- `GET /api/health` returns service status.
- `POST /api/auth/register` creates a user account.
- `POST /api/auth/login` returns a JWT.
- `GET /api/auth/me` returns the authenticated user.
- `POST /api/upload` accepts a `file` multipart CSV upload and returns a completed report.
- `POST /api/upload?async=true` queues analysis through Upstash Redis when REST credentials are configured.
- `GET /api/upload/jobs/:jobId` returns async analysis job status.
- `GET /api/analysis` lists analysis reports.
- `GET /api/analysis/latest` returns the newest report.
- `GET /api/analysis/:id` returns one report.
- `GET /api/reports` lists reports.
- `GET /api/reports/summary` returns report history totals.
- `GET /api/reports/:id` returns one report.
- `DELETE /api/reports/:id` deletes one report.

## CSV Expectations

AdsPulse accepts standard Google Ads CSV exports with campaign performance columns. The parser supports common header variants including `Campaign`, `Date` or `Day`, `Impr.` or `Impressions`, `Clicks`, `Cost`, `Conversions`, `CTR`, `Avg. CPC`, `Conv. rate`, and `Cost / conv.`. Metadata rows before the header are skipped automatically.

A sample CSV is available at `client/public/sample-google-ads.csv`.

## Deployment Guide

### MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write permissions.
3. Add the Render outbound IPs or allow access from `0.0.0.0/0` if your security policy permits it.
4. Copy the connection string into `MONGODB_URI`.

### Upstash Redis

1. Create an Upstash Redis database.
2. Copy the REST URL into `UPSTASH_REDIS_REST_URL`.
3. Copy the REST token into `UPSTASH_REDIS_REST_TOKEN`.
4. Do not expose the REST token to the Vercel frontend. It belongs only in the Render backend environment.

### Render Backend

1. Create a new Render Web Service from this repository.
2. Set the root directory to `server`.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add environment variables from `.env.example`.
6. Set `NODE_ENV=production`.
7. Set `CLIENT_URL` to the final Vercel frontend URL.
8. Deploy and confirm `https://your-render-service.onrender.com/api/health` returns `status: ok`.

### Vercel Frontend

1. Create a new Vercel project from this repository.
2. Set the root directory to `client`.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add a rewrite so `/api/:path*` forwards to the Render backend, or set a Vercel project proxy to the backend URL.
6. Deploy and test CSV upload from the Vercel URL.

For Vercel rewrites, add this to `client/vercel.json` if you prefer repository-managed routing:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-render-service.onrender.com/api/:path*"
    }
  ]
}
```

## Production Notes

- Keep `server/uploads` ephemeral. Uploaded CSVs are removed after synchronous analysis and after async worker completion.
- Use a long random `JWT_SECRET`.
- Restrict `CLIENT_URL` to the exact deployed frontend origin.
- Keep Gemini failures non-blocking; the backend falls back to rule-based recommendations.
- Monitor Render logs for async job failures and Gemini quota errors.
