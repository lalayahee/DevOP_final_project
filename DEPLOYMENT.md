# Deployment Guide

## Quick Deployment Checklist

### ✅ Completed Setup

1. **Local Development** ✅
   - Docker Compose configured
   - All services containerized
   - Network configuration complete

2. **Dockerized Deployment** ✅
   - Individual Dockerfiles for each service
   - Docker Compose orchestration
   - Service dependencies configured

3. **CI/CD Pipeline** ✅
   - Automated testing
   - Docker image building
   - Integration testing
   - Automated Heroku deployment

4. **Cloud Deployment (Heroku)** ✅
   - Procfile for each service
   - Heroku container registry support
   - Automated deployment via GitHub Actions

5. **Observability** ✅
   - Prometheus for metrics
   - Grafana for visualization
   - Loki for log aggregation
   - Promtail for log collection

## Heroku Deployment Steps

### 1. Create Heroku Apps

```bash
heroku create your-app-user-service
heroku create your-app-product-service
heroku create your-app-order-service
```

### 2. Configure Environment Variables

```bash
# User Service
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-user-service
heroku config:set PORT=3001 -a your-app-user-service

# Product Service
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-product-service
heroku config:set PORT=3002 -a your-app-product-service

# Order Service
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-order-service
heroku config:set PORT=3003 -a your-app-order-service
heroku config:set USER_URL=https://your-app-user-service.herokuapp.com -a your-app-order-service
heroku config:set PRODUCT_URL=https://your-app-product-service.herokuapp.com -a your-app-order-service
```

### 3. Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `HEROKU_API_KEY`: Get with `heroku auth:token`
- `HEROKU_USER_SERVICE_APP`: Your user service app name
- `HEROKU_PRODUCT_SERVICE_APP`: Your product service app name
- `HEROKU_ORDER_SERVICE_APP`: Your order service app name

### 4. Deploy

**Automatic (via CI/CD):**
- Push to `main` branch
- CI/CD pipeline will automatically deploy

**Manual:**
```bash
# Using Git
cd user-service
heroku git:remote -a your-app-user-service
git push heroku main

# Using Container Registry
heroku container:login
heroku container:push web -a your-app-user-service
heroku container:release web -a your-app-user-service
```

## Observability Setup

### Start Observability Stack

```bash
docker-compose up -d prometheus grafana loki promtail
```

### Access Dashboards

- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Loki**: http://localhost:3100

### Configure Grafana

1. Login to Grafana
2. Datasources are auto-configured:
   - Prometheus: http://prometheus:9090
   - Loki: http://loki:3100
3. Import dashboard from `monitoring/grafana/dashboards/`

## CI/CD Pipeline Flow

```
Push to main branch
    ↓
Run Tests (User, Product, Order Services)
    ↓
Build Docker Images
    ↓
Docker Compose Integration Test
    ↓
Deploy to Heroku (All 3 Services)
    ↓
Deployment Complete ✅
```

## Monitoring Endpoints

### Service Health Checks

- User Service: `GET /` → "User Service OK"
- Product Service: `GET /` → "Product Service OK"
- Order Service: `GET /` → "Order Service OK"

### Metrics Endpoints (Future)

- `/metrics` - Prometheus metrics (to be implemented)

## Troubleshooting

### Heroku Deployment Fails

1. Check Heroku API key is valid
2. Verify app names in GitHub secrets match actual Heroku apps
3. Check Heroku logs: `heroku logs --tail -a <app-name>`

### Observability Services Not Starting

1. Check ports 3000, 9090, 3100 are not in use
2. Verify docker-compose.yml configuration
3. Check logs: `docker-compose logs prometheus grafana loki`

### Service Communication Issues

1. Verify service URLs are correct
2. Check network configuration in docker-compose.yml
3. For Heroku: Use full HTTPS URLs
4. For Docker: Use service names

## Next Steps

1. ✅ Add metrics endpoints to services
2. ✅ Implement health check endpoints with detailed status
3. ✅ Set up alerting in Prometheus
4. ✅ Create custom Grafana dashboards
5. ✅ Add distributed tracing (Jaeger/OpenTelemetry)

