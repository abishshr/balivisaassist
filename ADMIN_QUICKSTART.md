# Admin Portal Quick Start Guide

Get your BaliVisaAssist Admin Portal up and running in 15 minutes.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] A Supabase account (sign up at [supabase.com](https://supabase.com) - it's free!)

## Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and log in
2. Click **"New Project"**
3. Fill in:
   - Name: `balivisaassist`
   - Database Password: Generate and **save this password**
   - Region: **Singapore** (closest to Bali)
4. Click **"Create new project"** and wait ~2 minutes

## Step 2: Set Up Database (3 minutes)

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase-migration.sql` from this project
4. Copy ALL the content and paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" ✅

## Step 3: Create Storage Bucket (1 minute)

1. Click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Enter name: `documents`
4. **Uncheck** "Public bucket" (keep it private)
5. Click **"Create bucket"**

## Step 4: Create Your Admin Account (2 minutes)

1. Click **"Authentication"** → **"Users"** in the left sidebar
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - Email: Your email (e.g., `admin@balivisaassist.com`)
   - Password: Create a strong password
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create user"**

5. Go back to **"SQL Editor"** and run this query (replace with your email):
```sql
INSERT INTO admin_users (email, full_name, role)
VALUES ('admin@balivisaassist.com', 'Admin User', 'admin');
```

## Step 5: Get API Keys (2 minutes)

1. Click **"Settings"** → **"API"** in the left sidebar
2. Copy these three values:

**Project URL**:
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public key** (starts with `eyJhbG...`):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**service_role key** (starts with `eyJhbG...`, keep this SECRET):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Configure Local Environment (2 minutes)

1. Copy the example env file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in your editor and add your Supabase credentials:

```env
# Supabase (Admin Portal)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL (for API calls)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Keep your existing values for these:
RESEND_API_KEY=your_existing_resend_key
CONTACT_EMAIL=info@balivisaassist.com
NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
```

3. Save the file

## Step 7: Start the App (1 minute)

```bash
npm run dev
```

Wait for the server to start, then open your browser.

## Step 8: Log In and Test (1 minute)

1. Open: `http://localhost:3000/admin/login`
2. Log in with the credentials you created in Step 4
3. You should see the dashboard! 🎉

## Quick Test: Create Your First Application

### 1. Create a Test Customer

1. Click **"Customers"** in the sidebar
2. Click **"+ New Customer"**
3. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - WhatsApp: `+62 812 3456 7890`
   - Nationality: `Australian`
   - Email: `john@example.com`
4. Click **"Create Customer"**

### 2. Create a Test Application

1. Click **"Applications"** in the sidebar
2. Click **"+ New Application"**
3. Fill in:
   - Customer: Select `John Doe`
   - Service: `C1 Visa (Single Entry Business Visa)` (price auto-fills to IDR 2,700,000)
   - Priority: `Normal`
4. Click **"Create Application"**
5. Note the auto-generated application number (e.g., `BVA-20260202-0001`) ✅

### 3. Check the Dashboard

1. Click **"Dashboard"** in the sidebar
2. You should see:
   - Total Applications: 1
   - Recent application listed
   - Status breakdown showing "New: 1"

**🎉 Success! Your admin portal is working!**

## What's Next?

Now that your admin portal is running, you can:

1. **Create more customers** from your WhatsApp contacts
2. **Create applications** for each customer
3. **Customize services and pricing** as needed
4. **Deploy to production** when ready (see deployment guide)

## Troubleshooting

### Issue: Can't log in

**Solution**:
- Make sure you created the user in Supabase Auth (Step 4)
- Make sure you ran the INSERT query to add the user to `admin_users` table
- Check that the email matches exactly

### Issue: Dashboard shows "Unable to load statistics"

**Solution**:
- Check that `.env.local` has the correct Supabase credentials
- Verify `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Issue: Application number not generating

**Solution**:
- Go to Supabase → SQL Editor
- Run: `SELECT * FROM pg_trigger WHERE tgname = 'set_application_number';`
- If empty, re-run the `supabase-migration.sql` script

### Still having issues?

1. Check Supabase logs: Supabase Dashboard → **Logs**
2. Check browser console for errors (F12 → Console tab)
3. Check terminal for Next.js errors

## Need More Details?

- **Full setup guide**: See `ADMIN_PORTAL_SETUP.md`
- **Feature documentation**: See `ADMIN_PORTAL_README.md`
- **Database schema**: See `supabase-migration.sql`

## Production Deployment

Once you've tested locally and are ready to deploy:

1. Push your code to GitHub
2. Deploy to Vercel (free):
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add the same environment variables from `.env.local`
   - Change `NEXT_PUBLIC_SITE_URL` to your production URL
3. Update Supabase Auth URLs:
   - Go to Supabase → Authentication → URL Configuration
   - Add your production URL to allowed redirect URLs

---

**Time to complete**: ~15 minutes
**Cost**: $0/month (free tier)
**Status**: Ready to use for production! 🚀
