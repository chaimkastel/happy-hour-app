# Runbook - OrderHappyHour Production Support

## Common Issues & Solutions

### 1. Authentication Issues

#### Problem: Users can't log in
**Symptoms:**
- Login form shows "Invalid credentials"
- Users redirected to login repeatedly
- Session not persisting

**Diagnosis:**
```bash
# Check NextAuth configuration
grep -r "NEXTAUTH" .env*

# Check database connection
npx prisma db pull

# Check session logs
vercel logs --follow
```

**Solutions:**
1. Verify `NEXTAUTH_SECRET` is set and consistent
2. Check `NEXTAUTH_URL` matches production domain
3. Ensure database is accessible
4. Clear browser cookies/cache
5. Check for JWT token expiration issues

#### Problem: Role-based access not working
**Symptoms:**
- Users can access wrong pages
- Merchants can't access merchant dashboard
- Admin functions not restricted

**Solutions:**
1. Check middleware configuration
2. Verify user roles in database
3. Clear NextAuth session cache
4. Check JWT token payload

### 2. Stripe Payment Issues

#### Problem: Subscription creation fails
**Symptoms:**
- "Stripe is not configured" error
- Checkout session creation fails
- Payment buttons don't work

**Diagnosis:**
```bash
# Check Stripe environment variables
echo $STRIPE_SECRET_KEY
echo $STRIPE_PRICE_MONTHLY

# Test Stripe connection
curl -u $STRIPE_SECRET_KEY: https://api.stripe.com/v1/charges
```

**Solutions:**
1. Verify Stripe keys are correct and live
2. Check price ID exists in Stripe dashboard
3. Ensure webhook endpoint is configured
4. Test with Stripe test mode first

#### Problem: Webhook events not received
**Symptoms:**
- Subscriptions not activating
- Payment status not updating
- Merchant features locked

**Solutions:**
1. Check webhook endpoint URL in Stripe dashboard
2. Verify webhook secret matches environment variable
3. Check webhook event logs in Stripe dashboard
4. Test webhook endpoint manually
5. Check for webhook signature validation errors

### 3. Database Issues

#### Problem: Database connection errors
**Symptoms:**
- "Database connection failed" errors
- Prisma client errors
- Data not loading

**Diagnosis:**
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
npx prisma db pull

# Check connection pool
npx prisma studio
```

**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check database server status
3. Verify connection limits
4. Check for network issues
5. Restart database if needed

#### Problem: Migration issues
**Symptoms:**
- "Table doesn't exist" errors
- Schema mismatch errors
- Data type errors

**Solutions:**
1. Run `npx prisma migrate deploy`
2. Check migration history
3. Verify schema matches code
4. Reset database if necessary (with backup)

### 4. Performance Issues

#### Problem: Slow page loads
**Symptoms:**
- Pages take > 5 seconds to load
- Timeout errors
- High memory usage

**Diagnosis:**
```bash
# Check Vercel function logs
vercel logs --follow

# Check database query performance
npx prisma studio

# Monitor memory usage
vercel logs --follow | grep -i memory
```

**Solutions:**
1. Optimize database queries
2. Add database indexes
3. Implement caching
4. Optimize images
5. Check for memory leaks
6. Scale up Vercel plan if needed

#### Problem: Rate limiting issues
**Symptoms:**
- "Too many requests" errors
- Legitimate users blocked
- API endpoints failing

**Solutions:**
1. Adjust rate limit thresholds
2. Check for bot traffic
3. Implement IP whitelisting
4. Add user-based rate limiting
5. Monitor rate limit logs

### 5. Email Issues

#### Problem: Emails not sending
**Symptoms:**
- Password reset emails not received
- Voucher emails not sent
- Email service errors

**Diagnosis:**
```bash
# Check Resend configuration
echo $RESEND_API_KEY

# Test email service
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@yourdomain.com","to":"test@example.com","subject":"Test","html":"Test"}'
```

**Solutions:**
1. Verify Resend API key
2. Check domain verification
3. Check email quotas
4. Verify sender email address
5. Check spam folders

### 6. Voucher System Issues

#### Problem: Vouchers not generating
**Symptoms:**
- Claim button not working
- QR codes not generating
- Voucher creation errors

**Solutions:**
1. Check deal status and validity
2. Verify user authentication
3. Check voucher limits
4. Verify QR code generation
5. Check database constraints

#### Problem: Voucher redemption fails
**Symptoms:**
- "Invalid voucher code" errors
- Redemption not processing
- Status not updating

**Solutions:**
1. Verify voucher exists and is valid
2. Check merchant permissions
3. Verify deal is still active
4. Check time window validity
5. Verify QR code scanning

## Monitoring & Alerts

### Key Metrics to Monitor
- **Uptime**: > 99.9%
- **Response Time**: < 3 seconds
- **Error Rate**: < 1%
- **Database Connections**: < 80% of limit
- **Memory Usage**: < 80% of limit
- **Payment Success Rate**: > 95%

### Alert Thresholds
- **Critical**: Service down, payment failures
- **Warning**: High error rate, slow response
- **Info**: New user registrations, successful payments

### Log Monitoring
```bash
# Check error logs
vercel logs --follow | grep -i error

# Check payment logs
vercel logs --follow | grep -i stripe

# Check authentication logs
vercel logs --follow | grep -i auth
```

## Emergency Procedures

### 1. Service Down
1. Check Vercel status page
2. Verify environment variables
3. Check database connectivity
4. Review recent deployments
5. Rollback if necessary

### 2. Payment System Down
1. Check Stripe status
2. Verify webhook configuration
3. Check API key validity
4. Test with Stripe test mode
5. Contact Stripe support if needed

### 3. Database Issues
1. Check database provider status
2. Verify connection string
3. Check for migration issues
4. Restore from backup if needed
5. Contact database support

### 4. Security Incident
1. Immediately revoke compromised credentials
2. Check access logs
3. Notify affected users
4. Update all related secrets
5. Document incident

## Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Verify payment processing
- [ ] Check user registrations

### Weekly
- [ ] Review security logs
- [ ] Check database performance
- [ ] Update dependencies
- [ ] Review user feedback

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification
- [ ] Capacity planning

## Contact Information

### Internal Team
- **Technical Lead**: [Contact]
- **DevOps**: [Contact]
- **Security**: [Contact]

### External Services
- **Vercel Support**: support@vercel.com
- **Stripe Support**: support@stripe.com
- **Resend Support**: support@resend.com
- **Database Provider**: [Contact]

### Emergency Escalation
1. **Level 1**: On-call engineer
2. **Level 2**: Technical lead
3. **Level 3**: CTO/VP Engineering
4. **Level 4**: External support
