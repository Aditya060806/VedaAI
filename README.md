# VedaAI – AI-Powered Assessment Generation Platform

VedaAI is a full-stack AI-powered assessment creation platform designed to help teachers generate structured question papers instantly. The platform automates assignment creation, AI-based question generation, answer key creation, real-time processing, and assignment management through an interactive dashboard.

---

## Architecture Overview

```
VedaAI/
├── frontend/          # Next.js 14 + TypeScript + Tailwind CSS + Zustand
├── backend/           # Express + TypeScript + MongoDB + Redis + BullMQ
└── docker-compose.yml # Redis container setup
```

### System Workflow

```
Teacher creates assignment → POST /api/assignments
                                   ↓
                         Job added to BullMQ queue
                                   ↓
                          Worker processes request
                                   ↓
                     Groq LLM generates question paper
                                   ↓
                     Structured JSON response parsed
                                   ↓
                        Data stored in MongoDB
                                   ↓
                  WebSocket updates sent to frontend
                                   ↓
                  Generated paper rendered in UI
```

---

## Features

- ✅ AI-powered structured question paper generation
- ✅ Automatic answer key generation
- ✅ Real-time assignment status tracking using WebSockets
- ✅ Redis queue-based background processing with BullMQ
- ✅ Assignment regeneration support
- ✅ Modular monorepo architecture
- ✅ Fully responsive teacher dashboard
- ✅ Production deployment with Vercel + Render
- ✅ MongoDB Atlas cloud database integration

---

## Tech Stack

| Layer                   | Technology                                    |
| ----------------------- | --------------------------------------------- |
| Frontend                | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend                 | Node.js, Express, TypeScript                  |
| Database                | MongoDB Atlas                                 |
| Queue System            | Redis + BullMQ                                |
| Real-time Communication | WebSockets (`ws`)                             |
| AI Integration          | Groq LLM API                                  |
| Deployment              | Vercel (frontend) + Render (backend)          |
| Infrastructure          | Docker                                        |

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
