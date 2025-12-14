# 4️⃣ Implementation Details (User / Product / Order)

## Overview

The e-commerce platform is built using a microservices architecture with three independent services: User Service, Product Service, and Order Service. Each service operates as a standalone Node.js application with its own MongoDB database, containerized using Docker, and orchestrated via Docker Compose.

---

## 1. User Service

### Technology Stack
- **Runtime**: Node.js 18
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB Atlas (user_db)
- **ORM**: Mongoose 8.20.2
- **Testing**: Mocha, Chai, Supertest
- **Linting**: ESLint

### Database Schema
The User model is defined using Mongoose with the following schema:
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}
```

### API Endpoints
- **GET `/`** - Health check endpoint (returns "User Service OK")
- **POST `/users`** - Create a new user
  - Request body: `{ name: string, email: string }`
  - Returns: Created user object (201) or error (400)
  - Handles duplicate email validation (error code 11000)
- **GET `/users/:id`** - Retrieve user by ID
  - Returns: User object (200) or 404 if not found

### Key Features
- Email uniqueness validation at the database level
- Comprehensive error handling for duplicate emails and invalid data
- Health check endpoint for service monitoring
- MongoDB Atlas connection with 5-second timeout configuration
- Runs on port 3001

### Containerization
- **Base Image**: node:18
- **Exposed Port**: 3001
- **Dockerfile Strategy**: Multi-stage build with dependency caching
- Environment variables: `PORT`, `MONGO_URL`

---

## 2. Product Service

### Technology Stack
- **Runtime**: Node.js 18
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB Atlas (product_db)
- **ORM**: Mongoose 9.0.1

### Database Schema
The Product model includes validation for category enumeration:
```javascript
{
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['trendy', 'minimalist', 'aesthetic', 'meme', 'artistic', 'vintage']
  },
  description: { type: String, required: true }
}
```

### API Endpoints
- **GET `/`** - Health check endpoint (returns "Product Service OK")
- **GET `/products`** - List all products or filter by category
  - Query parameter: `category` (optional)
  - Returns: Array of products matching the query
- **POST `/products`** - Create a new product
  - Request body: `{ name, price, category, description }`
  - Returns: Created product object (201) or error (400)
- **GET `/products/:id`** - Retrieve product by ID
  - Returns: Product object (200) or 404 if not found

### Key Features
- Category-based filtering via query parameters
- Strict category validation using enum values
- Price and description validation
- Health check endpoint for service monitoring
- MongoDB Atlas connection with error handling
- Runs on port 3002

### Containerization
- **Base Image**: node:18
- **Exposed Port**: 3002
- **Dockerfile Strategy**: Standard Node.js containerization
- Environment variables: `PORT`, `MONGO_URL`

---

## 3. Order Service

### Technology Stack
- **Runtime**: Node.js 18
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB Atlas (order_db)
- **ORM**: Mongoose 8.20.2
- **HTTP Client**: Axios 1.13.2 (for inter-service communication)

### Database Schema
The Order model stores order information with denormalized product data:
```javascript
{
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}
```

### API Endpoints
- **GET `/`** - Health check endpoint (returns "Order Service OK")
- **POST `/orders`** - Create a new order with validation
  - Request body: `{ userId: string, productId: string }`
  - **Inter-service Communication**:
    - Validates user existence by calling User Service (`GET /users/:userId`)
    - Validates product existence by calling Product Service (`GET /products/:productId`)
    - Retrieves product details (name, price) for order creation
  - Returns: Created order object (201) or appropriate error (400, 404, 500)
- **GET `/orders/:id`** - Retrieve order by ID
  - Returns: Order object (200) or 404 if not found

### Key Features
- **Service Orchestration**: Acts as an orchestrator, calling User and Product services
- **Data Validation**: Ensures both user and product exist before order creation
- **Error Handling**: Comprehensive error handling for:
  - Missing required fields (userId, productId)
  - User not found (404)
  - Product not found (404)
  - Service communication failures (500)
- **Data Denormalization**: Stores product name and price in order for historical accuracy
- **Service Dependencies**: Configured to depend on user-service and product-service in Docker Compose
- **Environment Configuration**: Uses `USER_URL` and `PRODUCT_URL` for service discovery
- Runs on port 3003

### Inter-Service Communication
The Order Service implements synchronous HTTP calls using Axios:
- **User Service Integration**: `http://user-service:3001/users/:userId`
- **Product Service Integration**: `http://product-service:3002/products/:productId`
- Service URLs are configurable via environment variables for flexibility

### Containerization
- **Base Image**: node:18
- **Exposed Port**: 3003
- **Dockerfile Strategy**: Standard Node.js containerization
- **Dependencies**: Configured with `depends_on` in docker-compose.yml
- Environment variables: `PORT`, `MONGO_URL`, `USER_URL`, `PRODUCT_URL`

---

## Architecture Patterns

### Microservices Communication
- **Pattern**: Synchronous HTTP/REST API calls
- **Service Discovery**: Docker Compose service names (user-service, product-service)
- **Network**: Bridge network (`microservices-network`) for inter-container communication

### Database Strategy
- **Database per Service**: Each service has its own MongoDB database on Atlas
  - `user_db` for User Service
  - `product_db` for Product Service
  - `order_db` for Order Service
- **Connection**: MongoDB Atlas cloud database with connection string configuration

### Container Orchestration
- **Tool**: Docker Compose
- **Network**: Custom bridge network for service isolation
- **Restart Policy**: `unless-stopped` for all services
- **Port Mapping**:
  - User Service: 3001:3001
  - Product Service: 3002:3002
  - Order Service: 3003:3003

### Error Handling Strategy
- Consistent error response format across all services
- HTTP status codes: 200 (success), 201 (created), 400 (bad request), 404 (not found), 500 (server error)
- Database error handling (duplicate keys, validation errors)
- Inter-service communication error handling with proper status code propagation

---

## Development & Deployment

### Local Development
- Each service can run independently using `npm start` or `npm run dev`
- Docker Compose provides unified development environment
- Environment variables configured via `.env` or docker-compose.yml

### Production Considerations
- Health check endpoints for monitoring and load balancing
- Graceful error handling and service degradation
- Database connection pooling via Mongoose
- Container restart policies for high availability
