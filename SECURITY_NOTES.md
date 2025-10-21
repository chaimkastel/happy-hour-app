# Security Notes

## Environment Variables

### Required for Production
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Full URL of your application (e.g., https://yourapp.com)
- `NEXTAUTH_SECRET`: Random string for JWT signing (use `openssl rand -base64 32`)
- `STRIPE_SECRET_KEY`: Stripe secret key (starts with sk_live_ for production)
- `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret from Stripe dashboard
- `STRIPE_PRICE_MONTHLY`: Stripe price ID for monthly subscription
- `RESEND_API_KEY`: API key for email service
- `SENTRY_DSN`: Sentry DSN for error tracking

### Optional
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: For Google OAuth
- `REDIS_URL`: For rate limiting (falls back to in-memory if not set)

## Security Rotation Steps

### 1. Database Credentials
```bash
# Generate new password
openssl rand -base64 32

# Update DATABASE_URL in production environment
# Test connection before deploying
```

### 2. NextAuth Secret
```bash
# Generate new secret
openssl rand -base64 32

# Update NEXTAUTH_SECRET in production
# All existing sessions will be invalidated
```

### 3. Stripe Keys
- Rotate in Stripe Dashboard
- Update environment variables
- Test webhook endpoints

### 4. Email API Keys
- Rotate in Resend dashboard
- Update RESEND_API_KEY
- Test email functionality

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use strong, unique passwords** for all accounts
3. **Enable 2FA** on all service accounts
4. **Regularly rotate credentials** (quarterly)
5. **Monitor access logs** for suspicious activity
6. **Use HTTPS** in production
7. **Validate all inputs** with Zod schemas
8. **Rate limit** all API endpoints
9. **Log security events** to audit trail
10. **Keep dependencies updated**

## Incident Response

1. **Immediate**: Revoke compromised credentials
2. **Assess**: Determine scope of breach
3. **Notify**: Alert affected users if necessary
4. **Rotate**: Update all related credentials
5. **Monitor**: Watch for continued suspicious activity
6. **Document**: Record incident and lessons learned
