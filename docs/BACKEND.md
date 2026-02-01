# Backend Documentation

Node.js + Express + TypeScript + MongoDB backend for ENET'Com Forum Platform.

## Architecture

- **Entry Point**: `src/server.ts`
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (HTTP-only cookies)
- **Real-time**: Socket.io

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for Access Token |
| `JWT_REFRESH_SECRET` | Secret for Refresh Token |
| `CLIENT_URL` | Frontend URL for CORS |
| `FASTAPI_URL` | Internal AI Service URL |
| `INTERNAL_API_KEY` | Secret for secure Internal communication |

## Directory Structure

- `src/config`: DB and Env config
- `src/controllers`: Request handlers
- `src/middleware`: Auth, Logging, Error handling
- `src/models`: Mongoose Schemas (User, Job, CV, etc.)
- `src/routes`: API Route definitions
- `src/services`: External integrations (AI, Email, PDF)

## AI Service Integration

Connects to `/backendRef` (FastAPI) for:
- ATS Scoring
- AI Interview Questions
- Skills Extraction

Authenticated via `X-Internal-Key` header.
