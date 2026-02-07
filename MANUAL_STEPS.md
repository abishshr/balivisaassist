# Manual Setup Steps for BaliVisaAssist

Since browser automation requires your login credentials, here are the exact steps you need to complete manually. I've prepared everything else for you.

## ✅ Already Done
- [x] GitHub repo created and code pushed
- [x] Deployed to Vercel: https://balivisaassist.vercel.app
- [x] Interactive setup script created

## 🔧 Option 1: Run the Interactive Setup Script (RECOMMENDED)

I've created an interactive script that will guide you through everything:

```bash
cd /Users/abish/Developer/balivisaassist
./setup.sh
```

This script will:
- Guide you through Supabase setup with clear instructions
- Automatically configure Vercel environment variables
- Add domains to Vercel
- Give you exact DNS settings for Namecheap

---

## 🔧 Option 2: Manual Setup (Step by Step)

If you prefer to do it manually, follow these steps:

### 1. Create Supabase Project (5 min)

1. Open: https://supabase.com/dashboard/org/awswwazyzyshaafqefew
2. Click "New Project"
3. Settings:
   - Name: `balivisaassist`
   - Password: (create strong password and SAVE IT!)
   - Region: `Southeast Asia (Singapore)`
4. Click "Create new project" (wait 2-3 minutes)

### 2. Run Database Migration (2 min)

1. In your new project, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open file: `/Users/abish/Developer/balivisaassist/supabase-migration.sql`
4. Copy ALL content and paste into SQL Editor
5. Click "Run" (or Cmd+Enter)
6. ✅ Verify: Go to "Table Editor" - should see 6 tables

### 3. Create Storage Bucket (3 min)

1. Click "Storage" (left sidebar)
2. Click "Create a new bucket"
3. Name: `documents`
4. Public: **NO** (uncheck)
5. Click "Create bucket"

6. Click on "documents" bucket
7. Go to "Policies" tab
8. Click "New Policy" → "For full customization"
9. Add these 3 policies (one at a time):

**Policy 1:**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

**Policy 2:**
```sql
CREATE POLICY "Authenticated users can view" ON storage.objects
FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

**Policy 3:**
```sql
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

### 4. Create Admin User (3 min)

1. Click "Authentication" → "Users"
2. Click "Add user" → "Create new user"
3. Enter your email (e.g., `admin@balivisaassist.com`)
4. Create password
5. ✅ CHECK "Auto Confirm User"
6. Click "Create user"
7. **Copy the User ID** (long UUID string)

8. Go to "SQL Editor" → "New Query"
9. Run this (replace with your values):
```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID_HERE',
  'your-email@example.com',
  'Your Full Name',
  'admin'
);
```

### 5. Get Supabase Credentials (1 min)

1. Click "Project Settings" (bottom left)
2. Click "API"
3. Copy these 3 values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: (under "Project API keys")
   - **service_role**: (under "Project API keys" - click "Reveal" if hidden)

### 6. Add to Vercel (5 min)

Run these commands in terminal (replace with your actual values):

```bash
cd /Users/abish/Developer/balivisaassist

# Add Supabase credentials
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://xxxxx.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: your anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: your service role key

# Add site configuration
vercel env add NEXT_PUBLIC_SITE_URL
# Enter: https://balivisaassist.com

vercel env add CONTACT_EMAIL
# Enter: info@balivisaassist.com

vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
# Enter: +6281234567890 (your actual number)

# Redeploy with new env vars
vercel --prod
```

### 7. Configure Domain (5 min)

**In Terminal:**
```bash
vercel domains add balivisaassist.com
vercel domains add www.balivisaassist.com
```

**In Namecheap:**
1. Login: https://www.namecheap.com/myaccount/login/
2. Go to "Domain List"
3. Click "Manage" on balivisaassist.com
4. Click "Advanced DNS" tab
5. Delete any existing A/CNAME records for @ and www
6. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.19.61 | Automatic |
| A Record | @ | 76.223.126.88 | Automatic |
| CNAME | www | cname.vercel-dns.com | Automatic |

7. Click "Save all changes"
8. Wait 5-30 minutes for DNS to propagate

### 8. Test Everything

1. Visit: https://balivisaassist.com/admin/login
2. Login with your admin credentials
3. ✅ Dashboard should load
4. ✅ Try creating a test customer
5. ✅ Check main site: https://balivisaassist.com

---

## 🎉 Done!

Your app will be live at: **https://balivisaassist.com**

DNS may take up to 30 minutes to propagate globally.

---

## Need Help?

- Vercel Dashboard: https://vercel.com/abishs-projects-8a2c5dd7/balivisaassist
- Supabase Dashboard: https://supabase.com/dashboard/org/awswwazyzyshaafqefew
- GitHub Repo: https://github.com/abishshr/balivisaassist
