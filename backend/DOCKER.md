# 🐳 Docker Setup Guide

## 📋 Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
cd backend

# Copy environment file
cp .env.docker .env

# Edit .env and change passwords/secrets
# IMPORTANT: Change JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, DB_PASSWORD

# Start all services (MySQL + Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### Option 2: Build and Run Manually

```bash
cd backend

# Build image
docker build -t cr-management-backend .

# Run MySQL container
docker run -d \
  --name cr-mysql \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=cr_management \
  -e MYSQL_USER=cr_user \
  -e MYSQL_PASSWORD=cr_password \
  -p 3306:3306 \
  mysql:8.0

# Wait for MySQL to be ready (30 seconds)
sleep 30

# Run backend container
docker run -d \
  --name cr-backend \
  --link cr-mysql:mysql \
  -e DB_HOST=mysql \
  -e DB_USERNAME=cr_user \
  -e DB_PASSWORD=cr_password \
  -e JWT_ACCESS_SECRET=your_secret \
  -e JWT_REFRESH_SECRET=your_secret \
  -p 3000:3000 \
  cr-management-backend
```

## 📦 Services

### Backend API
- **Port**: 3000
- **Health Check**: http://localhost:3000/health
- **API Base**: http://localhost:3000/api

### MySQL Database
- **Port**: 3306
- **Database**: cr_management
- **User**: cr_user (default)
- **Password**: Set in .env file

## 🔧 Configuration

### Environment Variables

Edit `.env` file before starting:

```env
# Database
DB_PASSWORD=your_secure_password_here

# JWT Secrets (MUST CHANGE IN PRODUCTION!)
JWT_ACCESS_SECRET=generate_random_string_here
JWT_REFRESH_SECRET=generate_random_string_here

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### Generate Secure Secrets

```bash
# Generate random secrets (Linux/Mac)
openssl rand -base64 32

# Generate random secrets (Windows PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## 📊 Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f mysql

# Stop services
docker-compose stop

# Start stopped services
docker-compose start

# Restart services
docker-compose restart

# Remove containers (keeps volumes)
docker-compose down

# Remove containers and volumes (deletes data!)
docker-compose down -v

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec mysql mysql -u root -p
```

## 🗄️ Database Management

### Access MySQL Shell

```bash
# Using docker-compose
docker-compose exec mysql mysql -u root -p

# Using docker directly
docker exec -it cr-management-mysql mysql -u root -p
```

### Run Migrations

```bash
# Migrations run automatically on container start
# To run manually:
docker-compose exec backend npm run migration:run
```

### Seed Users

```bash
docker-compose exec backend npx ts-node -r tsconfig-paths/register src/utils/seed-users.ts
```

### Backup Database

```bash
# Backup
docker-compose exec mysql mysqldump -u root -p cr_management > backup.sql

# Restore
docker-compose exec -T mysql mysql -u root -p cr_management < backup.sql
```

## 📁 Volumes

### Persistent Data

- `mysql_data`: MySQL database files
- `./uploads`: File uploads (mounted from host)
- `./logs`: Application logs (mounted from host)

### View Volumes

```bash
docker volume ls
docker volume inspect backend_mysql_data
```

## 🔍 Debugging

### View Container Logs

```bash
# All logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f backend
```

### Access Container Shell

```bash
# Backend container
docker-compose exec backend sh

# MySQL container
docker-compose exec mysql bash
```

### Check Container Health

```bash
# View health status
docker-compose ps

# Inspect health check
docker inspect cr-management-backend | grep -A 10 Health
```

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3001
```

#### 2. Database Connection Failed

```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

#### 3. Migration Failed

```bash
# Check database exists
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"

# Manually run migrations
docker-compose exec backend npm run migration:run
```

## 🚀 Production Deployment

### Build Production Image

```bash
# Build optimized image
docker build -t cr-management-backend:1.0.0 .

# Tag for registry
docker tag cr-management-backend:1.0.0 your-registry/cr-management-backend:1.0.0

# Push to registry
docker push your-registry/cr-management-backend:1.0.0
```

### Production Environment

```env
NODE_ENV=production
LOG_LEVEL=warn

# Use strong passwords
DB_PASSWORD=<strong-random-password>
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>

# Use production database
DB_HOST=your-production-db-host

# Use production frontend URL
CORS_ORIGIN=https://your-production-domain.com
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Use HTTPS in production
- [ ] Configure firewall rules
- [ ] Enable Docker security scanning
- [ ] Use secrets management (Docker Secrets, Vault)
- [ ] Regular security updates
- [ ] Monitor container logs
- [ ] Backup database regularly

## 📊 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats cr-management-backend
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# MySQL health
docker-compose exec mysql mysqladmin ping -h localhost -u root -p
```

## 🧪 Testing

### Run Tests in Container

```bash
# Build test image
docker build --target builder -t cr-backend-test .

# Run tests
docker run --rm cr-backend-test npm test
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## 🎯 Next Steps

1. ✅ Docker setup complete
2. ⏭️ Configure CI/CD pipeline
3. ⏭️ Setup monitoring (Prometheus, Grafana)
4. ⏭️ Configure log aggregation (ELK Stack)
5. ⏭️ Setup container orchestration (Kubernetes)

---

**Built with ❤️ by SOLASHI Vietnam**
