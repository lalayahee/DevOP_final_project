# Deployment Guide

This document describes how to deploy the microservices stack locally (Docker Compose) and to Heroku (container registry). It also includes notes about rotating secrets and production best practices.

---

## Local deployment with Docker Compose

The easiest way to run the entire stack (services + monitoring) is with Docker Compose. From the repo root:

```bash
# build images and start everything
docker-compose up --build

# start in detached mode
docker-compose up -d --build

# view logs
docker-compose logs -f

# stop and remove containers
docker-compose down
```

Ports exposed locally (defaults):

- user-service: 3001
- product-service: 3002
- order-service: 3003
- grafana: 3000
- prometheus: 9090
- loki: 3100


### Environment variables in Compose

`docker-compose.yml` currently includes environment entries for `MONGO_URL` with example Atlas strings. You should NOT keep real credentials in the file. Replace the inline values with either environment variable references or use a `.env` file (recommended with `.env` in `.gitignore`).

Example (use in Compose):

```yaml
environment:
  - MONGO_URL=${USER_MONGO_URL}
```

Then set the variable in your environment or in a local `.env` file:

```bash
# .env (do not commit this file)
USER_MONGO_URL=mongodb+srv://username:password@cluster0.example.mongodb.net/user_db
```


## Deploying to Heroku (Container Registry)

This project contains `Procfile`s in service folders and a top-level `app.json`. Two Heroku deployment approaches are common:

A) Build & push container images to Heroku Container Registry (recommended when using Docker)

1. Login to Heroku container registry:

```bash
heroku container:login
```

2. For each service, build and push the image:

```bash
# Example for user-service
cd user-service
heroku create your-app-user-service  # only once per app
heroku container:push web -a your-app-user-service
heroku container:release web -a your-app-user-service
```

3. Set config vars (secrets) in Heroku rather than in the repo:

```bash
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-user-service
heroku config:set NODE_ENV=production -a your-app-user-service
```

4. For `order-service`, set `USER_URL` and `PRODUCT_URL` to point to the deployed user/product Heroku URLs. Use secure HTTPS URLs in production.

```bash
heroku config:set USER_URL=https://your-app-user-service.herokuapp.com -a your-app-order-service
heroku config:set PRODUCT_URL=https://your-app-product-service.herokuapp.com -a your-app-order-service
```

B) Git push to Heroku (Heroku buildpacks) — only if using Node buildpacks and not containers. Make sure a `Procfile` exists in the application root for the app you push.


## Production best practices

- Do not store secrets in source control. Use Heroku config vars, cloud secret stores (AWS Secrets Manager, Azure Key Vault, etc.) or an environment variables strategy.
- Use TLS/HTTPS for all inter-service communication in production.
- Add rate-limiting, authentication, input validation and proper error handling.
- Use a managed MongoDB cluster with network restrictions and rotate credentials periodically.
- Pin container images to specific versions (avoid `latest` in production), and use multi-stage Docker builds for smaller images.


## Rotating leaked credentials

If you discover credentials in this repository (e.g., a MongoDB connection string pushed earlier), do the following immediately:

1. Log into the MongoDB Atlas console.
2. Create a new database user with a strong password and least privileges needed.
3. Update the app to use the new credentials via environment variables (or Heroku config vars).
4. Remove or revoke the old user credentials in Atlas.
5. Audit access logs for suspicious activity.


## Notes about CI/CD (GitHub Actions)

- The provided GitHub Actions workflow builds containers and runs docker-compose integration tests. If you want to have automatic deployments, add a `deploy` job that pushes images to your container registry or triggers Heroku releases.
- Keep API keys and tokens in GitHub Secrets and reference them in the workflow.


## Useful commands

Start the whole stack (rebuild):

```bash
docker-compose up --build
```

Stop and remove everything:

```bash
docker-compose down -v
```

Check Grafana (once running):

- URL: http://localhost:3000
- Default admin credentials: `admin` / `admin` (change in production)

Check Prometheus targets:

- http://localhost:9090/targets


---

If you'd like, I can:

- Replace inline credentials in `docker-compose.yml` with environment references and add a `.env.example` (no real secrets).
- Add Heroku deploy job to the CI workflow using GitHub Actions and Heroku credentials stored as repository secrets.

Which of those would you like me to implement next?