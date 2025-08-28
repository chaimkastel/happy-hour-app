#!/usr/bin/env node

/**
 * Background Monitoring Daemon
 * Continuously monitors the application health and sends alerts
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class MonitoringDaemon {
  constructor() {
    this.isRunning = false;
    this.intervals = new Map();
    this.logFile = path.join(__dirname, '../logs/monitoring.log');
    this.pidFile = path.join(__dirname, '../logs/monitoring.pid');
    this.config = {
      healthCheckInterval: 30000, // 30 seconds
      metricsInterval: 60000,     // 1 minute
      alertCheckInterval: 15000,  // 15 seconds
      logRotationInterval: 86400000, // 24 hours
      maxLogSize: 10 * 1024 * 1024,  // 10MB
      baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000'
    };
  }

  async start() {
    if (this.isRunning) {
      console.log('Monitoring daemon is already running');
      return;
    }

    console.log('🚀 Starting Happy Hour Monitoring Daemon...');
    
    try {
      await this.ensureDirectories();
      await this.writePidFile();
      
      this.isRunning = true;
      this.startMonitoring();
      
      console.log(`✅ Monitoring daemon started successfully`);
      console.log(`📊 Health checks every ${this.config.healthCheckInterval / 1000}s`);
      console.log(`📈 Metrics collection every ${this.config.metricsInterval / 1000}s`);
      console.log(`🚨 Alert checking every ${this.config.alertCheckInterval / 1000}s`);
      console.log(`📁 Logs: ${this.logFile}`);
      
      await this.log('Monitoring daemon started');
      
    } catch (error) {
      console.error('❌ Failed to start monitoring daemon:', error);
      process.exit(1);
    }
  }

  async stop() {
    if (!this.isRunning) {
      console.log('Monitoring daemon is not running');
      return;
    }

    console.log('🛑 Stopping monitoring daemon...');
    
    this.isRunning = false;
    
    // Clear all intervals
    for (const [name, intervalId] of this.intervals) {
      clearInterval(intervalId);
      console.log(`  Stopped ${name}`);
    }
    this.intervals.clear();
    
    // Remove PID file
    try {
      await fs.unlink(this.pidFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
    
    await this.log('Monitoring daemon stopped');
    console.log('✅ Monitoring daemon stopped');
  }

  startMonitoring() {
    // Health check monitoring
    const healthInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        await this.log(`Health check error: ${error.message}`, 'ERROR');
      }
    }, this.config.healthCheckInterval);
    this.intervals.set('health-check', healthInterval);

    // Metrics collection
    const metricsInterval = setInterval(async () => {
      try {
        await this.collectMetrics();
      } catch (error) {
        await this.log(`Metrics collection error: ${error.message}`, 'ERROR');
      }
    }, this.config.metricsInterval);
    this.intervals.set('metrics', metricsInterval);

    // Alert checking
    const alertInterval = setInterval(async () => {
      try {
        await this.checkAlerts();
      } catch (error) {
        await this.log(`Alert check error: ${error.message}`, 'ERROR');
      }
    }, this.config.alertCheckInterval);
    this.intervals.set('alerts', alertInterval);

    // Log rotation
    const logRotationInterval = setInterval(async () => {
      try {
        await this.rotateLogsIfNeeded();
      } catch (error) {
        console.error('Log rotation error:', error);
      }
    }, this.config.logRotationInterval);
    this.intervals.set('log-rotation', logRotationInterval);

    // Performance monitoring
    const perfInterval = setInterval(async () => {
      try {
        await this.monitorPerformance();
      } catch (error) {
        await this.log(`Performance monitoring error: ${error.message}`, 'ERROR');
      }
    }, 120000); // 2 minutes
    this.intervals.set('performance', perfInterval);
  }

  async performHealthCheck() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/admin/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'MonitoringDaemon/1.0'
        },
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`Health check failed: HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.overall.status === 'critical') {
        await this.log(`🚨 CRITICAL: ${data.overall.message}`, 'CRITICAL');
        await this.sendAlert('critical', 'System Critical', data.overall.message, data);
      } else if (data.overall.status === 'warning') {
        await this.log(`⚠️ WARNING: ${data.overall.message}`, 'WARNING');
      } else {
        await this.log(`✅ Health check passed - ${data.overall.message}`, 'INFO');
      }

      // Check individual components
      for (const [checkName, check] of Object.entries(data.checks || {})) {
        if (check.status === 'critical') {
          await this.log(`🚨 ${checkName} CRITICAL: ${check.error || 'Unknown error'}`, 'CRITICAL');
        }
      }

    } catch (error) {
      await this.log(`Health check failed: ${error.message}`, 'ERROR');
      await this.sendAlert('critical', 'Health Check Failed', error.message);
    }
  }

  async collectMetrics() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/admin/monitoring?includeMetrics=true`, {
        method: 'GET',
        headers: {
          'User-Agent': 'MonitoringDaemon/1.0'
        },
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.metrics && data.metrics.current) {
          const metrics = data.metrics.current;
          const memUsageMB = Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024);
          const uptime = Math.round(metrics.uptime / 3600 * 100) / 100; // hours
          
          await this.log(`📊 Memory: ${memUsageMB}MB, Uptime: ${uptime}h, Response: ${metrics.responseTime}ms`, 'INFO');
          
          // Alert on high memory usage
          const memUsagePercent = (metrics.memoryUsage.heapUsed / metrics.memoryUsage.heapTotal) * 100;
          if (memUsagePercent > 90) {
            await this.sendAlert('critical', 'High Memory Usage', `Memory usage at ${memUsagePercent.toFixed(1)}%`);
          } else if (memUsagePercent > 80) {
            await this.sendAlert('warning', 'Memory Usage Warning', `Memory usage at ${memUsagePercent.toFixed(1)}%`);
          }
        }
      }
    } catch (error) {
      await this.log(`Metrics collection failed: ${error.message}`, 'ERROR');
    }
  }

  async checkAlerts() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/admin/monitoring?includeAlerts=true&timeRange=1h`, {
        method: 'GET',
        headers: {
          'User-Agent': 'MonitoringDaemon/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.alerts && data.alerts.summary) {
          const { critical, warning, unresolved } = data.alerts.summary;
          
          if (unresolved > 0) {
            await this.log(`🚨 ${unresolved} unresolved alerts (${critical} critical, ${warning} warning)`, 'WARNING');
          }
        }
      }
    } catch (error) {
      await this.log(`Alert check failed: ${error.message}`, 'ERROR');
    }
  }

  async monitorPerformance() {
    try {
      // Test critical endpoints
      const endpoints = [
        '/api/deals/search',
        '/api/merchant/settings',
        '/api/admin/health'
      ];

      for (const endpoint of endpoints) {
        const start = Date.now();
        try {
          const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: { 'User-Agent': 'MonitoringDaemon/1.0' },
            signal: AbortSignal.timeout(10000)
          });
          
          const responseTime = Date.now() - start;
          
          if (responseTime > 5000) {
            await this.sendAlert('warning', 'Slow Endpoint', `${endpoint} responded in ${responseTime}ms`);
          }
          
          if (!response.ok && response.status !== 401) {
            await this.sendAlert('critical', 'Endpoint Error', `${endpoint} returned ${response.status}`);
          }
          
        } catch (error) {
          await this.sendAlert('critical', 'Endpoint Failure', `${endpoint} failed: ${error.message}`);
        }
      }
      
    } catch (error) {
      await this.log(`Performance monitoring failed: ${error.message}`, 'ERROR');
    }
  }

  async sendAlert(level, title, message, metadata = {}) {
    const alert = {
      level,
      title,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Log the alert
    await this.log(`ALERT [${level.toUpperCase()}] ${title}: ${message}`, level.toUpperCase());

    // In a production environment, you would also:
    // - Send email notifications
    // - Post to Slack/Discord
    // - Send SMS for critical alerts
    // - Write to external monitoring systems
    
    // For now, just ensure it's prominently logged
    if (level === 'critical') {
      console.error(`🚨 CRITICAL ALERT: ${title} - ${message}`);
    }
  }

  async ensureDirectories() {
    const logsDir = path.dirname(this.logFile);
    try {
      await fs.mkdir(logsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async writePidFile() {
    await fs.writeFile(this.pidFile, process.pid.toString());
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level}] ${message}\n`;
    
    try {
      await fs.appendFile(this.logFile, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
    
    // Also log to console for debugging
    if (level === 'ERROR' || level === 'CRITICAL') {
      console.error(logLine.trim());
    } else if (level === 'WARNING') {
      console.warn(logLine.trim());
    } else {
      console.log(logLine.trim());
    }
  }

  async rotateLogsIfNeeded() {
    try {
      const stats = await fs.stat(this.logFile);
      
      if (stats.size > this.config.maxLogSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = `${this.logFile}.${timestamp}`;
        
        await fs.rename(this.logFile, rotatedFile);
        await this.log('Log file rotated');
        
        // Compress old log file (if gzip is available)
        try {
          const gzip = spawn('gzip', [rotatedFile]);
          gzip.on('close', (code) => {
            if (code === 0) {
              this.log('Old log file compressed');
            }
          });
        } catch (error) {
          // gzip not available, that's okay
        }
      }
    } catch (error) {
      // Log file might not exist yet
    }
  }

  setupSignalHandlers() {
    process.on('SIGINT', async () => {
      console.log('\nReceived SIGINT, shutting down gracefully...');
      await this.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\nReceived SIGTERM, shutting down gracefully...');
      await this.stop();
      process.exit(0);
    });

    process.on('uncaughtException', async (error) => {
      await this.log(`Uncaught exception: ${error.message}`, 'CRITICAL');
      console.error('Uncaught exception:', error);
      await this.stop();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason, promise) => {
      await this.log(`Unhandled rejection: ${reason}`, 'ERROR');
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
    });
  }
}

// CLI interface
if (require.main === module) {
  const daemon = new MonitoringDaemon();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      daemon.setupSignalHandlers();
      daemon.start();
      break;
      
    case 'stop':
      daemon.stop().then(() => process.exit(0));
      break;
      
    case 'status':
      // Check if daemon is running by looking for PID file
      const pidFile = path.join(__dirname, '../logs/monitoring.pid');
      fs.readFile(pidFile, 'utf8')
        .then(pid => {
          console.log(`Monitoring daemon is running (PID: ${pid.trim()})`);
        })
        .catch(() => {
          console.log('Monitoring daemon is not running');
        });
      break;
      
    default:
      console.log('Usage: node monitoring-daemon.js [start|stop|status]');
      console.log('');
      console.log('Commands:');
      console.log('  start   - Start the monitoring daemon');
      console.log('  stop    - Stop the monitoring daemon');
      console.log('  status  - Check daemon status');
      process.exit(1);
  }
}