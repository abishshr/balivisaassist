# BaliVisaAssist - Setup Summary

## ✅ Completed Automatically

### 1. GitHub Repository
- **Repository**: https://github.com/abishshr/balivisaassist
- **Status**: ✅ Created and code pushed

### 2. Vercel Deployment
- **Live URL**: https://balivisaassist.vercel.app
- **Dashboard**: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist
- **Status**: ✅ Deployed successfully

### 3. Supabase Project
- **Project Name**: balivisaassist
- **Project ID**: sohyjijkmohyrefndvek
- **Project URL**: https://sohyjijkmohyrefndvek.supabase.co
- **Database Password**: IRJU4Q55PbyXxhKo (SAVE THIS SECURELY!)
- **Region**: Southeast Asia (Singapore)
- **Status**: ✅ Created

### 4. Database Setup
- **Tables Created**: ✅
  - admin_users
  - customers
  - applications
  - documents
  - payments
  - activity_logs
- **Indexes**: ✅ Created
- **RLS Policies**: ✅ Enabled
- **Triggers**: ✅ Created

### 5. Storage Setup
- **Bucket**: documents ✅ Created (Private)
- **Storage Policies**: ✅ Created
  - Upload policy for authenticated users
  - View policy for authenticated users
  - Delete policy for authenticated users

---

## 📝 Next Steps (Manual - 10 minutes)

### Step 1: Get Supabase API Keys (2 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/sohyjijkmohyrefndvek/settings/api
2. Look for **"Project API keys"** section
3. Copy these two keys:
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 2: Create Admin User in Supabase (3 minutes)

1. Go to: https://supabase.com/dashboard/project/sohyjijkmohyrefndvek/auth/users
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: your email (e.g., admin@balivisaassist.com)
   - **Password**: create a strong password
   - ✅ **Check "Auto Confirm User"**
4. Click "Create user"
5. **Copy the User UUID** (you'll see it after creation)

6. Go to: https://supabase.com/dashboard/project/sohyjijkmohyrefndvek/sql/new
7. Run this SQL (replace YOUR_USER_UUID and YOUR_EMAIL):
```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID_HERE',
  'your-email@example.com',
  'Your Full Name',
  'admin'
);
```

### Step 3: Configure Vercel Environment Variables (5 minutes)

Run these commands in your terminal:

```bash
cd /Users/abish/Developer/balivisaassist

# Add Supabase credentials (paste the keys you copied from Step 1)
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
# When prompted, enter: https://sohyjijkmohyrefndvek.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
# When prompted, paste your anon key from Supabase

vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development
# When prompted, paste your service_role key from Supabase

# Add site configuration
vercel env add NEXT_PUBLIC_SITE_URL production preview development
# When prompted, enter: https://balivisaassist.com

vercel env add CONTACT_EMAIL production preview development
# When prompted, enter: info@balivisaassist.com

vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production preview development
# When prompted, enter your WhatsApp number with country code (e.g., +6281234567890)

# Redeploy with new environment variables
vercel --prod
```

### Step 4: Configure Domain in Vercel (2 minutes)

```bash
# Add domains
vercel domains add balivisaassist.com
vercel domains add www.balivisaassist.com
```

### Step 5: Update DNS in Namecheap (3 minutes)

1. Login: https://www.namecheap.com/myaccount/login/
2. Go to **Domain List** → **Manage** on balivisaassist.com
3. Go to **Advanced DNS** tab
4. Delete any existing A/CNAME records for @ and www
5. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.19.61 | Automatic |
| A Record | @ | 76.223.126.88 | Automatic |
| CNAME | www | cname.vercel-dns.com | Automatic |

6. Click "Save all changes"
7. Wait 5-30 minutes for DNS propagation

---

## 🎯 Quick Test Checklist

After completing the steps above:

1. **Test Admin Login**:
   - Visit: https://balivisaassist.com/admin/login
   - Login with your admin credentials
   - ✅ Dashboard should load

2. **Test Main Website**:
   - Visit: https://balivisaassist.com
   - ✅ Homepage loads correctly
   - ✅ All links work

3. **Verify SSL**:
   - ✅ HTTPS padlock appears in browser

---

## 📚 Important Credentials (SAVE THESE!)

```
Supabase Project URL: https://sohyjijkmohyrefndvek.supabase.co
Supabase Project ID: sohyjijkmohyrefndvek
Database Password: IRJU4Q55PbyXxhKo

GitHub Repo: https://github.com/abishshr/balivisaassist
Vercel Dashboard: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist
Vercel Live URL: https://balivisaassist.vercel.app
Custom Domain: https://balivisaassist.com (after DNS propagation)
```

---

## 🔧 Optional Enhancements (Later)

### Add Email Service (Resend)
```bash
# Get API key from https://resend.com
vercel env add RESEND_API_KEY production preview development
# Then redeploy
vercel --prod
```

### Add Analytics
```bash
# Google Analytics
vercel env add NEXT_PUBLIC_GA_ID production preview development
# Enter your GA4 Measurement ID

# Meta Pixel
vercel env add NEXT_PUBLIC_META_PIXEL_ID production preview development
# Enter your Pixel ID

# Redeploy
vercel --prod
```

---

## 🆘 Troubleshooting

### Admin login doesn't work
- Ensure you created the user in Supabase Auth
- Verify you ran the SQL to insert into admin_users table
- Check that email matches in both places

### Domain not working
- Check DNS propagation: https://dnschecker.org/#A/balivisaassist.com
- Wait 30 minutes after DNS changes
- Verify records are correct in Namecheap

### Database errors
- Check environment variables in Vercel
- Verify Supabase keys are correct
- Check Supabase project is active

---

## 📖 Documentation

- Full deployment guide: `VERCEL_DEPLOYMENT.md`
- Quick setup guide: `QUICK_SETUP.md`
- Admin portal guide: `ADMIN_QUICKSTART.md`

---

Your BaliVisaAssist application is ready to go live! 🎉

Complete the 5 manual steps above (about 10 minutes total) and you'll be fully operational at **https://balivisaassist.com**
