import { NextResponse } from 'next/server';

export interface ApiError {
  error: string;
  details?: any;
  code?: string;
  timestamp?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  code?: string;
  timestamp?: string;
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export function createErrorResponse(
  error: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): NextResponse {
  const errorResponse: ApiError = {
    error,
    code,
    details,
    timestamp: new Date().toISOString()
  };

  // Log error for monitoring
  console.error(`API Error [${statusCode}]:`, {
    error,
    code,
    details,
    timestamp: errorResponse.timestamp
  });

  return NextResponse.json(errorResponse, { status: statusCode });
}

export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(response, { status: statusCode });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return createErrorResponse(
      error.message,
      error.statusCode,
      error.code,
      error.details
    );
  }

  if (error instanceof Error) {
    // Log unexpected errors
    console.error('Unexpected API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return createErrorResponse(
      'An unexpected error occurred. Please try again.',
      500,
      'INTERNAL_ERROR'
    );
  }

  // Handle non-Error objects
  console.error('Unknown API Error:', {
    error,
    timestamp: new Date().toISOString()
  });

  return createErrorResponse(
    'An unknown error occurred. Please try again.',
    500,
    'UNKNOWN_ERROR'
  );
}

export function withErrorHandling<T extends any[], R>(
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

// Common error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED'
} as const;

// Common HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;
