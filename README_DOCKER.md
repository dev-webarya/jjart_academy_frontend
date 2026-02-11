# 🐳 Docker Deployment Guide

## Prerequisites
- Docker installed
- Docker Compose installed
- `.env` file with Cloudinary credentials

## Quick Start

### 1. Verify .env File
Ensure `.env` exists with your credentials:
```env
VITE_CLOUDINARY_CLOUD_NAME=dgqhxchsz
VITE_CLOUDINARY_UPLOAD_PRESET=jj-art
```

### 2. Build and Run
```bash
# Build and start the container
docker-compose up -d --build

# Or just build
docker-compose build

# Or just run (if already built)
docker-compose up -d
```

### 3. Access Application
Open your browser: **http://localhost:8022**

## Docker Commands

### View Logs
```bash
# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs art-academy-frontend
```

### Stop Container
```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes
docker-compose down -v
```

### Restart Container
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## Port Configuration

The application runs on **port 8022** by default.

To change the port, edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:8022"
```

## Environment Variables

Environment variables are loaded from `.env` file:
- `VITE_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset

To add more variables:
1. Add to `.env` file
2. Update `docker-compose.yml` build args
3. Rebuild: `docker-compose up -d --build`

## Health Check

The container includes a health check:
```bash
# Check container health
docker ps

# Should show "healthy" in STATUS column
```

## Production Deployment

### 1. Build Production Image
```bash
docker build -t art-academy-frontend:latest .
```

### 2. Run on Server
```bash
docker run -d \
  --name art-academy-frontend \
  -p 8022:8022 \
  --env-file .env \
  --restart unless-stopped \
  art-academy-frontend:latest
```

### 3. Using Docker Compose on Server
```bash
# Upload files to server:
# - Dockerfile
# - docker-compose.yml
# - nginx.conf
# - .dockerignore
# - .env
# - package.json & package-lock.json
# - Source code

# Then run:
docker-compose up -d --build
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs art-academy-frontend

# Check container status
docker ps -a
```

### Port Already in Use
```bash
# Find what's using port 8022
netstat -ano | findstr :8022  # Windows
lsof -i :8022                 # Linux/Mac

# Change port in docker-compose.yml
```

### Build Fails
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### Environment Variables Not Working
```bash
# Verify .env file exists
cat .env

# Rebuild with no cache
docker-compose build --no-cache
docker-compose up -d
```

## Docker Hub Deployment (Optional)

### 1. Tag Image
```bash
docker tag art-academy-frontend:latest YOUR_DOCKERHUB_USERNAME/art-academy-frontend:latest
```

### 2. Push to Docker Hub
```bash
docker login
docker push YOUR_DOCKERHUB_USERNAME/art-academy-frontend:latest
```

### 3. Pull and Run on Any Server
```bash
docker pull YOUR_DOCKERHUB_USERNAME/art-academy-frontend:latest
docker run -d -p 8022:8022 --env-file .env YOUR_DOCKERHUB_USERNAME/art-academy-frontend:latest
```

## Container Management

### Access Container Shell
```bash
docker exec -it art-academy-frontend sh
```

### View Container Resource Usage
```bash
docker stats art-academy-frontend
```

### Remove All
```bash
# Stop and remove everything
docker-compose down -v --rmi all
```

## Network

The app uses a bridge network `art-academy-network`. To connect other services (like backend):

```yaml
services:
  backend:
    networks:
      - art-academy-network
```

## 🎉 Done!

Your Art Academy frontend is now running in Docker on port **8022**!
