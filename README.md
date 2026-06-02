# VedaAI – AI-Powered Assessment Generation Platform

VedaAI is a full-stack AI-powered assessment creation platform designed to help teachers generate structured question papers instantly. The platform automates assignment creation, AI-based question generation, answer key creation, real-time processing, and assignment management through an interactive dashboard.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VedaAI Architecture                        │
│                                                                     │
│  ┌──────────────────┐          ┌────────────────────────────────┐  │
│  │   Next.js 14     │  HTTPS   │     Express + TypeScript       │  │
│  │   Frontend       │◄────────►│     REST API (port 4000)      │  │
│  │                  │          │                                │  │
│  │  Zustand Store   │  WSS     │     WebSocket Server (/ws)    │  │
│  │  useJobSocket()  │◄────────►│     (same HTTP server)        │  │
│  └──────────────────┘          └───────────┬────────────────────┘  │
│                                             │                       │
│                                    ┌────────▼──────────┐           │
│                                    │   BullMQ Queue    │           │
│                                    │   (Redis/Upstash) │           │
│                                    └────────┬──────────┘           │
│                                             │                       │
│                                    ┌────────▼──────────┐           │
│                                    │  Background Worker │           │
│                                    │  (worker.ts)      │           │
│                                    │                   │           │
│                                    │  1. Reads file    │           │
│                                    │  2. Calls Groq AI │           │
│                                    │  3. Saves to DB   │           │
│                                    │  4. Publishes to  │           │
│                                    │     Redis Pub/Sub │           │
│                                    └────────┬──────────┘           │
│                                             │ Redis Pub/Sub         │
│                                    ┌────────▼──────────┐           │
│                                    │  WS Server picks  │           │
│                                    │  up notification  │           │
│                                    │  → pushes to      │           │
│                                    │    browser        │           │
│                                    └───────────────────┘           │
│                                                                     │
│  MongoDB Atlas ← Assignment + QuestionPaper stored here             │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow (Happy Path)

```
1.  Teacher fills form → Zustand captures state
2.  POST /api/assignments (multipart FormData with optional file)
3.  Backend validates → saves Assignment to MongoDB (status: pending)
4.  Job enqueued to BullMQ via Redis
5.  Response 201 sent → frontend redirects to /assignments/:id
6.  useJobSocket() opens WebSocket and subscribes by assignmentId
7.  Worker picks up job:
      a. Reads TXT file content from disk (if uploaded)
      b. Builds structured prompt with question types + content
      c. Calls Groq llama-3.3-70b with JSON response_format
      d. Parses + validates structured JSON
      e. Saves QuestionPaper to MongoDB
      f. Updates Assignment status → completed
      g. Publishes to Redis channel ws:notify
8.  WS Server subscribes to ws:notify → broadcasts to browser
9.  Browser receives completed event → fetches paper via GET /api/assignments/:id/paper
10. OutputPage renders sections, difficulty badges, answer key
```

---

## Approach & Design Decisions

### Why Groq + Llama-3.3-70b?
- Groq provides extremely fast inference (sub-2s generation for most papers)
- `response_format: { type: 'json_object' }` guarantees parseable JSON — no raw AI text is ever rendered to the user
- Structured prompt forces section-by-section generation with difficulty distribution (40% Easy, 40% Moderate, 20% Hard)

### Why BullMQ + Redis?
- AI generation can take 5–40 seconds — too long for a synchronous HTTP request
- BullMQ provides automatic retries, concurrency control, and job progress tracking
- Redis Pub/Sub is used for worker→WebSocket notification so the two processes don't need to share memory

### Why Zustand?
- Lightweight, zero-boilerplate state for the multi-step assignment form
- FormStore persists across step navigation without prop drilling
- AssignmentStore caches the list so sidebar badge counts work instantly

### Why WebSockets over polling?
- Polling wastes bandwidth and creates noticeable status update delays
- WebSockets allow instant push notification when the paper is ready
- The server uses a Map of `assignmentId → Set<WebSocket>` for targeted delivery

---

## Features

- ✅ AI-powered structured question paper generation (sections A, B, C…)
- ✅ Styled difficulty badges (Easy/Moderate/Hard) on each question
- ✅ Automatic answer key with toggle to show/hide
- ✅ Real-time assignment status via WebSocket + Redis Pub/Sub
- ✅ Redis queue-based background processing (BullMQ)
- ✅ TXT file upload content ingested into AI prompt
- ✅ Assignment regeneration support
- ✅ Status pills on assignment cards (pending / processing / completed / failed)
- ✅ Clean PDF export via browser print (full @media print stylesheet)
- ✅ Responsive teacher dashboard (desktop sidebar + mobile bottom nav)
- ✅ Production deployment: Vercel (frontend) + Render (backend) + Upstash (Redis)

---

## Tech Stack

| Layer                   | Technology                                    |
| ----------------------- | --------------------------------------------- |
| Frontend                | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend                 | Node.js, Express, TypeScript                  |
| Database                | MongoDB Atlas                                 |
| Queue System            | Redis (Upstash) + BullMQ                      |
| Real-time Communication | WebSockets (`ws`) + Redis Pub/Sub             |
| AI Integration          | Groq API (llama-3.3-70b-versatile)            |
| Deployment              | Vercel (frontend) + Render (backend)          |

---


## Local Setup Guide

Follow these steps in order to run VedaAI on your local machine.

### Prerequisites

Make sure the following are installed before you begin:

| Tool              | Version  | Purpose                        |
| ----------------- | -------- | ------------------------------ |
| Node.js           | 18+      | Runtime for frontend & backend |
| npm               | 8+       | Package manager                |
| Docker Desktop    | Latest   | Runs the Redis container       |
| Git               | Any      | Clone the repository           |

You will also need:
- A **Groq API Key** – [Get one at console.groq.com](https://console.groq.com)
- A **MongoDB Atlas URI** – [Create a free cluster at mongodb.com](https://www.mongodb.com/atlas)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Aditya060806/VedaAI.git
cd VedaAI
```

---

### Step 2 — Install Dependencies

Install packages for both the frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

> **Tip:** Alternatively, run `npm install` from the root to install workspaces together (requires `npm 8+`).

---

### Step 3 — Configure Environment Variables

You need two `.env` files — one for the backend and one for the frontend.

#### Backend — create `backend/.env`

```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000
```

> Replace `your_mongodb_atlas_connection_string` and `your_groq_api_key` with your real credentials.

#### Frontend — create `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

---

### Step 4 — Start the Redis Container

VedaAI uses Redis as the job queue. Start it via Docker:

```bash
# From the project root
docker-compose up -d
```

Verify Redis is running:

```bash
docker ps
# You should see a container named "vedaai-redis" or similar
```

---

### Step 5 — Start the Backend API Server

Open a **new terminal** and run:

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
✅ API server running on port 4000
```

---

### Step 6 — Start the Background Worker

Open another **new terminal** and run:

```bash
cd backend
npm run worker
```

Expected output:
```
✅ Worker connected to MongoDB
✅ Worker listening on queue: vedaai-jobs
```

> The worker is responsible for processing AI generation jobs from the Redis queue. It **must** be running alongside the backend for assignments to generate.

---

### Step 7 — Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

---

### Step 8 — Open the App

Visit the app in your browser:

```
http://localhost:3000
```

You should see the VedaAI dashboard. Create a new assignment to test the full flow!

---

## Running All Services (Quick Mode)

From the project root, you can start both the backend and frontend together using:

```bash
npm run dev
```

> Note: You still need to start Docker (`docker-compose up -d`) and the worker (`cd backend && npm run worker`) separately.

---

## API Endpoints

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/assignments`                | Fetch all assignments                |
| POST   | `/api/assignments`                | Create assignment and enqueue AI job |
| GET    | `/api/assignments/:id`            | Fetch assignment details             |
| DELETE | `/api/assignments/:id`            | Delete assignment                    |
| GET    | `/api/assignments/:id/paper`      | Fetch generated question paper       |
| POST   | `/api/assignments/:id/regenerate` | Regenerate question paper            |
| GET    | `/api/health`                     | Health check                         |

---

## WebSocket Events

Connect to the WebSocket endpoint:

```
ws://localhost:4000/ws          (local)
wss://your-backend.onrender.com/ws  (production)
```

### Subscribe to an Assignment

```json
{
  "type": "subscribe",
  "assignmentId": "assignment_id_here"
}
```

### Incoming Events

| Event type  | Description                        | Payload fields              |
| ----------- | ---------------------------------- | --------------------------- |
| `status`    | Assignment status changed          | `status`, `message`         |
| `completed` | Paper generated successfully       | `paperId`, `message`        |
| `failed`    | Generation failed                  | `message`                   |

Example payloads:

```json
{ "type": "status", "status": "processing", "message": "Generating your question paper..." }
```

```json
{ "type": "completed", "paperId": "paper_id_here", "message": "Question paper ready!" }
```

```json
{ "type": "failed", "message": "AI generation failed. Please try again." }
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set the following environment variables in the Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_WS_URL=wss://your-backend.onrender.com/ws
```

---

### Backend → Render

In your Render service settings:

| Setting       | Value                           |
| ------------- | ------------------------------- |
| Root Directory| `backend`                       |
| Build Command | `npm install && npm run build`  |
| Start Command | `npm run start:all`             |

Required environment variables on Render:

```env
MONGODB_URI=your_mongodb_atlas_uri
REDIS_URL=your_redis_url
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

> `npm run start:all` runs both the API server and the worker process concurrently.

---

## Production Architecture

```
Vercel (Frontend: Next.js)
          ↓  HTTP / WebSocket
Render (Backend: Express API + BullMQ Worker)
          ↓
  Redis Queue (Upstash / Render Redis)
          ↓
  MongoDB Atlas (Cloud Database)
          ↓
  Groq LLM API (AI Generation)
```

---

## Troubleshooting

| Problem                        | Solution                                                          |
| ------------------------------ | ----------------------------------------------------------------- |
| `Cannot connect to MongoDB`    | Check your `MONGODB_URI` is correct and Atlas network access allows your IP |
| `Redis connection refused`     | Make sure Docker is running and `docker-compose up -d` was executed |
| `Assignment stuck in "pending"`| The worker is not running — start it with `npm run worker`        |
| `CORS error in browser`        | Verify `FRONTEND_URL` in backend `.env` matches your frontend URL |
| `AI generation fails`          | Check your `GROQ_API_KEY` is valid and has quota remaining        |

---

## Future Enhancements

- [ ] PDF export for generated question papers
- [ ] Teacher authentication & role-based access
- [ ] Assignment analytics dashboard
- [ ] AI difficulty customization
- [ ] Multi-language question generation
- [ ] Classroom and student management
- [ ] Rich text editor for manual question editing

---

## Author

Developed and maintained by **Aditya Pandey**.

- GitHub: [@Aditya060806](https://github.com/Aditya060806)
- Repository: [VedaAI](https://github.com/Aditya060806/VedaAI)
