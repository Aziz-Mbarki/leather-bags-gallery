# Deployment Guide

This guide covers deploying the Cuir Élégant e-commerce platform to production.

## Pre-deployment Checklist

### 1. Database Setup
- [ ] Supabase project created
- [ ] All SQL scripts executed in order
- [ ] RLS policies configured
- [ ] Admin user created
- [ ] Test data seeded

### 2. Environment Variables
- [ ] All required environment variables set
- [ ] Google Sheets API configured (if using)
- [ ] Supabase keys configured
- [ ] Redirect URLs updated for production

### 3. Code Quality
- [ ] TypeScript compilation passes
- [ ] No console errors in development
- [ ] All features tested
- [ ] Mobile responsiveness verified

## Vercel Deployment

### Step 1: Prepare for Deployment

1. **Update redirect URLs in Supabase**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your production domain to Site URL
   - Add production domain to Redirect URLs

2. **Verify environment variables**
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GOOGLE_SHEETS_API_KEY=your_api_key (optional)
   GOOGLE_SHEET_ID=your_sheet_id (optional)
   GOOGLE_SHEET_NAME=Commandes (optional)
   \`\`\`

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel
   \`\`\`

4. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all required variables

5. **Deploy to Production**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Step 3: Post-deployment Verification

1. **Test Core Features**
   - [ ] Homepage loads correctly
   - [ ] Product gallery displays
   - [ ] User registration works
   - [ ] User login works
   - [ ] Shopping cart functions
   - [ ] Order placement works
   - [ ] Admin dashboard accessible
   - [ ] Google Sheets integration (if enabled)

2. **Test Authentication Flow**
   - [ ] Register new user
   - [ ] Email confirmation works
   - [ ] Login with confirmed user
   - [ ] Admin access works
   - [ ] User roles enforced

3. **Test Order Flow**
   - [ ] Add products to cart
   - [ ] Proceed to checkout
   - [ ] Fill order form
   - [ ] Submit order
   - [ ] Order appears in admin
   - [ ] Google Sheets updated (if enabled)

## Alternative Deployment Options

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   Add all required environment variables in Netlify dashboard

### Railway

1. **Connect Repository**
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Environment Variables**
   Add variables in Railway dashboard

### Self-hosted

1. **Build the Application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start Production Server**
   \`\`\`bash
   npm start
   \`\`\`

3. **Use Process Manager**
   \`\`\`bash
   # Using PM2
   npm install -g pm2
   pm2 start npm --name "cuir-elegant" -- start
   \`\`\`

## Domain Configuration

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Supabase Settings**
   - Update Site URL to your custom domain
   - Update Redirect URLs

3. **SSL Certificate**
   - Vercel automatically provides SSL
   - Verify HTTPS is working

## Monitoring and Maintenance

### Performance Monitoring

1. **Vercel Analytics**
   - Enable Vercel Analytics in dashboard
   - Monitor Core Web Vitals

2. **Supabase Monitoring**
   - Monitor database performance
   - Check API usage
   - Review authentication metrics

### Regular Maintenance

1. **Database Backups**
   - Supabase provides automatic backups
   - Consider additional backup strategy

2. **Dependency Updates**
   \`\`\`bash
   npm audit
   npm update
   \`\`\`

3. **Security Updates**
   - Monitor for security advisories
   - Update dependencies regularly

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all imports are correct
   - Check environment variables

2. **Authentication Issues**
   - Verify Supabase URLs
   - Check redirect URLs
   - Confirm RLS policies

3. **Database Connection Issues**
   - Verify Supabase keys
   - Check network connectivity
   - Review database logs

### Debug Commands

\`\`\`bash
# Check build locally
npm run build

# Type check
npm run type-check

# Check for linting issues
npm run lint
\`\`\`

## Rollback Strategy

### Quick Rollback

1. **Vercel Rollback**
   \`\`\`bash
   vercel rollback
   \`\`\`

2. **Database Rollback**
   - Use Supabase point-in-time recovery
   - Restore from backup if needed

### Gradual Rollback

1. **Feature Flags**
   - Implement feature flags for major changes
   - Disable problematic features quickly

2. **Database Migrations**
   - Always create reversible migrations
   - Test rollback procedures

## Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit secrets to repository
   - Use different keys for production
   - Rotate keys regularly

2. **Database Security**
   - Review RLS policies
   - Monitor for suspicious activity
   - Regular security audits

3. **API Security**
   - Rate limiting implemented
   - Input validation in place
   - CORS properly configured

This deployment guide ensures a smooth and secure deployment process for the Cuir Élégant platform.
