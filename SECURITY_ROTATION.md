# Security Rotation Guide

This document outlines the steps to rotate all secrets and purge them from git history.

## ⚠️ CRITICAL: Secrets Found in Repository

The following secrets were found in the repository and MUST be rotated:

### Database Credentials
- **Database URL**: `postgresql://neondb_owner:npg_w30vYKVjpZTg@ep-nameless-tree-ad8hdnhb-pooler.c-2.us-east-1.aws.neon.tech/neondb`
- **Action**: Rotate database password and update connection string

### Email Service
- **Resend API Key**: `re_admAVbVF_6xxKfeScLrPM7sxWm9KuHemh`
- **Action**: Regenerate API key in Resend dashboard

### Admin Credentials (in README)
- **Email**: `admin@happyhour.com`
- **Password**: `admin123!`
- **Action**: Change admin password immediately

## 🔄 Rotation Checklist

### 1. Database
- [ ] Change database password
- [ ] Update DATABASE_URL in all environments
- [ ] Test connection with new credentials

### 2. NextAuth
- [ ] Generate new NEXTAUTH_SECRET (32+ characters)
- [ ] Update in all environments
- [ ] Test authentication flows

### 3. OAuth Providers
- [ ] Google OAuth: Regenerate client secret
- [ ] Apple OAuth: Regenerate client secret
- [ ] Update credentials in all environments

### 4. Email Service
- [ ] Resend: Regenerate API key
- [ ] Update RESEND_API_KEY in all environments
- [ ] Test email sending

### 5. External APIs
- [ ] Google Maps: Regenerate API key
- [ ] Google Places: Regenerate API key
- [ ] Update in all environments

### 6. Payment Processing
- [ ] Stripe: Regenerate secret keys
- [ ] Update in all environments
- [ ] Test payment flows

### 7. Redis
- [ ] Change Redis password
- [ ] Update REDIS_URL in all environments
- [ ] Test Redis connection

### 8. Monitoring
- [ ] Sentry: Regenerate DSN
- [ ] Update SENTRY_DSN in all environments

## 🧹 Git History Purge

### Prerequisites
```bash
# Install git-filter-repo
python3 -m pip install git-filter-repo
```

### Purge Commands
```bash
# Remove all environment files from git history
git filter-repo --invert-paths --path .env --path .env.local --path .env.production --force

# Force push to remote (WARNING: This rewrites history)
git push --force --all
git push --force --tags
```

### Alternative: BFG Repo-Cleaner
```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Remove environment files
java -jar bfg-1.14.0.jar --delete-files ".env*" .

# Clean up
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Force push
git push --force --all
```

## 🔒 Post-Rotation Security Measures

### 1. Enable Maintenance Mode
```bash
# Set maintenance mode during rotation
export MAINTENANCE_MODE=true
```

### 2. Verify No Secrets in Code
```bash
# Search for potential secrets
grep -r "password\|secret\|key\|token" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .
grep -r "admin@happyhour.com\|admin123" .
```

### 3. Update Documentation
- [ ] Remove admin credentials from README
- [ ] Update deployment guides
- [ ] Remove any hardcoded secrets from docs

### 4. Audit Access
- [ ] Review who has access to production environments
- [ ] Rotate any shared credentials
- [ ] Enable 2FA where possible

## 🚨 Emergency Response

If secrets are compromised:

1. **Immediately** enable maintenance mode
2. Rotate ALL secrets (not just the compromised ones)
3. Review access logs for suspicious activity
4. Notify users if necessary
5. Update incident response documentation

## 📋 Verification Checklist

After rotation, verify:

- [ ] All environment files are in .gitignore
- [ ] No secrets in git history
- [ ] No secrets in documentation
- [ ] All services working with new credentials
- [ ] Maintenance mode can be disabled
- [ ] All tests passing

## 📞 Support

For questions about this rotation process:
- Create an issue in the repository
- Contact the security team
- Review the incident response plan
