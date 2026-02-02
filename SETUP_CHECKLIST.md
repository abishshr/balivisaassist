# BaliVisaAssist Admin Portal - Setup Checklist

Use this checklist to set up and verify your admin portal. Check off each item as you complete it.

## Pre-Setup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git repository up to date
- [ ] Dependencies installed (`npm install` was run automatically)

## Supabase Setup

### Create Project
- [ ] Signed up/logged in to [supabase.com](https://supabase.com)
- [ ] Created new project named "balivisaassist"
- [ ] Selected Singapore region
- [ ] Saved database password securely
- [ ] Project created successfully (wait ~2 minutes)

### Database Setup
- [ ] Opened SQL Editor in Supabase
- [ ] Created new query
- [ ] Copied all content from `supabase-migration.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" - saw "Success. No rows returned"
- [ ] Verified tables created (check Tables tab in dashboard)

### Storage Setup
- [ ] Went to Storage in Supabase
- [ ] Created new bucket named `documents`
- [ ] Kept bucket **private** (unchecked public)
- [ ] Bucket created successfully

### Storage Policies (Optional but Recommended)
- [ ] Clicked on `documents` bucket
- [ ] Went to Policies tab
- [ ] Added policy for authenticated uploads
- [ ] Added policy for authenticated reads
- [ ] Added policy for authenticated deletes

### Admin User Creation
- [ ] Went to Authentication → Users
- [ ] Clicked "Add user" → "Create new user"
- [ ] Entered admin email
- [ ] Created strong password
- [ ] Checked "Auto Confirm User"
- [ ] User created successfully
- [ ] Went back to SQL Editor
- [ ] Ran INSERT query to add user to `admin_users` table (with correct email)
- [ ] Query executed successfully

### Get API Keys
- [ ] Went to Settings → API
- [ ] Copied Project URL
- [ ] Copied `anon public` key
- [ ] Copied `service_role` key (keep secret!)
- [ ] Saved all three values securely

## Local Environment Setup

### Environment Variables
- [ ] Copied `.env.local.example` to `.env.local`
- [ ] Opened `.env.local` in editor
- [ ] Pasted Supabase URL
- [ ] Pasted `anon public` key
- [ ] Pasted `service_role` key
- [ ] Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- [ ] Kept existing Resend and WhatsApp values
- [ ] Saved file

### Start Development Server
- [ ] Ran `npm run dev` in terminal
- [ ] Server started successfully
- [ ] No errors in terminal
- [ ] Opened `http://localhost:3000` in browser

## Testing

### Login Test
- [ ] Navigated to `http://localhost:3000/admin/login`
- [ ] Entered admin email
- [ ] Entered admin password
- [ ] Clicked "Sign In"
- [ ] Redirected to dashboard
- [ ] No errors displayed

### Dashboard Test
- [ ] Dashboard loads without errors
- [ ] See "Total Applications: 0"
- [ ] See "This Month: 0"
- [ ] See "In Progress: 0"
- [ ] See "Revenue: IDR 0"
- [ ] Quick actions visible

### Create Customer Test
- [ ] Clicked "Customers" in sidebar
- [ ] Clicked "+ New Customer"
- [ ] Filled in test customer:
  - First Name: John
  - Last Name: Doe
  - WhatsApp: +62 812 3456 7890
  - Nationality: Australian
  - Email: john@example.com
- [ ] Clicked "Create Customer"
- [ ] Redirected to customer list
- [ ] Customer appears in list

### Create Application Test
- [ ] Clicked "Applications" in sidebar
- [ ] Clicked "+ New Application"
- [ ] Selected customer (John Doe)
- [ ] Selected service (C1 Visa)
- [ ] Price auto-filled (IDR 2,700,000)
- [ ] Set priority to Normal
- [ ] Clicked "Create Application"
- [ ] Redirected to applications list (or detail page)
- [ ] Application appears with number like `BVA-20260202-0001`

### Dashboard Verification
- [ ] Went back to Dashboard
- [ ] See "Total Applications: 1"
- [ ] See "This Month: 1"
- [ ] See "In Progress: 1"
- [ ] Application listed in "Recent Applications"
- [ ] Status shows as "New"

### Search & Filter Test
- [ ] Went to Applications page
- [ ] Typed customer name in search box
- [ ] Application appears in filtered results
- [ ] Selected status filter (e.g., "New")
- [ ] Application still appears
- [ ] Changed filter to "Completed"
- [ ] Application disappears (correct - it's "New" not "Completed")

### Logout Test
- [ ] Scrolled to bottom of sidebar
- [ ] Clicked "Sign Out"
- [ ] Redirected to login page
- [ ] Cannot access `/admin` without logging in

### Security Test
- [ ] Opened new incognito window
- [ ] Tried to access `http://localhost:3000/admin`
- [ ] Automatically redirected to login page (correct!)
- [ ] Cannot access without authentication

## Verification

### Data Integrity
- [ ] Logged into Supabase Dashboard
- [ ] Went to Database → Tables
- [ ] Checked `customers` table - see 1 row (John Doe)
- [ ] Checked `applications` table - see 1 row with auto-generated number
- [ ] Checked `activity_logs` table - see log entry (optional)

### API Endpoints
- [ ] Opened browser dev tools (F12)
- [ ] Went to Network tab
- [ ] Navigated to Dashboard
- [ ] Saw successful API call to `/api/stats`
- [ ] Response shows correct data

## Optional Tests

### Mobile Responsive
- [ ] Opened on mobile device or resized browser
- [ ] Sidebar collapses/adapts on mobile
- [ ] Forms work on mobile
- [ ] Table scrolls horizontally if needed

### Dark Mode
- [ ] Toggled OS dark mode (or browser dark mode)
- [ ] Admin portal switches to dark theme
- [ ] All text readable
- [ ] No visual glitches

### Multiple Customers
- [ ] Created 2-3 more test customers
- [ ] All appear in customer list
- [ ] Can create applications for each

### Application Numbers
- [ ] Created 3 more applications
- [ ] Application numbers increment correctly:
  - BVA-20260202-0001
  - BVA-20260202-0002
  - BVA-20260202-0003
  - (date changes daily)

## Troubleshooting

If any test fails, check:

- [ ] `.env.local` has correct Supabase credentials
- [ ] Supabase project is active (not paused)
- [ ] Database migration ran successfully
- [ ] Admin user exists in both Auth and `admin_users` table
- [ ] Browser console shows no errors (F12 → Console)
- [ ] Terminal shows no errors

Common fixes:
- Restart dev server (`Ctrl+C`, then `npm run dev`)
- Clear browser cache
- Check Supabase logs (Dashboard → Logs)
- Verify environment variables match Supabase dashboard

## Production Deployment (When Ready)

### Pre-Deployment
- [ ] All tests pass locally
- [ ] No console errors
- [ ] No TypeScript errors (`npm run build`)
- [ ] Environment variables documented

### Vercel Deployment
- [ ] Pushed code to GitHub
- [ ] Connected Vercel to repository
- [ ] Added environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SITE_URL` (production URL)
  - `RESEND_API_KEY`
  - `CONTACT_EMAIL`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] Deployed successfully
- [ ] Production site loads

### Post-Deployment
- [ ] Updated Supabase Auth URLs:
  - Settings → Authentication → URL Configuration
  - Added production URL to "Redirect URLs"
- [ ] Tested login on production
- [ ] Created test application on production
- [ ] Verified all features work

## Success!

If all checkboxes are checked, congratulations! 🎉 Your BaliVisaAssist Admin Portal is ready to use.

### Next Steps

1. **Create real customers** from your WhatsApp contacts
2. **Create real applications** for visa services
3. **Train your team** on how to use the portal
4. **Monitor usage** via Supabase dashboard
5. **Plan Phase 4** (application details & document upload)

### Getting Help

- **Setup issues**: See `ADMIN_PORTAL_SETUP.md`
- **Feature questions**: See `ADMIN_PORTAL_README.md`
- **Quick reference**: See `ADMIN_QUICKSTART.md`
- **Implementation details**: See `IMPLEMENTATION_SUMMARY.md`

---

**Setup Time**: ~15-20 minutes
**Status**: Production Ready ✅
**Cost**: $0/month (free tier)
