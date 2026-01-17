# Presight Frontend Exercise

This project is a small full-stack exercise built to demonstrate list virtualization, filtering, streaming responses, and async processing with workers and WebSockets.

The focus is correctness, performance, and clarity rather than UI polish.

---

## Tech stack

* Frontend: React + TypeScript + Vite
* Backend: Node.js + Express
* Virtual list: @tanstack/react-virtual
* Streaming: Fetch API + ReadableStream
* Async processing: Node worker_threads
* Real-time updates: WebSockets
* State: local React state
* Data: in-memory mock data

---

## Features implemented

### List & performance

* API Pagination through Virtual scrolling with infinite loading
* Only visible rows are rendered
* Search by first name and last name
* Sidebar filters (top 20 hobbies and nationalities)

### Streaming

* Backend API streams long text
* Frontend reads the response as a stream
* UI updates character by character while the stream is open

### Async processing

* API returns requests immediately as `pending`
* Requests are stored in an in-memory queue
* Processing happens in a worker thread (simulated delay)
* Results are pushed to the client over WebSocket
* UI updates from `pending → result` automatically

---

## Project structure

```
backend/
  src/
    routes/
    controllers/
    workers/
    websocket/

frontend/
  src/
    components/
    hooks/
    state/

shared/
  types/
  constants/
```

Shared types are used by both frontend and backend to avoid duplication.

---

## How to run

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:4000`

### Frontend

Create a .env file inside the frontend folder:

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_WS_BASE_URL=ws://localhost:4000
```
then run:

```bash
cd frontend
npm install
npm run dev
```


Runs on the port shown by Vite (usually `http://localhost:5173`)

---

## Notes

* All data is in memory (no database)
* Worker processing is simulated with a timeout
* WebSocket is used to avoid polling
* UI is intentionally simple

---

## Possible improvements

* Persist queue using Redis
* Add WebSocket reconnect handling
* Improve error handling and retries
* Move filtering and pagination to a real database
