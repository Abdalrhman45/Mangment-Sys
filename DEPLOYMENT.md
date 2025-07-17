# Employee Management System - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Local Development Deployment
```bash
# Run the automated deployment script
.\deploy-local.ps1
```

### Option 2: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build -d
```

### Option 3: Manual Deployment
Follow the step-by-step instructions below.

---

## 📋 Prerequisites

### Required Software
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Angular CLI** - `npm install -g @angular/cli`
- **Docker** (optional) - [Download](https://www.docker.com/get-started)

### System Requirements
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for package downloads

---

## 🔧 Backend Deployment

### Development Environment
```bash
cd Backend/EmployeeManagement.API
dotnet restore
dotnet run
```
- API will be available at: `https://localhost:7000`
- Swagger UI: `https://localhost:7000/swagger`

### Production Environment
```bash
cd Backend/EmployeeManagement.API
dotnet restore
dotnet build --configuration Release
dotnet run --configuration Release
```

### Configuration
Edit `appsettings.json` for production settings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your-Production-Database-Connection-String"
  },
  "Cors": {
    "AllowedOrigins": [
      "https://your-frontend-domain.com"
    ]
  }
}
```

---

## 🎨 Frontend Deployment

### Development Environment
```bash
cd Frontend
npm install
ng serve
```
- Application will be available at: `http://localhost:4200`

### Production Build
```bash
cd Frontend
npm install
ng build --configuration production
```
- Built files will be in `dist/employee-management/`

### Serve Production Build
```bash
# Using Angular CLI
ng serve --configuration production

# Using a web server (nginx, IIS, etc.)
# Copy dist/employee-management/* to your web server root
```

---

## 🐳 Docker Deployment

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd employee-management-system

# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Services
- **Frontend**: `http://localhost:4200`
- **Backend API**: `http://localhost:7000`
- **Swagger UI**: `http://localhost:7000/swagger`

### Stop Services
```bash
docker-compose down
```

---

## 🌐 Production Deployment

### IIS Deployment (Windows)

#### Backend (API)
1. Publish the API:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
2. Create IIS Application Pool (.NET Core)
3. Deploy published files to IIS
4. Configure SSL certificate

#### Frontend
1. Build for production:
   ```bash
   ng build --configuration production
   ```
2. Copy `dist/employee-management/*` to IIS wwwroot
3. Configure URL rewriting for Angular routing

### Nginx Deployment (Linux)

#### Backend (API)
1. Install .NET 8 runtime
2. Create systemd service:
   ```ini
   [Unit]
   Description=Employee Management API
   
   [Service]
   WorkingDirectory=/var/www/employee-api
   ExecStart=/usr/bin/dotnet EmployeeManagement.API.dll
   Restart=always
   User=www-data
   Environment=ASPNETCORE_ENVIRONMENT=Production
   
   [Install]
   WantedBy=multi-user.target
   ```

#### Frontend
1. Build production files
2. Configure Nginx:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/employee-frontend;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

## 🔒 Security Considerations

### API Security
- Enable HTTPS in production
- Configure CORS properly
- Implement authentication/authorization
- Use secure connection strings
- Enable request rate limiting

### Frontend Security
- Use HTTPS
- Implement Content Security Policy
- Sanitize user inputs
- Enable security headers

---

## 📊 Monitoring & Logging

### Application Insights (Azure)
```json
{
  "ApplicationInsights": {
    "InstrumentationKey": "your-key-here"
  }
}
```

### Logging Configuration
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### API Not Starting
- Check .NET 8 SDK installation
- Verify port 7000 is available
- Check firewall settings

#### Frontend Build Errors
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall
- Check Node.js version compatibility

#### CORS Issues
- Verify API CORS configuration
- Check frontend API URL configuration
- Ensure both services are running

#### Database Connection
- Verify connection string
- Check database server availability
- Ensure proper permissions

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify all prerequisites are met
4. Test with the provided test scripts

---

## 🔄 Updates & Maintenance

### Updating the Application
1. Pull latest changes
2. Run tests: `.\run-all-tests.ps1`
3. Deploy using preferred method
4. Verify functionality

### Database Migrations
```bash
# Add migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update
```