# E‑Commerce Microservices — Project Documentation

This document explains the project architecture, how the services fit together, how to run the stack locally, how to use the APIs, observability, CI, and deployment notes.

## Table of contents

- Project overview
- Architecture and components
- Service details (endpoints, data shapes)
- Environment variables
- Local development (npm + Docker Compose)
- Observability (Prometheus, Grafana, Loki)
- CI (GitHub Actions)
- Security notes (secrets handling)
- Troubleshooting
- Next steps and improvement ideas

---

## Project overview

This repository contains a small e‑commerce microservices example implemented in Node.js + Express with MongoDB as the backing datastore. The project is intentionally small and split into three services:

- user-service (port 3001) — manages users
- product-service (port 3002) — manages products
- order-service (port 3003) — processes orders and coordinates with the other services

Each service is independent, with its own Dockerfile, package.json, and MongoDB database. The project includes a `docker-compose.yml` that runs the services together and adds observability components: Prometheus, Grafana, Loki, and Promtail.


## Architecture and components

- Node.js microservices using Express.
- MongoDB (Atlas or local) per service.
- Docker per service + Docker Compose for local integration.
- Observability:
  - Prometheus (metrics)
  - Grafana (visualization + dashboards)
  - Loki + Promtail (logs)
- CI: GitHub Actions workflow builds and runs basic checks and docker-compose integration tests.


## Service details

### user-service

- Base URL: `http://localhost:3001` (by default)
- Endpoints:
  - `GET /` — health check, returns a short text
  - `POST /users` — create a user
    - body: `{ "name": string, "email": string }`
  - `GET /users/:id` — fetch user by id
- Data model (Mongoose `User`):
  - `name` (string, required)
  - `email` (string, required, unique)


### product-service

- Base URL: `http://localhost:3002` (by default)
- Endpoints:
  - `GET /` — health check
  - `GET /products` — list products (optional `?category=` filter)
  - `POST /products` — create product
    - body: `{ "name": string, "price": number, "category": string, "description": string }`
  - `GET /products/:id` — fetch product by id
- Data model (Mongoose `Product`): `name`, `price`, `category`, `description`.


### order-service

- Base URL: `http://localhost:3003` (by default)
- Endpoints:
  - `GET /` — health check
  - `POST /orders` — create order. Example request body:
    ```json
    {
      "userId": "<user-id>",
      "productId": "<product-id>"
    }
    ```
  - `GET /orders/:id` — fetch order by id
- Behavior: the service validates the `userId` and `productId` by calling the `user-service` and `product-service` before creating the `Order` document. The created order stores a snapshot of the product name and price to preserve historical accuracy.


## Environment variables

Each service reads the following environment variables (set them in your environment or via a `.env` file when developing locally):

- `PORT` — port the service listens on (defaults: 3001, 3002, 3003)
- `MONGO_URL` — MongoDB connection string for that service's DB

Order service additional variables:

- `USER_URL` — URL for user service (used by `order-service` to validate users)
- `PRODUCT_URL` — URL for product service (used by `order-service` to validate products)

Notes:

- Do NOT commit secrets to source control. Use environment variables, `.env` (gitignored), or a secrets manager for production credentials.


## Local development

Prerequisites

- Node.js 18+ (for development commands)
- Docker & Docker Compose (recommended for running the full stack)


1) Run services individually (for debugging)

```bash
# In each service folder
cd user-service
npm install
npm start

# In another terminal
cd product-service
npm install
npm start

# In another terminal
cd order-service
npm install
npm start
```

2) Run the full stack with Docker Compose (recommended)

From the repo root:

```bash
docker-compose up --build
```

This starts:

- user-service → http://localhost:3001
- product-service → http://localhost:3002
- order-service → http://localhost:3003
- prometheus → http://localhost:9090
- grafana → http://localhost:3000 (default admin/admin)
- loki → http://localhost:3100

To run detached:

```bash
docker-compose up -d --build
```

To stop:

```bash
docker-compose down
```


3) Quick smoke tests

```bash
# Create user
curl -X POST -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com"}' http://localhost:3001/users

# Create product
curl -X POST -H "Content-Type: application/json" -d '{"name":"Cool Shirt","price":19.99,"category":"trendy","description":"A cool shirt"}' http://localhost:3002/products

# Create order (replace ids returned above)
curl -X POST -H "Content-Type: application/json" -d '{"userId":"<user-id>","productId":"<product-id>"}' http://localhost:3003/orders
```


## Observability

This project includes Prometheus, Grafana, Loki and Promtail in `docker-compose.yml`.

- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090
- Loki: http://localhost:3100

Important note: Prometheus is configured to scrape `/metrics` on the three services. The Node services do not currently expose `/metrics` by default — if you want metrics in Grafana, add basic instrumentation (see next section).

How to enable metrics quickly (suggested)

- Add `prom-client` to each service (`npm install prom-client`) and expose `/metrics`:

```js
const client = require('prom-client');
client.collectDefaultMetrics();
app.get('/metrics', (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(client.register.metrics());
});
```

After exposing `/metrics`, Prometheus will begin scraping and Grafana dashboards will populate.

Logs

- Promtail reads the Docker container logs and forwards them to Loki. Dashboards and Explore in Grafana can query logs via the Loki datasource.


## CI (GitHub Actions)

The project includes a GitHub Actions workflow at `.github/workflows/ci.yml` that:

1. Lints and checks each service (user-service includes lint/test tools in its package.json)
2. Builds Docker images per service
3. Runs a docker-compose integration test

Notes & improvements:

- Tests that rely on MongoDB will need a running MongoDB during the job (CI currently sets `MONGO_URL` to `mongodb://localhost:27017/test_db` for tests but does not start a MongoDB service). Consider using `mongodb-memory-server` for unit tests or adding a `services: mongodb` block in the workflow.


## Security notes

- Immediately rotate the MongoDB credentials that were found in the repository (they are sensitive and were committed by mistake).
- Add `.env.example` and add `.env` to `.gitignore`.
- Do not commit secrets (MONGO_URL, API keys, passwords, etc.). Use a secrets manager for production deployments.


## Troubleshooting

- If services fail to start, check container logs:

```bash
docker-compose logs -f <service-name>
```

- If Grafana dashboards are empty:
  - Confirm Prometheus targets at http://localhost:9090/targets
  - Confirm services expose `/metrics`
  - Confirm Promtail can read container logs (check promtail logs)

- If order creation fails with 500s:
  - Check that `USER_URL` and `PRODUCT_URL` are correct (in Compose they are set to the service names)
  - Ensure user and product services are healthy and reachable


## Next steps & improvements

- Remove hardcoded secrets and rotate credentials.
- Add `/metrics` instrumentation using `prom-client`.
- Add structured JSON logging (pino) for Loki-friendly logs.
- Add centralized error handling middleware in each service.
- Implement graceful shutdown handlers for each service.
- Add basic unit tests and use `mongodb-memory-server` for CI.


---

If you want, I can automatically add the following in this repo as small PRs:

- `.env.example` + `.gitignore` entry for `.env`
- `/metrics` instrumentation using `prom-client` in each service
- Graceful shutdown and improved error handling in `server.js`
- `dockerignore` files and Dockerfile improvements

Tell me which of these you'd like me to implement next.