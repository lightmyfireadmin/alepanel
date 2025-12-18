# Deployment Checklist

This checklist must be completed before deploying to production.

## ⚠️ CRITICAL: Security - Authentication Bypass

### Files to Review and Update

Before deploying to production, you MUST revert the authentication bypass:

#### 1. `/src/app/admin/login/page.tsx`

**Current state (TESTING ONLY):**
```typescript
// ⚠️ TEMPORARY BYPASS FOR TESTING PHASE ONLY ⚠️
// Bypass actual authentication - accept any password
await signIn("credentials", {
  email: selectedEmail,
  password: "bypass",
  redirect: false,
});
router.push("/admin");
router.refresh();
```

**Production state (UNCOMMENT THIS):**
```typescript
const result = await signIn("credentials", {
  email: selectedEmail,
  password,
  redirect: false,
});

if (result?.error) {
  setError("Utilisateur ou mot de passe incorrect");
} else {
  router.push("/admin");
  router.refresh();
}
```

#### 2. `/src/app/admin/(dashboard)/layout.tsx`

**Current state (TESTING ONLY):**
```typescript
// ⚠️ TEMPORARY BYPASS FOR TESTING PHASE ONLY ⚠️
// Commented out to allow access without authentication
/*
if (!session) {
  redirect("/admin/login");
}
*/
```

**Production state (UNCOMMENT THIS):**
```typescript
if (!session) {
  redirect("/admin/login");
}
```

### Verification Steps

- [ ] Uncommented authentication check in login page
- [ ] Uncommented session check in dashboard layout
- [ ] Removed all bypass code
- [ ] Tested that invalid credentials are rejected
- [ ] Tested that valid credentials grant access
- [ ] Verified session timeout works correctly

## Environment Variables

Ensure the following environment variables are set in your production environment:

### Required
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `AUTH_SECRET` - NextAuth secret key (generate new for production)
- [ ] `NEXTAUTH_URL` - Production URL (e.g., https://alecia.fr)
- [ ] `NEXT_PUBLIC_APP_URL` - Public-facing app URL

### Optional (depending on features used)
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- [ ] `MISTRAL_API_KEY` - For AI content generation
- [ ] `GROQ_API_KEY` - Alternative AI service
- [ ] `RESEND_API_KEY` - Email service
- [ ] `NEXT_PUBLIC_MAPBOX_TOKEN` - Maps integration
- [ ] Azure AD credentials (if using Microsoft authentication)

## Database Setup

Run these commands in order:

```bash
# 1. Push the schema to the database
npm run db:push

# 2. Seed admin users (if needed)
npm run db:seed:admin

# 3. Seed job offers (if needed)
npm run db:seed:jobs

# 4. Or seed all data at once
npm run db:seed:all
```

### Verification
- [ ] Database schema created successfully
- [ ] Admin users can log in
- [ ] Job offers appear on website
- [ ] All tables populated correctly

## Pre-Deployment Testing

### Build and Type Check
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Functionality Tests
- [ ] Home page loads correctly
- [ ] All public pages accessible
- [ ] Admin login works with valid credentials
- [ ] Admin login rejects invalid credentials
- [ ] All admin menu items accessible
- [ ] Job offers display on public page
- [ ] Job offers CRUD works in admin panel
- [ ] Contact forms work
- [ ] Newsletter signup works

### Security Tests
- [ ] Cannot access admin without authentication
- [ ] Session expires after timeout
- [ ] HTTPS enforced
- [ ] No secrets in client-side code
- [ ] CSP headers configured
- [ ] CORS properly configured

## Post-Deployment Verification

After deploying to production:

- [ ] Visit production URL and verify home page loads
- [ ] Test admin login with production credentials
- [ ] Verify all menu navigation works
- [ ] Check job offers display correctly
- [ ] Test contact form submission
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Verify Google Analytics/tracking (if configured)
- [ ] Check error monitoring (if configured)

## Rollback Plan

If issues are discovered after deployment:

1. **Immediate Issues**
   - Revert to previous deployment
   - Check environment variables
   - Review deployment logs

2. **Database Issues**
   - Have database backup ready
   - Know how to restore from backup
   - Document rollback procedure

3. **Authentication Issues**
   - Emergency admin access method
   - Database direct access credentials
   - Support contact information

## Support Contacts

- **Technical Issues**: [Add contact]
- **Database Issues**: [Add contact]
- **Deployment Issues**: [Add contact]

## Documentation

After deployment, update:

- [ ] Internal documentation with production URLs
- [ ] Team wiki with new features
- [ ] User guides if needed
- [ ] API documentation if changed

---

## Sign-off

**Deployed by:** _________________

**Date:** _________________

**Reviewed by:** _________________

**Approved by:** _________________

**All checklist items completed:** [ ] Yes [ ] No

**Notes:**
