# Vercel Deployment Guide for BaliVisaAssist

## Step 1: Setup Supabase

### 1.1 Create a new Supabase project
1. Go to https://supabase.com/dashboard/org/awswwazyzyshaafqefew
2. Click "New Project"
3. Project settings:
   - **Name**: balivisaassist
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to Bali (Singapore recommended)
4. Click "Create new project" (wait 2-3 minutes)

### 1.2 Run the database migration
1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-migration.sql` file
4. Paste and click "Run"
5. Verify tables were created: Go to **Table Editor** and check for these tables:
   - admin_users
   - customers
   - applications
   - documents
   - payments
   - activity_logs

### 1.3 Create Storage Bucket for Documents
1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Settings:
   - **Name**: documents
   - **Public bucket**: NO (keep it private)
4. Click "Create bucket"

### 1.4 Add Storage Policies
1. Click on the "documents" bucket
2. Go to **Policies** tab
3. Add these policies by clicking "New Policy" → "Create a policy from scratch":

**Policy 1: Upload documents**
```sql
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

**Policy 2: View documents**
```sql
CREATE POLICY "Authenticated users can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

**Policy 3: Delete documents**
```sql
CREATE POLICY "Authenticated users can delete documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

### 1.5 Create your first admin user
1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - **Email**: your admin email (e.g., admin@balivisaassist.com)
   - **Password**: Create a secure password
   - **Auto Confirm User**: YES
4. Click "Create user"
5. Copy the User ID (UUID)

6. Go back to **SQL Editor** and run:
```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES ('PASTE_USER_UUID_HERE', 'admin@balivisaassist.com', 'Admin User', 'admin');
```

### 1.6 Get your Supabase credentials
1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Under "Project API keys" → "anon public"
   - **service_role key**: Under "Project API keys" → "service_role" (keep this secret!)

---

## Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy the project
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Choose your account
- **Link to existing project**: No
- **Project name**: balivisaassist
- **Directory**: ./ (current directory)
- **Override settings**: No

### 2.4 Add Environment Variables in Vercel
1. Go to https://vercel.com/dashboard
2. Select your "balivisaassist" project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (one by one):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=https://balivisaassist.com
CONTACT_EMAIL=info@balivisaassist.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+6281234567890
```

Optional (add these later):
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=xxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

5. After adding all variables, click **Redeploy** to apply them

---

## Step 3: Configure Domain (balivisaassist.com)

### 3.1 Add Domain in Vercel
1. In your Vercel project, go to **Settings** → **Domains**
2. Click "Add"
3. Enter: `balivisaassist.com`
4. Click "Add"
5. Also add: `www.balivisaassist.com`
6. Set `balivisaassist.com` as the primary domain

### 3.2 Update DNS in Namecheap
1. Login to Namecheap: https://www.namecheap.com/myaccount/login/
2. Go to **Domain List**
3. Click **Manage** next to balivisaassist.com
4. Go to **Advanced DNS** tab
5. Remove any existing A/CNAME records
6. Add these DNS records:

**For apex domain (balivisaassist.com):**
| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.19.61 | Automatic |
| A Record | @ | 76.223.126.88 | Automatic |

**For www subdomain:**
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | Automatic |

7. Click "Save all changes"

### 3.3 Verify Domain
- DNS propagation can take 24-48 hours (usually faster, ~15 minutes)
- Check status in Vercel **Settings** → **Domains**
- Once verified, you'll see a green checkmark
- Test your site: https://balivisaassist.com

---

## Step 4: Final Checks

### 4.1 Test Admin Portal
1. Visit: https://balivisaassist.com/admin/login
2. Login with your admin credentials
3. Verify:
   - Dashboard loads correctly
   - Can create customers
   - Can create applications
   - Stats display properly

### 4.2 Test Main Website
1. Visit: https://balivisaassist.com
2. Check:
   - Homepage loads
   - Images display correctly
   - WhatsApp button works
   - All pages load (Services, FAQ, About, Contact)

### 4.3 Enable SSL
- Vercel automatically provisions SSL certificates
- Verify HTTPS works: https://balivisaassist.com
- Should see padlock icon in browser

---

## Troubleshooting

### Domain not working
- Check DNS propagation: https://dnschecker.org
- Verify DNS records are correct in Namecheap
- Wait 15-30 minutes and try again

### Admin portal shows errors
- Check environment variables in Vercel
- Verify Supabase credentials are correct
- Check browser console for error messages

### Database connection issues
- Verify Supabase project is running
- Check if service role key is correct
- Ensure RLS policies are properly set

---

## Next Steps

1. **Setup Email Service (Optional)**
   - Get Resend API key: https://resend.com
   - Add `RESEND_API_KEY` to Vercel environment variables

2. **Setup Analytics (Optional)**
   - Google Analytics: Get GA4 ID and add `NEXT_PUBLIC_GA_ID`
   - Meta Pixel: Get Pixel ID and add `NEXT_PUBLIC_META_PIXEL_ID`

3. **Add More Admin Users**
   - Create users in Supabase Auth
   - Add them to `admin_users` table with SQL

4. **Backup Database**
   - Setup automated backups in Supabase
   - Go to **Project Settings** → **Backups**

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

Your app is now live at: **https://balivisaassist.com** 🎉
