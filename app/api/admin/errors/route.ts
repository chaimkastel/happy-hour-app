import { NextRequest, NextResponse } from 'next/server';
import { errorTracker } from '@/lib/error-tracking';
import { z } from 'zod';

const errorLogSchema = z.object({
  level: z.enum(['error', 'warning', 'info']),
  message: z.string(),
  context: z.record(z.any()).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  url: z.string().optional(),
  userAgent: z.string().optional()
});

const querySchema = z.object({
  level: z.enum(['error', 'warning', 'info']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  tags: z.string().optional(), // comma-separated tags
  resolved: z.coerce.boolean().optional(),
  timeRange: z.enum(['1h', '6h', '24h', '7d', '30d']).default('24h')
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams.entries()));

    // Calculate time range
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[query.timeRange];

    const timeRange = {
      start: new Date(now.getTime() - timeRangeMs),
      end: now
    };

    // Get errors with filters
    const errors = errorTracker.getErrors({
      level: query.level,
      limit: query.limit,
      offset: query.offset,
      tags: query.tags ? query.tags.split(',').map(t => t.trim()) : undefined,
      resolved: query.resolved,
      timeRange
    });

    // Get error patterns
    const patterns = errorTracker.getPatterns();

    // Get error statistics
    const stats = errorTracker.getErrorStats();

    return NextResponse.json({
      errors: errors.map(error => ({
        ...error,
        timestamp: error.timestamp.toISOString()
      })),
      patterns: patterns.slice(0, 20), // Top 20 patterns
      stats,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: stats.total
      },
      filters: {
        level: query.level,
        tags: query.tags,
        resolved: query.resolved,
        timeRange: query.timeRange
      }
    });

  } catch (error) {
    console.error('Error fetching error logs:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid query parameters',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to fetch error logs'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'log_error') {
      const errorData = errorLogSchema.parse(body);
      const errorId = await errorTracker.logError(
        errorData.level,
        errorData.message,
        undefined, // error object
        errorData.context,
        {
          userId: errorData.userId,
          sessionId: errorData.sessionId,
          url: errorData.url,
          userAgent: errorData.userAgent
        }
      );

      return NextResponse.json({
        success: true,
        errorId
      });
    }

    if (action === 'resolve_error') {
      const { errorId } = body;
      if (!errorId) {
        return NextResponse.json({ error: 'Error ID required' }, { status: 400 });
      }

      const resolved = await errorTracker.resolveError(errorId);
      return NextResponse.json({
        success: resolved,
        message: resolved ? 'Error resolved' : 'Error not found'
      });
    }

    if (action === 'bulk_resolve') {
      const { errorIds } = body;
      if (!Array.isArray(errorIds)) {
        return NextResponse.json({ error: 'Error IDs array required' }, { status: 400 });
      }

      const results = await Promise.all(
        errorIds.map(id => errorTracker.resolveError(id))
      );

      const resolvedCount = results.filter(Boolean).length;
      return NextResponse.json({
        success: true,
        resolved: resolvedCount,
        total: errorIds.length
      });
    }

    if (action === 'get_patterns') {
      const patterns = errorTracker.getPatterns();
      return NextResponse.json({
        patterns: patterns.slice(0, 50) // Top 50 patterns
      });
    }

    if (action === 'get_stats') {
      const stats = errorTracker.getErrorStats();
      return NextResponse.json({
        stats
      });
    }

    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error processing error logs request:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to process request'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const errorId = searchParams.get('id');

    if (!errorId) {
      return NextResponse.json({ error: 'Error ID required' }, { status: 400 });
    }

    const body = await request.json();
    const { resolved } = body;

    if (typeof resolved !== 'boolean') {
      return NextResponse.json({ error: 'Resolved status required' }, { status: 400 });
    }

    if (resolved) {
      const success = await errorTracker.resolveError(errorId);
      return NextResponse.json({
        success,
        message: success ? 'Error resolved' : 'Error not found'
      });
    }

    // For now, we don't support "unresolving" errors
    return NextResponse.json({
      error: 'Cannot unresolve errors'
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating error log:', error);
    return NextResponse.json({
      error: 'Failed to update error log'
    }, { status: 500 });
  }
}