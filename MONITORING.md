# Happy Hour Monitoring System

A comprehensive monitoring and alerting system for the Happy Hour web application that provides real-time health checks, error tracking, performance monitoring, and automated alerting.

## 🚀 Quick Start

### Setup

1. **Run the setup script:**
   ```bash
   chmod +x scripts/setup-monitoring.sh
   ./scripts/setup-monitoring.sh
   ```

2. **Start your application:**
   ```bash
   npm run dev
   ```

3. **Start the monitoring daemon:**
   ```bash
   npm run monitor:start
   ```

4. **Check status:**
   ```bash
   npm run monitor:status
   ```

## 📊 Features

### Health Monitoring
- **Database connectivity** - Tests Prisma connections and query performance
- **API endpoint health** - Monitors critical API routes
- **Memory usage** - Tracks heap usage and memory leaks
- **Disk space** - Monitors database size and growth
- **Business logic validation** - Checks for data inconsistencies
- **External services** - Validates internet connectivity and dependencies

### Error Tracking
- **Automatic error capture** - Catches and categorizes application errors
- **Error patterns** - Identifies recurring issues
- **Stack trace analysis** - Provides detailed error context
- **User impact tracking** - Links errors to specific users/sessions
- **Resolution workflow** - Mark errors as resolved

### Performance Monitoring
- **Response time tracking** - Monitors API response times
- **Resource usage** - CPU, memory, and connection monitoring
- **Trend analysis** - Historical performance data
- **Alerting thresholds** - Automated alerts for performance degradation

### Real-time Alerting
- **Multi-level alerts** - Info, Warning, Critical severity levels
- **Smart alerting** - Prevents alert spam with pattern recognition
- **Alert resolution** - Track and resolve alerts
- **Console logging** - Immediate visibility of critical issues

## 🔧 Components

### Core Libraries

#### `lib/monitoring.ts` - Main Monitoring System
- `HealthChecker` class with comprehensive health checks
- System metrics collection
- Alert generation and management
- Pattern-based error detection

#### `lib/error-tracking.ts` - Error Management
- `ErrorTracker` class for error logging and analysis
- Error pattern recognition
- Automatic tagging and categorization
- Database persistence

### API Endpoints

#### `/api/admin/health` - Health Check API
- Comprehensive system health status
- Individual component checks
- System metrics and performance data
- Alert summaries

#### `/api/admin/monitoring` - Advanced Monitoring API
- Historical metrics and trends
- Custom time range queries
- Alert management
- Manual health check triggers

#### `/api/admin/errors` - Error Tracking API
- Error log retrieval and filtering
- Error pattern analysis
- Bulk error resolution
- Error statistics

### Background Services

#### `scripts/monitoring-daemon.js` - Background Monitoring
- Continuous health checks (every 30 seconds)
- Metrics collection (every minute)
- Alert monitoring (every 15 seconds)
- Performance testing (every 2 minutes)
- Log rotation and management

### UI Components

#### `components/MonitoringDashboard.tsx` - Admin Dashboard
- Real-time status overview
- Health check results
- System metrics visualization
- Alert management interface
- Auto-refresh capabilities

## 📈 Usage

### Starting the Monitoring System

1. **Start the daemon:**
   ```bash
   npm run monitor:start
   ```

2. **Check if it's running:**
   ```bash
   npm run monitor:status
   ```

3. **View logs:**
   ```bash
   tail -f logs/monitoring.log
   ```

### Stopping the Monitoring System

```bash
npm run monitor:stop
```

### Manual Health Checks

```bash
npm run health:check
```

### Accessing the Dashboard

Visit `/admin` in your application (requires admin access) and look for the monitoring section.

## 🚨 Alert Levels

### Info (ℹ️)
- Informational messages
- System state changes
- Non-critical notifications

### Warning (⚠️)
- Performance degradation
- Non-critical errors
- Resource usage approaching limits
- Memory usage > 80%

### Critical (🚨)
- System failures
- Database connectivity issues
- Critical errors
- Memory usage > 95%
- Multiple component failures

## 📊 Monitoring Metrics

### System Metrics
- **Uptime** - Application uptime in hours
- **Memory Usage** - Heap usage and total memory
- **CPU Usage** - Process CPU utilization
- **Response Time** - Average API response time
- **Error Rate** - Percentage of failed requests

### Health Check Metrics
- **Database** - Connection time and query performance
- **API Endpoints** - Response time and success rate
- **Memory** - Usage percentage and growth rate
- **Business Logic** - Data consistency checks
- **External Services** - Connectivity status

### Error Metrics
- **Error Count** - Total errors by level
- **Error Patterns** - Recurring error identification
- **Resolution Rate** - Percentage of resolved errors
- **User Impact** - Errors affecting specific users

## 🔧 Configuration

### Environment Variables

Required for monitoring:
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_URL` - Application base URL
- `NEXTAUTH_SECRET` - Authentication secret

### Monitoring Configuration

The daemon configuration can be found in `scripts/monitoring-daemon.js`:

```javascript
config: {
  healthCheckInterval: 30000,    // 30 seconds
  metricsInterval: 60000,        // 1 minute
  alertCheckInterval: 15000,     // 15 seconds
  logRotationInterval: 86400000, // 24 hours
  maxLogSize: 10 * 1024 * 1024,  // 10MB
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000'
}
```

### Database Schema

The system requires the `ErrorLog` model in your Prisma schema:

```prisma
model ErrorLog {
  id        String   @id
  level     String   // 'error', 'warning', 'info'
  message   String
  stack     String?
  context   String?  // JSON string
  userId    String?
  sessionId String?
  url       String?
  userAgent String?
  resolved  Boolean  @default(false)
  tags      String   @default("[]")
  createdAt DateTime
  updatedAt DateTime @updatedAt

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([level, createdAt])
  @@index([resolved, createdAt])
  @@index([userId])
  @@map("error_logs")
}
```

## 🔍 API Reference

### Health Check API

**GET** `/api/admin/health`

Returns comprehensive health status including:
- Overall system status
- Individual component checks
- System metrics
- Recent alerts
- Summary statistics

### Monitoring API

**GET** `/api/admin/monitoring`

Query parameters:
- `timeRange` - 1h, 6h, 24h, 7d (default: 1h)
- `includeMetrics` - Include historical metrics
- `includeAlerts` - Include alert data

**POST** `/api/admin/monitoring`

Actions:
- `run_check` - Trigger manual health check
- `resolve_alert` - Resolve specific alert

### Error Tracking API

**GET** `/api/admin/errors`

Query parameters:
- `level` - error, warning, info
- `limit` - Number of results (1-100, default: 50)
- `offset` - Result offset (default: 0)
- `tags` - Comma-separated tag filters
- `resolved` - Filter by resolution status
- `timeRange` - 1h, 6h, 24h, 7d, 30d (default: 24h)

**POST** `/api/admin/errors`

Actions:
- `log_error` - Log new error
- `resolve_error` - Resolve specific error
- `bulk_resolve` - Resolve multiple errors
- `get_patterns` - Get error patterns
- `get_stats` - Get error statistics

## 🛠️ Development

### Adding Custom Health Checks

Add new checks to the `HealthChecker` class in `lib/monitoring.ts`:

```typescript
async checkCustomFunction(): Promise<void> {
  try {
    // Your health check logic here
    const { time } = await this.timeFunction(async () => {
      // Test your functionality
      return result;
    });

    let status: HealthCheck['status'] = 'healthy';
    if (time > threshold) status = 'warning';
    
    this.updateCheck('custom-check', status, time);
  } catch (error) {
    this.updateCheck('custom-check', 'critical', 0, error.message);
  }
}
```

### Custom Error Tracking

Use the error tracking system in your code:

```typescript
import { errorTracker } from '@/lib/error-tracking';

// Log different types of errors
await errorTracker.logDatabaseError(error, { query: 'SELECT * FROM users' });
await errorTracker.logAuthError('Invalid credentials', { userId: 'user123' });
await errorTracker.logValidationError('Missing required field', { field: 'email' });
await errorTracker.logApiError('/api/users', error, { method: 'POST' });

// Wrap handlers with automatic error tracking
const handler = withErrorTracking(async (req, res) => {
  // Your handler logic
}, { endpoint: '/api/users' });
```

## 🚀 Production Deployment

### Systemd Service (Linux)

1. Copy the service file:
   ```bash
   sudo cp /tmp/happy-hour-monitoring.service /etc/systemd/system/
   ```

2. Enable and start:
   ```bash
   sudo systemctl enable happy-hour-monitoring
   sudo systemctl start happy-hour-monitoring
   ```

3. Check status:
   ```bash
   sudo systemctl status happy-hour-monitoring
   ```

### Docker Support

Add to your Dockerfile:

```dockerfile
# Copy monitoring scripts
COPY scripts/ ./scripts/
COPY logs/ ./logs/
RUN chmod +x scripts/monitoring-daemon.js

# Start monitoring in background
RUN npm run monitor:start &
```

### Process Managers

#### PM2
```bash
pm2 start scripts/monitoring-daemon.js --name "monitoring"
```

#### Forever
```bash
forever start scripts/monitoring-daemon.js start
```

## 📝 Logs

### Log Locations
- **Monitoring logs**: `logs/monitoring.log`
- **Archived logs**: `logs/monitoring.log.{timestamp}.gz`

### Log Rotation
- Automatic rotation when file exceeds 10MB
- Compressed archives for space efficiency
- 24-hour rotation cycle

### Log Format
```
[2024-01-15T10:30:15.123Z] [LEVEL] Message
```

## 🔒 Security Considerations

### API Security
- Admin endpoints require authentication
- Rate limiting on monitoring APIs
- Input validation on all parameters

### Log Security
- No sensitive data in logs
- Secure file permissions on log files
- Regular log cleanup

### Error Handling
- Graceful degradation on monitoring failures
- No system disruption from monitoring issues
- Isolated error tracking prevents cascading failures

## 🆘 Troubleshooting

### Common Issues

#### Daemon Won't Start
- Check Node.js installation
- Verify environment variables
- Check port availability
- Review log files

#### Health Checks Failing
- Verify database connectivity
- Check API endpoint accessibility
- Review system resources
- Validate environment configuration

#### High Memory Usage
- Check for memory leaks
- Review error accumulation
- Monitor long-running processes
- Consider increasing limits

### Debug Mode

Set environment variable for detailed logging:
```bash
DEBUG=monitoring npm run monitor:start
```

## 📞 Support

For issues or questions about the monitoring system:

1. Check the logs: `tail -f logs/monitoring.log`
2. Review system status: `npm run monitor:status`
3. Run health check: `npm run health:check`
4. Check the dashboard at `/admin`

## 🔄 Updates and Maintenance

### Regular Maintenance
- Review log files weekly
- Clean old archives monthly
- Update alert thresholds based on usage
- Monitor system performance trends

### Upgrading
1. Stop the monitoring daemon
2. Update the code
3. Run database migrations if needed
4. Restart the daemon
5. Verify functionality

---

*This monitoring system provides comprehensive coverage of your application's health and performance. Regular monitoring and maintenance will help ensure optimal system reliability.*