# Railway Quick Start Guide - AgriPadi

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **agripadi** repository

### Step 3: Add Railway Volume (CRITICAL!)
1. Click on your service
2. Go to **"Settings"** tab
3. Scroll to **"Volumes"**
4. Click **"+ Add Volume"**
5. Enter:
   - **Mount Path**: `/var/www/html/database`
   - **Name**: `agripadi-database`
6. Click **"Add"**

### Step 4: Set Environment Variables
Go to **"Variables"** tab and add:

```env
APP_NAME=AgriPadi
APP_ENV=production
APP_DEBUG=false
APP_LOCALE=ms
DB_CONNECTION=sqlite
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
LOG_LEVEL=error
VITE_APP_NAME=AgriPadi
```

### Step 5: Generate APP_KEY
Run locally:
```bash
php artisan key:generate --show
```

Copy the output (starts with `base64:`) and add to Railway:
```env
APP_KEY=base64:YOUR_KEY_HERE
```

### Step 6: Generate Domain
1. Go to **"Settings"** → **"Domains"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://agripadi.up.railway.app`)
4. Add to variables:
```env
APP_URL=https://agripadi.up.railway.app
```

### Step 7: Deploy & Wait
- Railway will auto-deploy
- Check **"Deployments"** tab for progress
- Wait 5-10 minutes for first build

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] **Volume added at `/var/www/html/database`** (CRITICAL!)
- [ ] Environment variables set
- [ ] APP_KEY generated and added
- [ ] Domain generated and APP_URL updated
- [ ] Deployment successful
- [ ] Website accessible at Railway URL

---

## 🔧 If You See "Table already exists" Error

See [RAILWAY_FIX_DATABASE.md](RAILWAY_FIX_DATABASE.md) for solutions.

**Quick Fix**: Make sure you added the Railway Volume!

---

## 📝 Post-Deployment

### Create Admin User
```bash
# Using Railway CLI
railway run php artisan tinker

# In tinker:
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@agripadi.com';
$user->password = bcrypt('your-password');
$user->role = 1; // 1 = admin, 0 = farmer
$user->save();
```

### Check Application Health
Visit: `https://your-app.up.railway.app/up`

Should return: `OK`

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check Railway logs, ensure all files committed |
| 500 error | Set APP_DEBUG=true temporarily, check logs |
| Database error | Verify Volume is added at `/var/www/html/database` |
| Assets 404 | Check public/build directory exists after build |

---

## 📚 Full Documentation

- [Complete Deployment Guide](RAILWAY_DEPLOYMENT.md)
- [Database Error Fix](RAILWAY_FIX_DATABASE.md)
- [Railway Docs](https://docs.railway.app)

---

**Your AgriPadi app should now be live!** 🎉
