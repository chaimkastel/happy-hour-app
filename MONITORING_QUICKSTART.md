# 🚀 Monitoring Quick Start Guide

Get your Happy Hour monitoring system up and running in 5 minutes!

## ⚡ Quick Setup

### 1. Run Setup Script
```bash
chmod +x scripts/setup-monitoring.sh
./scripts/setup-monitoring.sh
```

### 2. Update Database Schema
```bash
npx prisma migrate dev --name add-error-logging
```

### 3. Start Application
```bash
npm run dev
```

### 4. Start Monitoring
```bash
npm run monitor:start
```

### 5. Verify Everything Works
```bash
npm run monitor:status
npm run health:check
```

## 📊 What You Get

✅ **Real-time Health Monitoring**
- Database connectivity checks
- API endpoint monitoring  
- Memory and performance tracking
- Business logic validation

✅ **Error Tracking & Alerting**
- Automatic error capture
- Pattern recognition
- Smart alerting system
- Error resolution workflow

✅ **Background Monitoring Daemon**
- Continuous health checks (30s intervals)
- Performance monitoring (1min intervals)
- Alert processing (15s intervals)
- Automatic log rotation

✅ **Admin Dashboard**
- Visual health status overview
- Real-time metrics
- Alert management
- Historical data

## 🔧 Available Commands

```bash
# Monitoring daemon
npm run monitor:start    # Start background monitoring
npm run monitor:stop     # Stop monitoring daemon
npm run monitor:status   # Check if daemon is running

# Health checks
npm run health:check     # One-time health check
npm run test:functionality  # Run functionality tests

# Development
npm run dev             # Start Next.js app
npm run build           # Build for production
```

## 📈 Using the System

### View Dashboard
Visit `/admin` in your app (requires admin access) to see the monitoring dashboard.

### Check Logs
```bash
tail -f logs/monitoring.log
```

### API Endpoints
- `GET /api/admin/health` - Health status
- `GET /api/admin/monitoring` - Detailed monitoring data
- `GET /api/admin/errors` - Error logs and patterns

### Integrate with Your Code

#### Basic Error Tracking
```typescript
import { errorTracker } from '@/lib/error-tracking'

// Log errors automatically
await errorTracker.logDatabaseError(error, { query: 'SELECT...' })
await errorTracker.logAuthError('Invalid token', { userId })
```

#### Enhanced Middleware
```typescript
import { withStrictMonitoring } from '@/lib/enhanced-middleware'

export const POST = withStrictMonitoring(async (req: NextRequest) => {
  // Your API handler - now with automatic monitoring!
})
```

#### Database Monitoring
```typescript
import { withDatabaseMonitoring } from '@/lib/enhanced-middleware'

const users = await withDatabaseMonitoring(
  () => prisma.user.findMany(),
  'fetch-all-users'
)
```

## 🚨 Alert Levels

- **🚨 Critical** - System failures, database down, high error rates
- **⚠️ Warning** - Performance issues, high memory usage, slow responses  
- **ℹ️ Info** - System events, state changes, notifications

## 📝 Monitoring What Matters

### Health Checks (Every 30s)
- ✅ Database connectivity & performance
- ✅ Critical API endpoints
- ✅ Memory usage & leaks
- ✅ Business logic consistency
- ✅ External service dependencies

### Performance Metrics (Every 1min)
- 📊 Response times
- 📊 Memory usage trends
- 📊 Error rates
- 📊 System uptime

### Error Tracking (Real-time)
- 🐛 Automatic error capture
- 🔍 Pattern recognition
- 📋 User impact tracking
- ✅ Resolution workflow

## 🛠️ Troubleshooting

### Daemon Won't Start
```bash
# Check if port is in use
lsof -i :3000

# Check environment variables
echo $DATABASE_URL
echo $NEXTAUTH_URL

# Check logs
cat logs/monitoring.log
```

### High Memory Alerts
```bash
# Check Node.js memory usage
ps aux | grep node

# View memory trends in dashboard
# Visit /admin/monitoring
```

### Database Issues
```bash
# Test database connection
npx prisma db push

# Check database status
npm run health:check
```

## 🚀 Production Tips

### Systemd Service (Linux)
```bash
# Copy service file (created by setup script)
sudo cp /tmp/happy-hour-monitoring.service /etc/systemd/system/
sudo systemctl enable happy-hour-monitoring
sudo systemctl start happy-hour-monitoring
```

### Docker
```dockerfile
# Add to your Dockerfile
RUN chmod +x scripts/monitoring-daemon.js
CMD ["sh", "-c", "npm run monitor:start & npm start"]
```

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret

# Optional
NODE_ENV=production
DEBUG=monitoring  # Enable debug logs
```

## 📞 Need Help?

1. **Check the logs**: `tail -f logs/monitoring.log`
2. **Run health check**: `npm run health:check`
3. **View dashboard**: Visit `/admin` in your app
4. **Check daemon status**: `npm run monitor:status`

## 🎯 Next Steps

- [ ] Set up alerts for your team (email/Slack integration)
- [ ] Configure custom health checks for your specific needs
- [ ] Set up log aggregation for production
- [ ] Add custom metrics for business KPIs
- [ ] Configure automated backups of monitoring data

---

**You're all set!** Your application now has enterprise-grade monitoring and alerting. The system will automatically detect issues, track errors, and alert you to problems before they impact users.

For detailed documentation, see [MONITORING.md](./MONITORING.md)