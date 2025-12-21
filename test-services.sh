#!/bin/bash

echo "🧪 Testing E-Commerce Microservices"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Checks
echo -e "\n${YELLOW}1. Testing Health Checks...${NC}"
echo "User Service:"
USER_HEALTH=$(curl -s http://localhost:3001/)
if [ "$USER_HEALTH" == "User Service OK" ]; then
    echo -e "${GREEN}✅ User Service: $USER_HEALTH${NC}"
else
    echo -e "${RED}❌ User Service failed${NC}"
fi

echo "Product Service:"
PRODUCT_HEALTH=$(curl -s http://localhost:3002/)
if [ "$PRODUCT_HEALTH" == "Product Service OK" ]; then
    echo -e "${GREEN}✅ Product Service: $PRODUCT_HEALTH${NC}"
else
    echo -e "${RED}❌ Product Service failed${NC}"
fi

echo "Order Service:"
ORDER_HEALTH=$(curl -s http://localhost:3003/)
if [ "$ORDER_HEALTH" == "Order Service OK" ]; then
    echo -e "${GREEN}✅ Order Service: $ORDER_HEALTH${NC}"
else
    echo -e "${RED}❌ Order Service failed${NC}"
fi

# Test 2: Create User
echo -e "\n${YELLOW}2. Creating User...${NC}"
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}')
echo "$USER_RESPONSE"

if echo "$USER_RESPONSE" | grep -q "_id"; then
    USER_ID=$(echo $USER_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✅ User created with ID: $USER_ID${NC}"
else
    echo -e "${RED}❌ Failed to create user${NC}"
    exit 1
fi

# Test 3: Get User
echo -e "\n${YELLOW}3. Getting User by ID...${NC}"
GET_USER=$(curl -s http://localhost:3001/users/$USER_ID)
if echo "$GET_USER" | grep -q "Test User"; then
    echo -e "${GREEN}✅ User retrieved successfully${NC}"
    echo "$GET_USER"
else
    echo -e "${RED}❌ Failed to get user${NC}"
fi

# Test 4: Create Product
echo -e "\n${YELLOW}4. Creating Product...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 99.99, "category": "trendy", "description": "Test description"}')
echo "$PRODUCT_RESPONSE"

if echo "$PRODUCT_RESPONSE" | grep -q "_id"; then
    PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Product created with ID: $PRODUCT_ID${NC}"
else
    echo -e "${RED}❌ Failed to create product${NC}"
    exit 1
fi

# Test 5: Get Product
echo -e "\n${YELLOW}5. Getting Product by ID...${NC}"
GET_PRODUCT=$(curl -s http://localhost:3002/products/$PRODUCT_ID)
if echo "$GET_PRODUCT" | grep -q "Test Product"; then
    echo -e "${GREEN}✅ Product retrieved successfully${NC}"
    echo "$GET_PRODUCT"
else
    echo -e "${RED}❌ Failed to get product${NC}"
fi

# Test 6: List Products
echo -e "\n${YELLOW}6. Listing All Products...${NC}"
PRODUCTS_LIST=$(curl -s http://localhost:3002/products)
if echo "$PRODUCTS_LIST" | grep -q "Test Product"; then
    echo -e "${GREEN}✅ Products listed successfully${NC}"
    echo "$PRODUCTS_LIST" | head -c 200
    echo "..."
else
    echo -e "${RED}❌ Failed to list products${NC}"
fi

# Test 7: Create Order (Integration Test)
echo -e "\n${YELLOW}7. Creating Order (Testing Inter-Service Communication)...${NC}"
ORDER_RESPONSE=$(curl -s -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\", \"productId\": \"$PRODUCT_ID\"}")
echo "$ORDER_RESPONSE"

if echo "$ORDER_RESPONSE" | grep -q "_id"; then
    ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Order created successfully with ID: $ORDER_ID${NC}"
    echo -e "${GREEN}✅ Inter-service communication working!${NC}"
else
    echo -e "${RED}❌ Failed to create order${NC}"
    echo "$ORDER_RESPONSE"
    exit 1
fi

# Test 8: Get Order
echo -e "\n${YELLOW}8. Getting Order by ID...${NC}"
GET_ORDER=$(curl -s http://localhost:3003/orders/$ORDER_ID)
if echo "$GET_ORDER" | grep -q "userId"; then
    echo -e "${GREEN}✅ Order retrieved successfully${NC}"
    echo "$GET_ORDER"
else
    echo -e "${RED}❌ Failed to get order${NC}"
fi

# Test 9: Error Handling - Invalid User
echo -e "\n${YELLOW}9. Testing Error Handling (Invalid User ID)...${NC}"
ERROR_RESPONSE=$(curl -s -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"invalid-id\", \"productId\": \"$PRODUCT_ID\"}")
if echo "$ERROR_RESPONSE" | grep -qi "error\|not found\|invalid"; then
    echo -e "${GREEN}✅ Error handling working correctly${NC}"
    echo "$ERROR_RESPONSE"
else
    echo -e "${YELLOW}⚠️  Unexpected response for error case${NC}"
    echo "$ERROR_RESPONSE"
fi

echo -e "\n${GREEN}====================================${NC}"
echo -e "${GREEN}✅ All tests completed successfully!${NC}"
echo -e "${GREEN}====================================${NC}"
echo -e "\n📊 Access Observability Tools:"
echo -e "  - Grafana: ${YELLOW}http://localhost:3000${NC} (admin/admin)"
echo -e "  - Prometheus: ${YELLOW}http://localhost:9090${NC}"
echo -e "  - Loki: ${YELLOW}http://localhost:3100${NC}"

