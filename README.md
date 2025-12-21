# E-Commerce Microservices Platform

A microservices-based e-commerce platform built with Node.js, Express, MongoDB, and Docker. The platform consists of three independent services: User Service, Product Service, and Order Service.

## 🏗️ Architecture

- **User Service** (Port 3001): Manages user accounts and authentication
- **Product Service** (Port 3002): Handles product catalog and inventory
- **Order Service** (Port 3003): Processes orders and coordinates with other services

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- MongoDB Atlas account (or local MongoDB instance)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DevOP_final_project
   ```

2. **Run with Docker Compose** (Recommended)
   ```bash
   docker-compose up --build
   ```

3. **Run services individually**
   ```bash
   # User Service
   cd user-service
   npm install
   npm start

   # Product Service (in another terminal)
   cd product-service
   npm install
   npm start

   # Order Service (in another terminal)
   cd order-service
   npm install
   npm start
   ```

### Environment Variables

Each service requires the following environment variables:

- `PORT`: Service port (defaults: 3001, 3002, 3003)
- `MONGO_URL`: MongoDB connection string
- `USER_URL`: User service URL (for Order Service)
- `PRODUCT_URL`: Product service URL (for Order Service)

## 🐳 Docker Deployment

### Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Service Containers

```bash
# Build a specific service
docker build -t user-service ./user-service

# Run a service
docker run -p 3001:3001 \
  -e MONGO_URL=<your-mongo-url> \
  -e PORT=3001 \
  user-service
```

## ☁️ Cloud Deployment (Heroku)

### Prerequisites

1. Heroku account
2. Heroku CLI installed
3. Three Heroku apps created (one for each service)

### Setup Heroku Apps

```bash
# Create Heroku apps
heroku create your-app-user-service
heroku create your-app-product-service
heroku create your-app-order-service

# Set environment variables
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-user-service
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-product-service
heroku config:set MONGO_URL=<your-mongo-url> -a your-app-order-service
heroku config:set USER_URL=https://your-app-user-service.herokuapp.com -a your-app-order-service
heroku config:set PRODUCT_URL=https://your-app-product-service.herokuapp.com -a your-app-order-service
```

### Manual Deployment

```bash
# Deploy User Service
cd user-service
heroku git:remote -a your-app-user-service
git push heroku main

# Deploy Product Service
cd ../product-service
heroku git:remote -a your-app-product-service
git push heroku main

# Deploy Order Service
cd ../order-service
heroku git:remote -a your-app-order-service
git push heroku main
```

### Container Registry Deployment

```bash
# Login to Heroku Container Registry
heroku container:login

# Build and push User Service
cd user-service
heroku container:push web -a your-app-user-service
heroku container:release web -a your-app-user-service

# Repeat for other services
```

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions CI/CD pipeline that:

1. **Tests**: Runs linting and tests for all services
2. **Builds**: Creates Docker images for each service
3. **Integration Tests**: Tests the full stack with docker-compose
4. **Deploys**: Automatically deploys to Heroku on push to main branch

### Setup CI/CD Secrets

Add the following secrets to your GitHub repository:

- `HEROKU_API_KEY`: Your Heroku API key
- `HEROKU_USER_SERVICE_APP`: Name of your user-service Heroku app
- `HEROKU_PRODUCT_SERVICE_APP`: Name of your product-service Heroku app
- `HEROKU_ORDER_SERVICE_APP`: Name of your order-service Heroku app

### Get Heroku API Key

```bash
heroku auth:token
```

Add this token as `HEROKU_API_KEY` in GitHub Secrets.

## 📊 Observability & Monitoring

The project includes comprehensive observability tools:

### Services Included

1. **Prometheus** (Port 9090): Metrics collection and storage
2. **Grafana** (Port 3000): Visualization and dashboards
3. **Loki** (Port 3100): Log aggregation
4. **Promtail**: Log collection agent

### Access Observability Tools

```bash
# Start all services including observability
docker-compose up -d

# Access Grafana
# URL: http://localhost:3000
# Username: admin
# Password: admin

# Access Prometheus
# URL: http://localhost:9090

# Access Loki
# URL: http://localhost:3100
```

### Viewing Metrics

1. **Grafana Dashboards**: 
   - Navigate to http://localhost:3000
   - Login with admin/admin
   - Go to Dashboards → Browse
   - View "Microservices Monitoring" dashboard

2. **Prometheus Queries**:
   - Navigate to http://localhost:9090
   - Use PromQL to query metrics
   - Example: `up{job="user-service"}`

3. **Logs in Grafana**:
   - In Grafana, go to Explore
   - Select "Loki" as data source
   - Query logs: `{job="containerlogs"}`

### Service Health Checks

All services expose health check endpoints:

- User Service: `GET http://localhost:3001/`
- Product Service: `GET http://localhost:3002/`
- Order Service: `GET http://localhost:3003/`

## 📝 API Documentation

### User Service

- `GET /` - Health check
- `POST /users` - Create user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `GET /users/:id` - Get user by ID

### Product Service

- `GET /` - Health check
- `GET /products` - List all products (optional: `?category=trendy`)
- `POST /products` - Create product
  ```json
  {
    "name": "Product Name",
    "price": 99.99,
    "category": "trendy",
    "description": "Product description"
  }
  ```
- `GET /products/:id` - Get product by ID

### Order Service

- `GET /` - Health check
- `POST /orders` - Create order
  ```json
  {
    "userId": "user-id",
    "productId": "product-id"
  }
  ```
- `GET /orders/:id` - Get order by ID

## 🧪 Testing

```bash
# Run tests for User Service
cd user-service
npm test

# Run linter
npm run lint
```

## 📁 Project Structure

```
DevOP_final_project/
├── user-service/          # User management service
│   ├── Dockerfile
│   ├── Procfile          # Heroku deployment
│   ├── models/
│   ├── routes/
│   └── server.js
├── product-service/       # Product catalog service
│   ├── Dockerfile
│   ├── Procfile
│   ├── models/
│   ├── routes/
│   └── server.js
├── order-service/         # Order processing service
│   ├── Dockerfile
│   ├── Procfile
│   ├── models/
│   ├── routes/
│   └── server.js
├── monitoring/            # Observability configurations
│   ├── prometheus.yml
│   ├── loki-config.yml
│   ├── promtail-config.yml
│   └── grafana/
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD pipeline
├── docker-compose.yml    # Local development & observability
├── heroku.yml           # Heroku container deployment
└── app.json             # Heroku app configuration
```

## 🔧 Configuration

### MongoDB

The services use MongoDB Atlas by default. To use a local MongoDB instance:

1. Update `MONGO_URL` in `docker-compose.yml` or environment variables
2. Format: `mongodb://localhost:27017/<database-name>`

### Service Communication

Order Service communicates with User and Product services using:
- Docker Compose: Service names (e.g., `http://user-service:3001`)
- Heroku: Full URLs (e.g., `https://your-app.herokuapp.com`)

## 🚨 Troubleshooting

### Services not starting

```bash
# Check logs
docker-compose logs <service-name>

# Restart services
docker-compose restart
```

### MongoDB connection issues

- Verify `MONGO_URL` is correct
- Check network connectivity
- Ensure MongoDB Atlas IP whitelist includes your IP

### Heroku deployment issues

- Verify Heroku API key is set correctly
- Check app names match in GitHub secrets
- Review Heroku logs: `heroku logs --tail -a <app-name>`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Heroku Container Registry](https://devcenter.heroku.com/articles/container-registry-and-runtime)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 📄 License

ISC

## 👥 Contributors

[Your Name/Team]

---

**Note**: Remember to update MongoDB connection strings and Heroku app names with your actual values before deployment.
