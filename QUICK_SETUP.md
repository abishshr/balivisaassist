# Quick Setup Guide - BaliVisaAssist

## ✅ Completed
- [x] GitHub repository created: https://github.com/abishshr/balivisaassist
- [x] Code pushed to GitHub
- [x] Deployed to Vercel: https://balivisaassist.vercel.app

## 🚀 Next Steps (Do in Order)

### Step 1: Setup Supabase (15 minutes)

1. **Create Supabase Project**
   - Visit: https://supabase.com/dashboard/org/awswwazyzyshaafqefew
   - Click "New Project"
   - Name: `balivisaassist`
   - Password: Create & save securely
   - Region: Singapore (closest to Bali)
   - Wait 2-3 minutes for project creation

2. **Run Database Migration**
   - Open your Supabase project
   - Go to **SQL Editor** (left sidebar)
   - Click "New Query"
   - Open file: `supabase-migration.sql` (in your project)
   - Copy ALL contents and paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - ✅ Check: Go to **Table Editor** - you should see 6 tables

3. **Create Storage Bucket**
   - Go to **Storage** (left sidebar)
   - Click "Create a new bucket"
   - Name: `documents`
   - Public: **NO** (keep private)
   - Click "Create bucket"

4. **Add Storage Policies**
   - Click on "documents" bucket
   - Go to **Policies** tab
   - Click "New Policy" → "For full customization"
   - Copy/paste these 3 policies one by one:

   ```sql
   -- Policy 1: Upload
   CREATE POLICY "Authenticated users can upload" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

   -- Policy 2: View
   CREATE POLICY "Authenticated users can view" ON storage.objects
   FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

   -- Policy 3: Delete
   CREATE POLICY "Authenticated users can delete" ON storage.objects
   FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
   ```

5. **Create Admin User**
   - Go to **Authentication** → **Users**
   - Click "Add user" → "Create new user"
   - Email: `your-email@example.com` (use your real email!)
   - Password: Create secure password
   - ✅ Check "Auto Confirm User"
   - Click "Create user"
   - **IMPORTANT**: Copy the User ID (long UUID string)

6. **Link Admin User to Database**
   - Go back to **SQL Editor**
   - Run this query (replace the values):
   ```sql
   INSERT INTO admin_users (id, email, full_name, role)
   VALUES (
     'PASTE_YOUR_USER_UUID_HERE',
     'your-email@example.com',
     'Your Full Name',
     'admin'
   );
   ```

7. **Get Supabase Credentials**
   - Go to **Project Settings** → **API**
   - Copy these 3 values (save them for Step 2):
     - ✏️ Project URL: `https://xxxxx.supabase.co`
     - ✏️ anon public key: (long string under "Project API keys")
     - ✏️ service_role key: (long string - keep secret!)

---

### Step 2: Add Environment Variables to Vercel (5 minutes)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist/settings/environment-variables

2. **Add These Variables One by One**
   Click "Add" for each:

   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: [Paste your Supabase Project URL from Step 1]
   Environment: Production, Preview, Development
   ```

   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [Paste your Supabase anon key from Step 1]
   Environment: Production, Preview, Development
   ```

   ```
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: [Paste your Supabase service_role key from Step 1]
   Environment: Production, Preview, Development
   ```

   ```
   Key: NEXT_PUBLIC_SITE_URL
   Value: https://balivisaassist.com
   Environment: Production, Preview, Development
   ```

   ```
   Key: CONTACT_EMAIL
   Value: info@balivisaassist.com
   Environment: Production, Preview, Development
   ```

   ```
   Key: NEXT_PUBLIC_WHATSAPP_NUMBER
   Value: +6281234567890  [Replace with your actual WhatsApp number]
   Environment: Production, Preview, Development
   ```

3. **Redeploy**
   - After adding all variables, go to: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist
   - Click "Redeploy" button (or go to Deployments → click "..." → "Redeploy")
   - Wait 1-2 minutes for deployment to complete

---

### Step 3: Add Custom Domain (5 minutes)

1. **Add Domain in Vercel**
   - Go to: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist/settings/domains
   - Click "Add"
   - Type: `balivisaassist.com`
   - Click "Add"
   - Repeat for: `www.balivisaassist.com`

2. **Update DNS in Namecheap**
   - Login: https://www.namecheap.com/myaccount/login/
   - Go to **Domain List**
   - Click "Manage" on balivisaassist.com
   - Go to **Advanced DNS** tab
   - Delete any existing A/CNAME records for @ and www
   - Add these new records:

   **A Records** (for apex domain):
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A Record | @ | 76.76.19.61 | Automatic |
   | A Record | @ | 76.223.126.88 | Automatic |

   **CNAME Record** (for www):
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | CNAME | www | cname.vercel-dns.com | Automatic |

   - Click "Save all changes"

3. **Wait for DNS Propagation**
   - Usually takes 5-30 minutes (can be up to 24-48 hours)
   - Check status: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist/settings/domains
   - Or check DNS: https://dnschecker.org/#A/balivisaassist.com

---

### Step 4: Test Everything (5 minutes)

1. **Test Admin Portal**
   - Visit: https://balivisaassist.com/admin/login
   - Login with your admin email/password from Step 1
   - ✅ Dashboard should load
   - ✅ Try creating a test customer
   - ✅ Try creating a test application

2. **Test Main Website**
   - Visit: https://balivisaassist.com
   - ✅ Homepage loads
   - ✅ All navigation links work
   - ✅ WhatsApp button works
   - ✅ Images display correctly

3. **Check SSL**
   - Your site should have HTTPS automatically
   - Look for padlock icon in browser
   - ✅ No security warnings

---

## 🎉 You're Done!

Your app is now live at: **https://balivisaassist.com**

---

## 📞 Support & Resources

- **Vercel Dashboard**: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist
- **Supabase Dashboard**: https://supabase.com/dashboard/org/awswwazyzyshaafqefew
- **GitHub Repo**: https://github.com/abishshr/balivisaassist

**Detailed Guides:**
- Full deployment guide: See `VERCEL_DEPLOYMENT.md`
- Admin portal guide: See `ADMIN_QUICKSTART.md`

---

## Optional: Add Analytics & Email (Later)

### Google Analytics
1. Create GA4 property: https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to Vercel env vars: `NEXT_PUBLIC_GA_ID`

### Meta Pixel
1. Create Meta Pixel: https://business.facebook.com
2. Get Pixel ID
3. Add to Vercel env vars: `NEXT_PUBLIC_META_PIXEL_ID`

### Email Service (Resend)
1. Sign up: https://resend.com
2. Get API key
3. Add to Vercel env vars: `RESEND_API_KEY`

After adding any new env vars, always click "Redeploy" in Vercel!

---

## Troubleshooting

**Admin login doesn't work**
- Check if you added the user to `admin_users` table in Step 1.6
- Verify email matches exactly in both Supabase Auth and admin_users table

**Domain not working**
- Wait 30 minutes for DNS propagation
- Check DNS settings in Namecheap match exactly
- Verify domain ownership in Vercel

**Blank pages or errors**
- Check environment variables are set in Vercel
- Check Vercel deployment logs for errors
- Verify Supabase project is running
