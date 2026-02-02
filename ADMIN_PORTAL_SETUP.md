# BaliVisaAssist Admin Portal Setup Guide

This guide will walk you through setting up the admin portal for BaliVisaAssist.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works perfectly)
- Basic understanding of environment variables

## Phase 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization (or create one)
4. Enter project details:
   - **Name**: `balivisaassist` (or any name you prefer)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to Bali (Singapore recommended)
5. Click "Create new project" (takes ~2 minutes)

### Step 2: Get API Keys

1. Once project is created, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbG...`)
   - **service_role** key (starts with `eyJhbG...`) - keep this secret!

### Step 3: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-migration.sql` from this project
4. Paste it into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is normal!

### Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click "New bucket"
3. Enter:
   - **Name**: `documents`
   - **Public bucket**: Uncheck (keep private)
4. Click "Create bucket"

### Step 5: Configure Storage Policies

1. Click on the `documents` bucket
2. Go to "Policies" tab
3. Click "New Policy"
4. Choose "For full customization"
5. Add these three policies:

**Policy 1: Allow authenticated uploads**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');
```

**Policy 2: Allow authenticated reads**
```sql
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');
```

**Policy 3: Allow authenticated deletes**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');
```

### Step 6: Create First Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: Your admin email (e.g., `admin@balivisaassist.com`)
   - **Password**: Create a strong password
   - **Auto Confirm User**: Check this box
4. Click "Create user"

5. Now go to **SQL Editor** and run:
```sql
INSERT INTO admin_users (email, full_name, role)
VALUES ('admin@balivisaassist.com', 'Admin User', 'admin');
```
(Replace the email with your actual admin email)

## Phase 2: Local Development Setup

### Step 1: Install Dependencies

Already done! But if needed:
```bash
npm install
```

### Step 2: Configure Environment Variables

1. Create `.env.local` file in project root:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
# Supabase (Admin Portal)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL (for API calls)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Keep your existing vars
RESEND_API_KEY=your_existing_key
CONTACT_EMAIL=info@balivisaassist.com
NEXT_PUBLIC_WHATSAPP_NUMBER=your_number
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Test the Admin Portal

1. Open your browser to: `http://localhost:3000/admin/login`
2. Log in with the admin credentials you created
3. You should see the dashboard!

## Phase 3: Testing the System

### Create a Test Customer

1. Click "Customers" in the sidebar
2. Click "New Customer"
3. Fill in test data:
   - First Name: `John`
   - Last Name: `Doe`
   - WhatsApp: `+62 812 3456 7890`
   - Nationality: `Australian`
   - Email: `john@example.com`
4. Click "Create Customer"

### Create a Test Application

1. Click "Applications" in the sidebar
2. Click "New Application"
3. Select the customer you just created
4. Choose a service (e.g., "B211A Single Entry Visa")
5. Enter a price (e.g., `1500000`)
6. Click "Create Application"
7. Note the auto-generated application number (e.g., `BVA-20260202-0001`)

### Verify Dashboard

1. Go back to the Dashboard
2. You should see:
   - Total Applications: 1
   - Recent application listed
   - Status breakdown showing "New: 1"

## Troubleshooting

### Issue: "Failed to fetch applications"

**Solution**: Check that:
- Supabase URL and keys are correct in `.env.local`
- Database tables were created successfully
- RLS policies are enabled

### Issue: "Unauthorized" when logging in

**Solution**:
- Verify the user exists in Supabase Auth dashboard
- Make sure you ran the INSERT query to add the user to `admin_users` table
- Check that the email matches exactly

### Issue: "Storage bucket not found"

**Solution**:
- Go to Supabase Storage and create the `documents` bucket
- Make sure it's set to private
- Add the storage policies

### Issue: Application number not generating

**Solution**:
- Check that the trigger was created successfully
- Run this in SQL Editor:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'set_application_number';
```
- If empty, re-run the migration SQL

## Next Steps

Once the basic setup is working, you can:

1. **Add More Admin Users**: Create additional team members in Supabase Auth, then add them to `admin_users` table
2. **Customize Services**: Update the services list in your application form
3. **Set Up Email**: Configure Resend API for email notifications
4. **Deploy to Production**: Deploy to Vercel with production Supabase credentials

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - Use the same `.env.local` variables
   - Update `NEXT_PUBLIC_SITE_URL` to your production URL

### Update Supabase URLs

1. In Vercel, go to Settings → Domains
2. Copy your production URL (e.g., `https://balivisaassist.vercel.app`)
3. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
4. Add your production URL to:
   - Site URL
   - Redirect URLs

## Security Checklist

- [ ] Never commit `.env.local` to git (it's in `.gitignore`)
- [ ] Use strong passwords for admin accounts
- [ ] Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-only)
- [ ] Enable MFA for admin accounts (in Supabase settings)
- [ ] Regularly backup your database (Supabase has daily backups on paid plans)

## Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Check Next.js dev server logs
4. Verify all environment variables are set correctly

## Features Implemented

✅ Admin authentication & login
✅ Dashboard with statistics
✅ Application management (list, create)
✅ Customer management (list, create)
✅ Auto-generated application numbers
✅ Status tracking
✅ Row-level security
✅ Activity logging
✅ Responsive design

## Features To Implement Next

- Document upload functionality
- Payment tracking
- Application detail view
- Customer detail view
- Email notifications
- Advanced filtering & search
- Export to CSV
- Customer portal (for customers to track their own applications)

## Cost Breakdown

**Free Tier (Current)**:
- Supabase: $0/month (500MB DB, 1GB storage, 50K users)
- Vercel: $0/month (Hobby plan)
- Resend: $0/month (100 emails/day)
- **Total: $0/month**

**When You Need to Scale**:
- Supabase Pro: $25/month (8GB DB, 100GB storage)
- Resend: $20/month (50K emails)
- **Total: ~$45/month** (handles thousands of applications)

---

**You're all set!** The admin portal is ready to use. Start by creating customers and applications to test the workflow.
