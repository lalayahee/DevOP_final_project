# Quick Access Guide 🚀

## ✅ All Services Are Running!

### 🌐 Access URLs

Open these URLs in your web browser:

#### **Grafana Dashboard** (Visualization)
- **URL**: http://localhost:3000
- **Username**: `admin`
- **Password**: `admin`
- **What it does**: Shows graphs and dashboards for monitoring your services

#### **Prometheus** (Metrics)
- **URL**: http://localhost:9090
- **What it does**: Collects and stores metrics from your services
- **Try this**: Type `up{job="user-service"}` in the query box and click "Execute"

#### **Loki** (Logs API)
- **URL**: http://localhost:3100
- **What it does**: Stores logs from all your services
- **Note**: This is an API endpoint, use Grafana to view logs

### 🔧 Your Microservices

#### **User Service**
- **URL**: http://localhost:3001
- **Test**: `curl http://localhost:3001/`
- **Response**: "User Service OK"

#### **Product Service**
- **URL**: http://localhost:3002
- **Test**: `curl http://localhost:3002/`
- **Response**: "Product Service OK"

#### **Order Service**
- **URL**: http://localhost:3003
- **Test**: `curl http://localhost:3003/`
- **Response**: "Order Service OK"

## 📊 How to Use Grafana

1. **Open**: http://localhost:3000
2. **Login**: 
   - Username: `admin`
   - Password: `admin`
3. **View Dashboards**:
   - Click "Dashboards" (icon on left)
   - Click "Browse"
   - You should see "Microservices Monitoring"
4. **View Logs**:
   - Click "Explore" (compass icon)
   - Select "Loki" from dropdown
   - Type: `{job="containerlogs"}`
   - Click "Run query"

## 🔍 How to Use Prometheus

1. **Open**: http://localhost:9090
2. **Query Metrics**:
   - Type in the query box: `up`
   - Click "Execute"
   - See all services that are "up" (running)
3. **Check Specific Service**:
   - Query: `up{job="user-service"}`
   - Should return `1` if service is running

## 🐛 Troubleshooting

### If you see "Connection Refused" or blank page:

1. **Check if services are running**:
   ```bash
   docker-compose ps
   ```
   All services should show "Up"

2. **Check service logs**:
   ```bash
   docker-compose logs grafana
   docker-compose logs prometheus
   ```

3. **Restart a service**:
   ```bash
   docker-compose restart grafana
   ```

### If Grafana shows login but nothing loads:

- Wait 30 seconds for Grafana to fully initialize
- Refresh the page
- Try clearing browser cache

### If Prometheus shows no targets:

- Wait a few seconds for Prometheus to discover services
- Go to: http://localhost:9090/targets
- Check if services show as "UP"

## ✅ Quick Test

Run this to test everything:

```bash
# Test all services
curl http://localhost:3001/  # User Service
curl http://localhost:3002/  # Product Service  
curl http://localhost:3003/  # Order Service

# Check if Grafana is accessible
curl http://localhost:3000/login

# Check if Prometheus is accessible
curl http://localhost:9090/api/v1/status/config
```

All should return something (not "Connection refused")!

## 🎯 Next Steps

1. **Open Grafana**: http://localhost:3000
2. **Explore the dashboard**
3. **Run the test script**: `./test-services.sh`
4. **View logs in Grafana**: Explore → Loki → `{job="containerlogs"}`

Enjoy monitoring your microservices! 🎉

