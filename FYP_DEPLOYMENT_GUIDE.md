# AgriPadi FYP Deployment Guide

## Simple Deployment Options for FYP

### Option 1: Free Hosting (Easiest for FYP Demo)

#### A. Using InfinityFree (Free PHP Hosting)
**Pros:** Free, supports Laravel, MySQL included
**Cons:** Slower performance, ads (can be removed)

1. **Sign up:** https://infinityfree.net
2. **Upload files via FTP**
3. **Create MySQL database**
4. **Update .env with database credentials**

**Steps:**
```bash
# 1. Prepare files for upload
composer install --no-dev
npm run build

# 2. Create a zip of your project
# 3. Upload via FTP or File Manager
# 4. Extract on server
# 5. Set permissions on storage and bootstrap/cache folders
```

#### B. Using 000webhost (Free)
**Pros:** Free, no ads, supports PHP/MySQL
**Cons:** Limited resources

1. **Sign up:** https://www.000webhost.com
2. **Upload files**
3. **Setup database**

### Option 2: Shared Hosting (RM10-30/month)

#### Recommended: Niagahoster / Hostinger Malaysia
**Cost:** ~RM15/month
**Pros:** Fast, reliable, Malaysian support
**Setup:** https://www.niagahoster.co.id

### Option 3: Local Network Demo (Free - For Presentation Only)

Run on your laptop and demo to lecturers:

```bash
# Start Laravel
php artisan serve --host=0.0.0.0 --port=8000

# Your system will be accessible at:
# http://your-laptop-ip:8000
# Example: http://192.168.1.100:8000
```

**Pros:**
- Free
- Full control
- Works for presentation

**Cons:**
- Need laptop during presentation
- Not accessible outside your network

---

## Quick Deployment Steps (Any Host)

### Step 1: Prepare Files

```bash
# Install dependencies
composer install --no-dev --optimize-autoloader

# Build frontend assets
npm run build

# Clear and cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 2: Update .env for Production

```env
APP_NAME=AgriPadi
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database (get from hosting provider)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Email - Keep Mailtrap for FYP demo
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=e77b743be25059
MAIL_PASSWORD=8a818043ade87e
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@agripadi.com"
MAIL_FROM_NAME="AgriPadi"

# Queue (can stay as sync for FYP)
QUEUE_CONNECTION=sync
```

### Step 3: Upload Files

**Via FTP (FileZilla):**
1. Download FileZilla
2. Connect using host's FTP credentials
3. Upload all files EXCEPT:
   - `node_modules/` (too large)
   - `.git/` (not needed)
   - `.env` (create new one on server)

**Files to Upload:**
- `app/`
- `bootstrap/`
- `config/`
- `database/`
- `public/`
- `resources/`
- `routes/`
- `storage/`
- `vendor/` (after composer install)
- `artisan`
- `composer.json`
- All other root files

### Step 4: Setup on Server

```bash
# 1. SSH into server or use hosting panel terminal

# 2. Set correct permissions
chmod -R 755 storage bootstrap/cache
chmod -R 777 storage/logs

# 3. Create storage link
php artisan storage:link

# 4. Run migrations
php artisan migrate --force

# 5. Generate app key (if not set)
php artisan key:generate
```

### Step 5: Configure Database

**In hosting control panel:**
1. Create MySQL database
2. Create MySQL user
3. Assign user to database
4. Note down credentials

**Update .env:**
```env
DB_DATABASE=your_cpanel_db_name
DB_USERNAME=your_cpanel_db_user
DB_PASSWORD=your_cpanel_db_password
```

### Step 6: Point Domain to public folder

**Important:** Laravel requires the `public/` folder as web root.

**In cPanel/hosting panel:**
1. Find "Document Root" or "Web Root" setting
2. Point it to `public_html/agripadi/public` (or wherever you uploaded)

**Or create .htaccess in root:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

---

## FYP Demo Recommendation

For your FYP presentation, I recommend:

### Best Option: Local Demo + Mailtrap

**Setup (5 minutes):**
1. Keep everything as is
2. Start server: `php artisan serve`
3. Access at `http://localhost:8000`
4. Demo emails in Mailtrap: https://mailtrap.io

**During Presentation:**
1. Login as admin
2. Create announcement with image
3. Open Mailtrap in another tab
4. Show email received with beautiful design
5. Login as farmer
6. Submit feedback
7. Login as admin, add response
8. Show feedback email in Mailtrap

**Why This is Best:**
- ✅ Everything works perfectly
- ✅ No hosting costs
- ✅ Full control
- ✅ Can demo all features
- ✅ Beautiful email design in Mailtrap
- ✅ No deployment issues during presentation

### Alternative: Deploy to Free Host

If lecturers require online access:

**Use Heroku (Free tier available):**
1. Sign up: https://heroku.com
2. Install Heroku CLI
3. Deploy:
```bash
# Login
heroku login

# Create app
heroku create agripadi-fyp

# Add buildpacks
heroku buildpacks:add heroku/php
heroku buildpacks:add heroku/nodejs

# Push code
git push heroku main

# Setup database
heroku addons:create jawsdb:kitefin

# Run migrations
heroku run php artisan migrate --force

# Open app
heroku open
```

---

## Testing Checklist Before Demo

- [ ] Can create user accounts (farmer and admin)
- [ ] Can login successfully
- [ ] Admin can create announcements
- [ ] Email appears in Mailtrap
- [ ] Email displays logo and images
- [ ] Farmer can submit feedback
- [ ] Admin can respond to feedback
- [ ] Feedback email sent successfully
- [ ] All images display correctly
- [ ] Mobile responsive (test on phone)

---

## Troubleshooting Common Issues

### Issue: 500 Error after deployment
**Solution:**
```bash
chmod -R 775 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
```

### Issue: Images not showing
**Solution:**
```bash
php artisan storage:link
chmod -R 755 storage/app/public
```

### Issue: Database connection error
**Solution:**
- Check .env database credentials
- Ensure database exists in hosting panel
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

### Issue: Email not sending
**Solution:**
- Check Mailtrap credentials are correct
- Ensure .env has correct MAIL_USERNAME and MAIL_PASSWORD
- Test: `php artisan tinker` then `Mail::raw('Test', fn($m) => $m->to('test@test.com')->subject('Test'));`

---

## Final Recommendation for FYP

**For Best Results:**

1. **Demo locally** (php artisan serve) during presentation
2. **Use Mailtrap** to show emails
3. **Prepare backup** - Have screenshots/video if internet fails
4. **Practice demo** - Run through the flow 2-3 times before presentation

**If you must deploy online:**
- Use free host (InfinityFree or 000webhost)
- Deploy 1-2 weeks before presentation to test
- Have local backup ready

Your system is excellent for FYP! The email feature is a strong point - make sure to highlight it during presentation! 🎓🌾

Good luck with your FYP defense! 🚀
