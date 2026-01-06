# Quick Email Test Guide

## Test the Email System in 5 Minutes

### Option 1: View Emails in Log File (No Setup Required)

Your system is already configured to log emails. Here's how to test:

#### Step 1: Open Log File
```bash
# In a new terminal, watch the log file
tail -f storage/logs/laravel.log
```

Or manually open: `storage/logs/laravel.log`

#### Step 2: Create an Announcement
1. Start your server: `php artisan serve`
2. Log in as admin
3. Go to: http://localhost:8000/admin/announcements
4. Click "Create Announcement"
5. Fill in:
   - Title: "Subsidi Baja 2026 Dibuka"
   - Content: "Permohonan subsidi baja kini dibuka. Tarikh akhir: 31 Mac 2026"
   - Category: "Program Kerajaan"
   - Publish Now: ✓ (checked)
6. Submit

#### Step 3: Check the Log
You should see in `storage/logs/laravel.log`:
```
To: farmer@example.com
Subject: [AgriPadi] Pengumuman Baru: Subsidi Baja 2026 Dibuka
<!DOCTYPE html>
<html lang="ms">
...
```

The full beautiful HTML email will be logged!

#### Step 4: Test Feedback Response
1. Log in as a farmer (or create a farmer account)
2. Go to: http://localhost:8000/farmer/feedback
3. Submit feedback
4. Log out, log in as admin
5. Go to: http://localhost:8000/admin/feedback
6. Click on the feedback
7. Add admin notes: "Terima kasih atas maklum balas anda. Kami akan perbaiki ciri ini."
8. Submit
9. Check `storage/logs/laravel.log` again - you'll see the feedback response email!

---

### Option 2: Use Mailtrap (See Real Email Preview)

Mailtrap is a free service that catches emails so you can see exactly how they look.

#### Step 1: Sign Up for Mailtrap
1. Go to: https://mailtrap.io
2. Sign up for free account
3. Go to "Email Testing" → "Inboxes" → "My Inbox"
4. Copy the SMTP credentials

#### Step 2: Update Your .env
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username-here
MAIL_PASSWORD=your-mailtrap-password-here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@agripadi.com"
MAIL_FROM_NAME="AgriPadi"
```

#### Step 3: Clear Config
```bash
php artisan config:clear
```

#### Step 4: Test
1. Create an announcement (as in Option 1)
2. Go to Mailtrap inbox
3. See the beautiful email with proper formatting, images, and colors!

---

### Option 3: Use Real Gmail (For Real Testing)

#### Step 1: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Create a new app password for "AgriPadi"
3. Copy the 16-character password

#### Step 2: Update .env
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="youremail@gmail.com"
MAIL_FROM_NAME="AgriPadi"
```

#### Step 3: Update Test User Email
1. Log into your database
2. Find a farmer user: `SELECT * FROM users WHERE role = 2;`
3. Update their email to yours: `UPDATE users SET email = 'youremail@gmail.com', email_verified_at = NOW() WHERE user_id = X;`

#### Step 4: Test
1. Clear config: `php artisan config:clear`
2. Create an announcement
3. Check your Gmail inbox - you'll get a real email!

---

## What You Should See

### Announcement Email Preview
- ✅ Green header with rice emoji 🌾
- ✅ "Pengumuman Baru AgriPadi" title
- ✅ Category badge (if provided)
- ✅ Announcement title in large text
- ✅ Full content
- ✅ Image (if uploaded)
- ✅ "Lihat Di Platform AgriPadi" button
- ✅ Professional footer

### Feedback Response Email Preview
- ✅ Blue header with chat emoji 💬
- ✅ "Maklum Balas dari Pegawai Pertanian" title
- ✅ Original feedback in gray box
- ✅ Star rating (if provided)
- ✅ Admin response in blue box
- ✅ "Ke Platform AgriPadi" button
- ✅ Professional footer

---

## Troubleshooting

### No email in log?
- Check `storage/logs/laravel.log` - it should be there
- Make sure announcement was published (publish_now checked)
- Make sure there are farmers in database with verified emails

### Email not beautiful?
- Mailtrap and Gmail will render HTML properly
- Log file shows raw HTML - that's normal

### Error when creating announcement?
```bash
# Check for errors
tail -f storage/logs/laravel.log

# Test mail config
php artisan tinker
Mail::raw('Test', function($m) { $m->to('test@example.com')->subject('Test'); });
```

---

## Production Checklist

Before going live:

- [ ] Change `MAIL_MAILER` from `log` to `smtp` or `ses`
- [ ] Use proper email service (Gmail for small scale, AWS SES for large scale)
- [ ] Set `MAIL_FROM_ADDRESS` to a professional address (e.g., noreply@agripadi.gov.my)
- [ ] Set up email queue: `QUEUE_CONNECTION=database` + `php artisan queue:work`
- [ ] Test with real farmer email addresses
- [ ] Monitor email delivery rates
- [ ] Set up SPF/DKIM records for your domain

---

## Quick Commands

```bash
# View last 50 lines of log
tail -n 50 storage/logs/laravel.log

# Watch log in real-time
tail -f storage/logs/laravel.log

# Clear all caches
php artisan cache:clear && php artisan config:clear && php artisan route:clear

# Test mail in tinker
php artisan tinker
Mail::raw('Test message', function($m) { $m->to('test@example.com')->subject('Test'); });
```
