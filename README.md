# InterviewIQ — AI Interview Preparation

InterviewIQ is a three-tier interview-practice platform: a React client, protected Express/MongoDB API, and an independent FastAPI intelligence service. The AI service performs local NLP work (skill extraction, TF-IDF/cosine comparison and answer similarity) rather than treating an LLM as the application.

## Architecture

`React/Vite → Express API → MongoDB` for accounts and interview records. Express calls `FastAPI → NLP / scikit-learn` for question generation, evaluation, JD matching, and readiness prediction.

## Workspace structure

```
frontend/    React + Vite application
backend/     Express API, Mongoose models and JWT authentication
ai-service/  FastAPI NLP service and ML training workspace
```

## Local setup

1. Copy each `.env.example` to `.env` and set `MONGO_URI` plus a long `JWT_SECRET` in `backend/.env`.
2. Start MongoDB locally, or use a MongoDB Atlas connection string as `MONGO_URI`.
3. Run `npm install && npm run dev` inside `frontend/`.
4. Run `npm install && npm run dev` inside `backend/`.
5. Create a virtual environment in `ai-service/`, install `pip install -r requirements.txt`, then start `uvicorn app.main:app --reload --port 8000`.

The API waits for Mongoose to connect before it listens; a bad or unavailable `MONGO_URI` causes a clear startup failure instead of a misleading healthy server.

## Current API foundation

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health`
- AI service: `POST /generate-questions`, `POST /evaluate-answer`, `POST /analyze-job`

## MongoDB-backed application data

After signing in, the app saves each profile update and new mock-interview setup to MongoDB. Submitted practice answers are saved against that interview, and completing a session calculates and stores its score for the History and Dashboard views. The API only returns records belonging to the authenticated account.

Keep `MONGO_URI`, `JWT_SECRET`, and any API keys in `backend/.env`; never place them in frontend environment variables or commit them to Git. `backend/.env.example` contains the non-secret local MongoDB connection format.

## New practice experience

- **Practice studio** keeps the question, answer area, instant-feedback card, and talking points in separate responsive grid areas so cards do not overlap.
- **Progress tracker** provides a dedicated, visual view for readiness, practice streaks, and skill areas.
- **Ask InterviewIQ** calls `POST /api/assistant/ask`. Add `OPENAI_API_KEY` to `backend/.env` (copy `backend/.env.example`) to enable live OpenAI answers. Without a key it returns a clear local fallback.
- The free local practice bank is in `frontend/src/data/questionBank.js`; its freely accessible source references are listed in `frontend/src/data/SOURCES.md`.

## Verification

`npm run build` in `frontend/` completes successfully. The build currently warns that the initial JavaScript bundle is large because Recharts is bundled in the dashboard; route-level lazy loading is a suitable deployment optimization.
