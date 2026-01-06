# Email Notification System - Setup Guide

## Overview
Email notifications have been implemented for:
1. **New Announcements** - When admin publishes an announcement, all farmers receive an email
2. **Feedback Responses** - When pegawai pertanian adds notes to feedback, the farmer receives an email

## Files Created

### 1. Mailable Classes
- `app/Mail/NewAnnouncementMail.php` - Handles announcement emails
- `app/Mail/FeedbackResponseMail.php` - Handles feedback response emails

### 2. Email Templates
- `resources/views/emails/new-announcement.blade.php` - Beautiful Malay email for announcements
- `resources/views/emails/feedback-response.blade.php` - Beautiful Malay email for feedback responses

### 3. Modified Controllers
- `app/Http/Controllers/AnnouncementController.php` - Added email sending on publish
- `app/Http/Controllers/FeedbackController.php` - Added email sending on admin notes

## Email Features

### Announcement Emails
- **Recipients**: All farmers (role = 2) with verified emails
- **Subject**: `[AgriPadi] Pengumuman Baru: {title}`
- **Content**:
  - Category badge (if applicable)
  - Full announcement title and content
  - Image (if attached)
  - Link to platform
  - Published date

### Feedback Response Emails
- **Recipients**: The farmer who submitted feedback
- **Subject**: `[AgriPadi] Maklum Balas daripada Pegawai Pertanian`
- **Content**:
  - Original feedback from farmer
  - Rating stars (if provided)
  - Feature mentioned (if applicable)
  - Admin's response/notes
  - Link to platform

## How It Works

### 1. New Announcement
When admin creates or publishes an announcement:
```php
// Automatically sends email to all farmers when:
// - Creating new announcement with publish_now = true
// - Toggling draft announcement to published
```

### 2. Feedback Response
When admin adds notes to farmer feedback:
```php
// Sends email to the farmer who submitted feedback
// Updates success message to confirm email was sent
```

## Email Configuration

### For Development/Testing - Using Log Driver (Current Setup)
Your `.env` is currently set to:
```env
MAIL_MAILER=log
```
This means emails are written to `storage/logs/laravel.log` instead of being sent.

**To test:**
1. Create an announcement as admin
2. Check `storage/logs/laravel.log`
3. You'll see the full email HTML content

### For Production - Using Real Email Service

Choose one of these options:

#### Option 1: Gmail (Free, Easy for Testing)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@agripadi.com"
MAIL_FROM_NAME="AgriPadi"
```

**Note**: You need to create an [App Password](https://support.google.com/accounts/answer/185833) for Gmail (not your regular password).

#### Option 2: Mailtrap (Best for Testing)
Free testing service - emails don't actually send but you can see how they look.

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@agripadi.com"
MAIL_FROM_NAME="AgriPadi"
```

Sign up at: https://mailtrap.io

#### Option 3: AWS SES (Production, Scalable)
For production with many users:

```env
MAIL_MAILER=ses
MAIL_FROM_ADDRESS="noreply@agripadi.com"
MAIL_FROM_NAME="AgriPadi"
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=ap-southeast-1
```

#### Option 4: SendGrid (Production)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@agripadi.com"
MAIL_FROM_NAME="AgriPadi"
```

## Queue Setup (Recommended for Production)

Currently emails send synchronously. For better performance with many farmers:

### 1. Run Database Queue Migration
```bash
php artisan queue:table
php artisan migrate
```

### 2. Update .env
```env
QUEUE_CONNECTION=database
```

### 3. Run Queue Worker
```bash
php artisan queue:work
```

This sends emails in the background, so admins don't have to wait.

## Testing the Email System

### Test 1: Announcement Email
1. Log in as admin
2. Go to Announcements
3. Create a new announcement with "Publish Now" checked
4. Check your email (or log file if using `MAIL_MAILER=log`)

### Test 2: Feedback Response Email
1. Log in as farmer
2. Submit feedback
3. Log in as admin
4. Go to Feedback section
5. Add admin notes to the feedback
6. Check farmer's email (or log file)

### Test 3: View Email in Log
```bash
tail -f storage/logs/laravel.log
```

## Email Template Customization

Both email templates use:
- **Green color scheme** matching AgriPadi branding
- **Malay language** throughout
- **Mobile-responsive** design
- **Cultural elements** (rice emoji 🌾)

To customize, edit:
- `resources/views/emails/new-announcement.blade.php`
- `resources/views/emails/feedback-response.blade.php`

## Security Features

1. **Email Verification**: Only sends to users with `email_verified_at` set
2. **Error Handling**: Failed emails are logged but don't break the system
3. **Validation**: Only farmers (role = 2) receive announcements
4. **Null Checks**: Verifies email exists before sending

## Performance Considerations

### Current Implementation
- Sends emails synchronously (one by one)
- Good for < 100 farmers

### For Scaling (> 100 farmers)
1. Use queue system (see above)
2. Consider batch sending
3. Use email service with good deliverability (AWS SES, SendGrid)

## Troubleshooting

### Emails not sending?
1. Check `.env` MAIL settings
2. Check `storage/logs/laravel.log` for errors
3. Verify user has email and email_verified_at
4. Test mail config: `php artisan tinker` then `Mail::raw('Test', function($m) { $m->to('test@example.com')->subject('Test'); });`

### Emails going to spam?
1. Use proper MAIL_FROM_ADDRESS (not @gmail.com)
2. Set up SPF and DKIM records for your domain
3. Use reputable email service (AWS SES, SendGrid)

### Gmail blocking?
1. Enable "Less secure app access" (not recommended)
2. Use App Password instead (recommended)
3. Use OAuth2 authentication (advanced)

## Next Steps (Optional Enhancements)

1. **Email Preferences**
   - Let farmers choose which emails to receive
   - Add unsubscribe link

2. **Email Statistics**
   - Track open rates
   - Track click rates

3. **Digest Emails**
   - Weekly summary instead of immediate emails
   - Reduce email fatigue

4. **WhatsApp Integration**
   - More popular in Malaysia
   - Better delivery rates in rural areas

5. **SMS for Critical Alerts**
   - Guaranteed delivery
   - Use for urgent announcements only

## Support

For issues or questions, check Laravel Mail documentation:
https://laravel.com/docs/11.x/mail
