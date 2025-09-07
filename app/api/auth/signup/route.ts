import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { createErrorResponse, createSuccessResponse, handleApiError, AppError, ERROR_CODES, HTTP_STATUS } from '@/lib/error-handler';
import { log } from '@/lib/logger';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      location, 
      newsletterOptIn, 
      acceptTerms 
    } = body;

    log.apiRequest('POST', '/api/auth/signup');

    // Validate required fields
    if (!email || !password || !phone) {
      log.warn('Signup validation failed: missing required fields', { email: !!email, password: !!password, phone: !!phone });
      return createErrorResponse(
        'Email, password, and phone number are required',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.MISSING_REQUIRED_FIELD
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      log.warn('Signup validation failed: invalid email format', { email });
      return createErrorResponse(
        'Please enter a valid email address',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_FORMAT
      );
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      log.warn('Signup validation failed: invalid phone format', { phone });
      return createErrorResponse(
        'Please enter a valid phone number',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_FORMAT
      );
    }

    // Validate password strength
    if (password.length < 8) {
      log.warn('Signup validation failed: password too short', { passwordLength: password.length });
      return createErrorResponse(
        'Password must be at least 8 characters long',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INVALID_FORMAT
      );
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      log.warn('Signup validation failed: terms not accepted', { acceptTerms });
      return createErrorResponse(
        'You must accept the terms and conditions',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      log.warn('Signup failed: user already exists', { email });
      return createErrorResponse(
        'An account with this email already exists',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DUPLICATE_RESOURCE
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone,
        location: location || null,
        newsletterOptIn: newsletterOptIn || false,
        termsAcceptedAt: acceptTerms ? new Date() : null,
        emailVerified: false,
        emailVerifyToken: emailVerifyToken,
        emailVerifyTokenExpiry: emailVerifyTokenExpiry,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        newsletterOptIn: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Note: Email verification is implemented but uses console logging
    // In production, integrate with an email service like SendGrid or Resend
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${emailVerifyToken}`;
    log.info('Email verification link generated', { email: user.email, verificationLink });

    // In a real app, you would send an email here
    // await sendVerificationEmail(user.email, verificationLink);

    log.businessEvent('user_signup', { 
      userId: user.id, 
      email: user.email, 
      newsletterOptIn: user.newsletterOptIn 
    });

    return createSuccessResponse({
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        location: user.location,
        newsletterOptIn: user.newsletterOptIn,
        role: user.role,
        emailVerified: user.emailVerified
      },
      verificationLink: process.env.NODE_ENV === 'development' ? verificationLink : undefined
    }, HTTP_STATUS.CREATED);

  } catch (error) {
    log.error('Signup error', error as Error);
    return handleApiError(error);
  } finally {
    await prisma.$disconnect();
  }
}
