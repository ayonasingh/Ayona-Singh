# Vercel Deployment Checklist

## Pre-Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] MongoDB Atlas cluster created (optional)
- [ ] Cloudinary account set up (optional)
- [ ] All sensitive data removed from code
- [ ] `.env` files are in `.gitignore`

## Vercel Setup

- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project imported in Vercel dashboard

## Environment Variables (Set in Vercel Dashboard)

### Required
- [ ] `JWT_SECRET` - Strong random string
- [ ] `ADMIN_USERNAME` - Your admin username
- [ ] `ADMIN_PASSWORD` - Strong password

### Optional (MongoDB)
- [ ] `MONGO_URI` - MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`
  - Whitelist IP: `0.0.0.0/0` in MongoDB Atlas

### Optional (Cloudinary)
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

### Auto-Set by Vercel
- [ ] `VERCEL=1` (automatically set)
- [ ] `NODE_ENV=production` (automatically set)

## Deployment Steps

1. [ ] Push code to GitHub main branch
2. [ ] Vercel auto-deploys (or click "Deploy" in dashboard)
3. [ ] Wait for build to complete (~2-3 minutes)
4. [ ] Check deployment logs for errors

## Post-Deployment Testing

- [ ] Visit your Vercel URL
- [ ] Test homepage loads correctly
- [ ] Test API endpoint: `https://your-app.vercel.app/api/home`
- [ ] Test admin login at `/admin`
- [ ] Test image upload in admin panel
- [ ] Test creating/editing content
- [ ] Test all navigation links
- [ ] Test on mobile device

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Check MongoDB connection (if using)
4. Review `VERCEL_DEPLOY_GUIDE.md` for detailed help

## Custom Domain (Optional)

- [ ] Add custom domain in Vercel dashboard
- [ ] Configure DNS records
- [ ] Wait for SSL certificate
- [ ] Test custom domain

## Security Review

- [ ] Strong JWT_SECRET used
- [ ] Strong admin password set
- [ ] No secrets in code or git history
- [ ] CORS properly configured
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled (automatic on Vercel)

## Performance Check

- [ ] Frontend loads in < 3 seconds
- [ ] API responses in < 1 second
- [ ] Images optimized and loading fast
- [ ] No console errors in browser

## Done! 🎉

Your portfolio is now live at: `https://your-project.vercel.app`

## Quick Commands

```bash
# Redeploy from CLI
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls
```
