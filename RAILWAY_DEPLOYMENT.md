# AgriPadi - Railway Deployment Guide

This guide will help you deploy the AgriPadi application to Railway.

## Prerequisites

1. A [Railway](https://railway.app) account
2. Git repository with your code pushed to GitHub/GitLab
3. Railway CLI (optional but recommended)

## Step-by-Step Deployment

### 1. Create a New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your **agripadi** repository

### 2. Configure Environment Variables

Railway will automatically detect your Dockerfile. Now you need to set up environment variables:

1. In your Railway project, go to the **"Variables"** tab
2. Click **"+ New Variable"**
3. Add the following variables:

#### Required Variables:

```env
APP_NAME=AgriPadi
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app-name.up.railway.app
APP_LOCALE=ms
APP_FALLBACK_LOCALE=en

DB_CONNECTION=sqlite

SESSION_DRIVER=database
SESSION_LIFETIME=120

QUEUE_CONNECTION=database
CACHE_STORE=database

LOG_CHANNEL=stack
LOG_LEVEL=error

VITE_APP_NAME=AgriPadi
```

#### Generate APP_KEY:

Railway will need an application key. Generate one using:

```bash
# Option 1: Use Railway CLI
railway run php artisan key:generate --show

# Option 2: Generate locally
php artisan key:generate --show
```

Copy the generated key (starts with `base64:`) and add it as:
```env
APP_KEY=base64:your-generated-key-here
```

### 3. Configure Database

**Option A: SQLite (Simplest)**

SQLite is already configured in the Dockerfile. **IMPORTANT**: You MUST add a Railway Volume to persist the database:

1. In Railway, go to your service
2. Click **"Settings"** tab
3. Scroll to **"Volumes"** section
4. Click **"+ Add Volume"**
5. Enter:
   - **Mount Path**: `/var/www/html/database`
   - **Name**: `agripadi-database`
6. Click **"Add"**

Then set the environment variable:
```env
DB_CONNECTION=sqlite
```

**Option B: MySQL/PostgreSQL (Recommended for Production)**

1. In Railway, click **"+ New"** → **"Database"** → Choose MySQL or PostgreSQL
2. Railway will automatically create database connection variables
3. Update your environment variables:

For **MySQL**:
```env
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

For **PostgreSQL**:
```env
DB_CONNECTION=pgsql
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_DATABASE=${PGDATABASE}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
```

### 4. Deploy

1. Railway will automatically build and deploy your application
2. Monitor the build logs in the **"Deployments"** tab
3. Wait for the build to complete (usually 5-10 minutes for first deployment)

### 5. Generate Domain

1. Go to **"Settings"** tab in your Railway project
2. Under **"Domains"**, click **"Generate Domain"**
3. Railway will provide a URL like: `https://agripadi.up.railway.app`
4. Update the `APP_URL` environment variable with this URL

### 6. Run Database Migrations

The Dockerfile's start script automatically runs migrations, but if you need to run them manually:

```bash
# Using Railway CLI
railway run php artisan migrate --force
```

## Optional: Configure Mail Service

### Using Gmail SMTP:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@agripadi.com
MAIL_FROM_NAME=AgriPadi
```

**Note**: For Gmail, you need to generate an [App Password](https://myaccount.google.com/apppasswords).

### Using Mailtrap (for testing):

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
```

## File Storage Configuration

By default, files are stored locally in the container. For production, consider using Railway Volumes or external storage:

### Option 1: Railway Volumes

1. In Railway, go to your service
2. Click **"Settings"** → **"Volumes"**
3. Add a volume mounted at `/var/www/html/storage/app`

### Option 2: AWS S3 or Cloudinary

Update environment variables:

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=agripadi-files
```

## Troubleshooting

### Build Fails

1. Check the build logs in Railway
2. Ensure all Docker configuration files are committed
3. Verify package.json and composer.json are valid

### Application Error 500

1. Set `APP_DEBUG=true` temporarily to see errors
2. Check logs: `railway logs`
3. Verify APP_KEY is set correctly
4. Ensure database migrations ran successfully

### Assets Not Loading

1. Verify `npm run build` completed successfully
2. Check that `/public/build` directory exists in deployment
3. Ensure APP_URL matches your Railway domain

### Queue Jobs Not Running

The Dockerfile includes a supervisor configuration for queue workers. Check if they're running:

```bash
railway run supervisorctl status
```

## Updating Your Application

Railway auto-deploys when you push to your main branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

Railway will automatically:
1. Build the new Docker image
2. Run migrations
3. Deploy the new version
4. Zero-downtime deployment

## Database Backups

### SQLite:

Download the database file using Railway CLI:
```bash
railway run cat database/database.sqlite > backup.sqlite
```

### MySQL/PostgreSQL:

Railway provides automatic backups for database services. Check the database service settings.

## Performance Optimization

1. **Enable OPcache**: Already included in Dockerfile
2. **Use CDN**: Consider Cloudflare for static assets
3. **Redis Cache** (Optional):
   - Add Redis service in Railway
   - Update cache driver:
     ```env
     CACHE_STORE=redis
     REDIS_CLIENT=phpredis
     ```

## Security Checklist

- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong `APP_KEY`
- [ ] Configure HTTPS (Railway provides this automatically)
- [ ] Set up proper CORS if needed
- [ ] Enable rate limiting (already configured in Laravel)
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates: `composer update` and `npm update`

## Monitoring

1. **Railway Metrics**: Check CPU/Memory usage in Railway dashboard
2. **Laravel Telescope** (Optional): Install for debugging
   ```bash
   composer require laravel/telescope
   php artisan telescope:install
   php artisan migrate
   ```

3. **Error Tracking**: Consider integrating Sentry or Bugsnag

## Cost Estimation

Railway pricing:
- **Hobby Plan**: $5/month includes $5 credit (good for small apps)
- **Pro Plan**: Pay-as-you-go ($0.000463/GB-hour for memory)

Typical AgriPadi usage: ~$5-15/month depending on traffic

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Laravel Docs: https://laravel.com/docs

## Useful Railway CLI Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs

# Run commands
railway run php artisan migrate
railway run php artisan cache:clear

# Open project in browser
railway open
```

## Quick Reference: Environment Variables

Copy and paste this into Railway Variables section:

```
APP_NAME=AgriPadi
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-app.up.railway.app
APP_LOCALE=ms
APP_FALLBACK_LOCALE=en
DB_CONNECTION=sqlite
SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=database
CACHE_STORE=database
LOG_CHANNEL=stack
LOG_LEVEL=error
VITE_APP_NAME=AgriPadi
MAIL_MAILER=log
FILESYSTEM_DISK=local
```

---

**Deployment Complete!** 🚀

Your AgriPadi application should now be live on Railway. Access it at your generated domain.
