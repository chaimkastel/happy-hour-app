export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, userId, requestId, error } = entry;
    
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (userId) logMessage += ` | User: ${userId}`;
    if (requestId) logMessage += ` | Request: ${requestId}`;
    
    if (context && Object.keys(context).length > 0) {
      logMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log WARN and ERROR
    return level === LogLevel.WARN || level === LogLevel.ERROR;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, userId?: string, requestId?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId,
      requestId,
      error
    };

    const formattedMessage = this.formatLogEntry(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }

    // In production, you might want to send logs to an external service
    if (this.isProduction && (level === LogLevel.ERROR || level === LogLevel.WARN)) {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // In a real application, you would send logs to services like:
    // - Sentry for error tracking
    // - DataDog for monitoring
    // - CloudWatch for AWS
    // - LogRocket for frontend errors
    
    // For now, we'll just log to console in production
    // but in a real app, you'd implement actual external logging here
    if (process.env.EXTERNAL_LOGGING_ENABLED === 'true') {
      // Example: Send to external service
      // fetch('https://your-logging-service.com/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // }).catch(err => console.error('Failed to send log to external service:', err));
    }
  }

  debug(message: string, context?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log(LogLevel.DEBUG, message, context, undefined, userId, requestId);
  }

  info(message: string, context?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log(LogLevel.INFO, message, context, undefined, userId, requestId);
  }

  warn(message: string, context?: Record<string, any>, error?: Error, userId?: string, requestId?: string): void {
    this.log(LogLevel.WARN, message, context, error, userId, requestId);
  }

  error(message: string, error?: Error, context?: Record<string, any>, userId?: string, requestId?: string): void {
    this.log(LogLevel.ERROR, message, context, error, userId, requestId);
  }

  // Convenience methods for common scenarios
  apiRequest(method: string, path: string, userId?: string, requestId?: string): void {
    this.info(`API Request: ${method} ${path}`, { method, path }, userId, requestId);
  }

  apiResponse(method: string, path: string, statusCode: number, duration?: number, userId?: string, requestId?: string): void {
    this.info(`API Response: ${method} ${path} - ${statusCode}`, { 
      method, 
      path, 
      statusCode, 
      duration 
    }, userId, requestId);
  }

  databaseQuery(operation: string, table: string, duration?: number, userId?: string, requestId?: string): void {
    this.debug(`Database Query: ${operation} on ${table}`, { 
      operation, 
      table, 
      duration 
    }, userId, requestId);
  }

  authenticationEvent(event: string, userId?: string, context?: Record<string, any>): void {
    this.info(`Authentication: ${event}`, { event, ...context }, userId);
  }

  businessEvent(event: string, context?: Record<string, any>, userId?: string, requestId?: string): void {
    this.info(`Business Event: ${event}`, context, userId, requestId);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, context?: Record<string, any>, userId?: string, requestId?: string) => 
    logger.debug(message, context, userId, requestId),
  info: (message: string, context?: Record<string, any>, userId?: string, requestId?: string) => 
    logger.info(message, context, userId, requestId),
  warn: (message: string, context?: Record<string, any>, error?: Error, userId?: string, requestId?: string) => 
    logger.warn(message, context, error, userId, requestId),
  error: (message: string, error?: Error, context?: Record<string, any>, userId?: string, requestId?: string) => 
    logger.error(message, error, context, userId, requestId),
  apiRequest: (method: string, path: string, userId?: string, requestId?: string) => 
    logger.apiRequest(method, path, userId, requestId),
  apiResponse: (method: string, path: string, statusCode: number, duration?: number, userId?: string, requestId?: string) => 
    logger.apiResponse(method, path, statusCode, duration, userId, requestId),
  databaseQuery: (operation: string, table: string, duration?: number, userId?: string, requestId?: string) => 
    logger.databaseQuery(operation, table, duration, userId, requestId),
  authenticationEvent: (event: string, userId?: string, context?: Record<string, any>) => 
    logger.authenticationEvent(event, userId, context),
  businessEvent: (event: string, context?: Record<string, any>, userId?: string, requestId?: string) => 
    logger.businessEvent(event, context, userId, requestId)
};
