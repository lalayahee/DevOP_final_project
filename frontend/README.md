# Frontend — Microservices E-Commerce

This is a minimal React + Vite frontend to interact with the microservices backend.

Quick start (local):

1. Install dependencies

```bash
cd frontend
npm install
```

2. Run dev server (Vite)

```bash
npm run dev
```

3. Build for production

```bash
npm run build
npm run preview
```

Environment variables

- Copy `.env.example` → `.env` and adjust `VITE_USER_URL`, `VITE_PRODUCT_URL`, `VITE_ORDER_URL` if needed.

Docker

Build & run production container:

```bash
cd frontend
docker build -t devop_frontend .
docker run -p 8080:80 devop_frontend
```

The dev server runs on http://localhost:5173 by default; production container serves on port 80 (map to 8080 as above).