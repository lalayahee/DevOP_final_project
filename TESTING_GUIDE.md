# Testing Guide - How to Run and Test

## 🚀 Quick Start

### Step 1: Start All Services

```bash
# Navigate to project directory
cd DevOP_final_project

# Start all services (including observability)
docker-compose up --build
```

This will start:
- ✅ User Service (port 3001)
- ✅ Product Service (port 3002)
- ✅ Order Service (port 3003)
- ✅ Prometheus (port 9090)
- ✅ Grafana (port 3000)
- ✅ Loki (port 3100)
- ✅ Promtail

**Note**: First run may take a few minutes to download images and build containers.

### Step 2: Verify Services Are Running

Open a new terminal and check:

```bash
# Check all containers are running
docker-compose ps

# Check logs
docker-compose logs -f
```

You should see all services showing as "Up".

## 🧪 Testing the Services

### Test 1: Health Checks

Test that all services are responding:

```bash
# User Service
curl http://localhost:3001/

# Product Service
curl http://localhost:3002/

# Order Service
curl http://localhost:3003/
```

**Expected Response**: Each should return "User Service OK", "Product Service OK", or "Order Service OK"

### Test 2: Create a User

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Expected Response**: 
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "__v": 0
}
```

**Save the `_id`** - you'll need it for creating orders!

### Test 3: Get User by ID

```bash
# Replace <user-id> with the _id from previous step
curl http://localhost:3001/users/<user-id>
```

### Test 4: Create a Product

```bash
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cool T-Shirt",
    "price": 29.99,
    "category": "trendy",
    "description": "A really cool t-shirt"
  }'
```

**Expected Response**: Product object with `_id`

**Save the `_id`** - you'll need it for creating orders!

### Test 5: List All Products

```bash
curl http://localhost:3002/products
```

### Test 6: Filter Products by Category

```bash
curl http://localhost:3002/products?category=trendy
```

### Test 7: Get Product by ID

```bash
# Replace <product-id> with the _id from step 4
curl http://localhost:3002/products/<product-id>
```

### Test 8: Create an Order (Full Integration Test)

This tests inter-service communication:

```bash
# Replace <user-id> and <product-id> with actual IDs from previous steps
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<user-id>",
    "productId": "<product-id>"
  }'
```

**Expected Response**: Order object with user and product details

### Test 9: Get Order by ID

```bash
# Replace <order-id> with the _id from step 8
curl http://localhost:3003/orders/<order-id>
```

### Test 10: Error Handling - Invalid User ID

```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "invalid-user-id",
    "productId": "<valid-product-id>"
  }'
```

**Expected Response**: Error message indicating user not found

## 📊 Testing Observability Tools

### Access Grafana

1. Open browser: http://localhost:3000
2. Login:
   - Username: `admin`
   - Password: `admin`
3. Navigate to **Dashboards** → **Browse**
4. You should see "Microservices Monitoring" dashboard

### Access Prometheus

1. Open browser: http://localhost:9090
2. Try a query:
   ```
   up{job="user-service"}
   ```
3. Click **Execute** to see if the service is up

### View Logs in Grafana

1. In Grafana, go to **Explore** (compass icon)
2. Select **Loki** as data source
3. Query: `{job="containerlogs"}`
4. Click **Run query** to see container logs

## 🔍 Complete Test Script

Save this as `test-services.sh` and run it:

```bash
#!/bin/bash

echo "🧪 Testing E-Commerce Microservices"
echo "===================================="

# Test 1: Health Checks
echo -e "\n1. Testing Health Checks..."
echo "User Service:"
curl -s http://localhost:3001/ && echo ""
echo "Product Service:"
curl -s http://localhost:3002/ && echo ""
echo "Order Service:"
curl -s http://localhost:3003/ && echo ""

# Test 2: Create User
echo -e "\n2. Creating User..."
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}')
echo $USER_RESPONSE
USER_ID=$(echo $USER_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "User ID: $USER_ID"

# Test 3: Create Product
echo -e "\n3. Creating Product..."
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 99.99, "category": "trendy", "description": "Test description"}')
echo $PRODUCT_RESPONSE
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Product ID: $PRODUCT_ID"

# Test 4: Create Order
echo -e "\n4. Creating Order..."
ORDER_RESPONSE=$(curl -s -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\", \"productId\": \"$PRODUCT_ID\"}")
echo $ORDER_RESPONSE

echo -e "\n✅ All tests completed!"
```

Make it executable and run:
```bash
chmod +x test-services.sh
./test-services.sh
```

## 🐛 Troubleshooting

### Services Not Starting

```bash
# Check what's wrong
docker-compose logs

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build --force-recreate
```

### Port Already in Use

If you get "port already in use" error:

```bash
# Find what's using the port
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Kill the process or change ports in docker-compose.yml
```

### MongoDB Connection Issues

If services can't connect to MongoDB:

1. Check MongoDB URL in `docker-compose.yml`
2. Verify MongoDB Atlas allows connections from your IP
3. Check service logs: `docker-compose logs user-service`

### Services Can't Communicate

```bash
# Check network
docker network ls
docker network inspect devop_final_project_microservices-network

# Check service logs
docker-compose logs order-service
```

## 📝 Manual Testing with Postman

You can also use the Postman collection:

1. Import `Microservices_E-Commerce.postman_collection.json` into Postman
2. Set environment variables:
   - `base_url`: `http://localhost:3001` (for user service)
   - `base_url_product`: `http://localhost:3002`
   - `base_url_order`: `http://localhost:3003`
3. Run the collection

## ✅ Verification Checklist

- [ ] All services start without errors
- [ ] Health checks return OK
- [ ] Can create a user
- [ ] Can create a product
- [ ] Can create an order (inter-service communication works)
- [ ] Grafana is accessible
- [ ] Prometheus is accessible
- [ ] Can view logs in Grafana
- [ ] Services appear in Prometheus targets

## 🎯 Next Steps After Testing

1. **Add more test data**:
   ```bash
   # Create multiple users and products
   # Test various scenarios
   ```

2. **Monitor in Grafana**:
   - Create custom dashboards
   - Set up alerts

3. **Check logs**:
   - View service logs in Grafana Explore
   - Filter by service name

4. **Test error scenarios**:
   - Invalid data
   - Missing fields
   - Non-existent IDs

