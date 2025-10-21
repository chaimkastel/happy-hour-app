import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'A record with this information already exists' },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      case 'P2003':
        return NextResponse.json(
          { error: 'Invalid reference to related record' },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: 'Database operation failed' },
          { status: 500 }
        );
    }
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.status }
    );
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

// Utility function to wrap API handlers with error handling
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Common error responses
export const ErrorResponses = {
  unauthorized: () => NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  ),
  forbidden: () => NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  ),
  notFound: (resource: string = 'Resource') => NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 }
  ),
  badRequest: (message: string = 'Bad request') => NextResponse.json(
    { error: message },
    { status: 400 }
  ),
  conflict: (message: string = 'Conflict') => NextResponse.json(
    { error: message },
    { status: 409 }
  ),
  tooManyRequests: (retryAfter?: number) => NextResponse.json(
    { error: 'Too many requests' },
    { 
      status: 429,
      headers: retryAfter ? { 'Retry-After': retryAfter.toString() } : undefined,
    }
  ),
  internalServerError: (message: string = 'Internal server error') => NextResponse.json(
    { error: message },
    { status: 500 }
  ),
  serviceUnavailable: (message: string = 'Service temporarily unavailable') => NextResponse.json(
    { error: message },
    { status: 503 }
  ),
};