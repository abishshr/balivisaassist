#!/bin/bash

# BaliVisaAssist - Interactive Setup Script
# This script will help you configure Vercel and Supabase

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     BaliVisaAssist - Deployment Setup                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Supabase Setup
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 1: Supabase Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Please complete these steps in your browser:"
echo ""
echo -e "${GREEN}1.${NC} Open: https://supabase.com/dashboard/org/awswwazyzyshaafqefew"
echo -e "${GREEN}2.${NC} Click 'New Project'"
echo -e "${GREEN}3.${NC} Project Name: balivisaassist"
echo -e "${GREEN}4.${NC} Database Password: (create a strong password and save it!)"
echo -e "${GREEN}5.${NC} Region: Southeast Asia (Singapore)"
echo -e "${GREEN}6.${NC} Click 'Create new project' (wait 2-3 minutes)"
echo ""
read -p "Press Enter when your Supabase project is created..."

# Step 2: Database Migration
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 2: Run Database Migration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "In your Supabase project:"
echo ""
echo -e "${GREEN}1.${NC} Go to 'SQL Editor' (left sidebar)"
echo -e "${GREEN}2.${NC} Click 'New Query'"
echo -e "${GREEN}3.${NC} Copy the contents of: ${YELLOW}supabase-migration.sql${NC}"
echo -e "${GREEN}4.${NC} Paste into the editor and click 'Run'"
echo -e "${GREEN}5.${NC} Verify in 'Table Editor' - you should see 6 tables"
echo ""
read -p "Press Enter when migration is complete..."

# Step 3: Storage Bucket
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 3: Create Storage Bucket${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}1.${NC} Go to 'Storage' (left sidebar)"
echo -e "${GREEN}2.${NC} Click 'Create a new bucket'"
echo -e "${GREEN}3.${NC} Name: ${YELLOW}documents${NC}"
echo -e "${GREEN}4.${NC} Public: ${RED}NO${NC} (keep private)"
echo -e "${GREEN}5.${NC} Click bucket → Policies → Add these 3 policies:"
echo ""
echo "   Policy 1: Upload"
echo "   CREATE POLICY \"Authenticated users can upload\" ON storage.objects"
echo "   FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');"
echo ""
echo "   Policy 2: View"
echo "   CREATE POLICY \"Authenticated users can view\" ON storage.objects"
echo "   FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');"
echo ""
echo "   Policy 3: Delete"
echo "   CREATE POLICY \"Authenticated users can delete\" ON storage.objects"
echo "   FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');"
echo ""
read -p "Press Enter when storage is configured..."

# Step 4: Create Admin User
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 4: Create Admin User${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}1.${NC} Go to 'Authentication' → 'Users'"
echo -e "${GREEN}2.${NC} Click 'Add user' → 'Create new user'"
echo ""
read -p "Enter your admin email: " ADMIN_EMAIL
echo ""
echo -e "${GREEN}3.${NC} Create a password and ${YELLOW}check 'Auto Confirm User'${NC}"
echo -e "${GREEN}4.${NC} After creating, copy the User ID (UUID)"
echo ""
read -p "Paste the User ID here: " USER_UUID
echo ""
echo -e "${GREEN}5.${NC} Go to SQL Editor and run this query:"
echo ""
echo -e "${YELLOW}INSERT INTO admin_users (id, email, full_name, role)"
echo "VALUES ('${USER_UUID}', '${ADMIN_EMAIL}', 'Admin User', 'admin');${NC}"
echo ""
read -p "Press Enter when admin user is created..."

# Step 5: Get Supabase Credentials
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 5: Get Supabase Credentials${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Go to: Project Settings → API"
echo ""
read -p "Paste Project URL: " SUPABASE_URL
read -p "Paste anon/public key: " SUPABASE_ANON_KEY
read -p "Paste service_role key: " SUPABASE_SERVICE_KEY

# Step 6: WhatsApp Number
echo ""
read -p "Enter your WhatsApp number (with country code, e.g., +6281234567890): " WHATSAPP_NUMBER

# Step 7: Configure Vercel
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 6: Configuring Vercel...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Add environment variables to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development <<< "$SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development <<< "$SUPABASE_ANON_KEY"
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development <<< "$SUPABASE_SERVICE_KEY"
vercel env add NEXT_PUBLIC_SITE_URL production preview development <<< "https://balivisaassist.com"
vercel env add CONTACT_EMAIL production preview development <<< "info@balivisaassist.com"
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production preview development <<< "$WHATSAPP_NUMBER"

echo ""
echo -e "${GREEN}✓${NC} Environment variables added to Vercel!"
echo ""
echo -e "${YELLOW}Redeploying to apply environment variables...${NC}"
vercel --prod

echo ""
echo -e "${GREEN}✓${NC} Deployment complete!"

# Step 8: Domain Configuration
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 7: Domain Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Adding domains to Vercel..."
vercel domains add balivisaassist.com
vercel domains add www.balivisaassist.com

echo ""
echo -e "${YELLOW}Now configure DNS in Namecheap:${NC}"
echo ""
echo "1. Login to: https://www.namecheap.com/myaccount/login/"
echo "2. Go to Domain List → Manage balivisaassist.com"
echo "3. Advanced DNS tab"
echo "4. Add these records:"
echo ""
echo "   A Record:    @ → 76.76.19.61"
echo "   A Record:    @ → 76.223.126.88"
echo "   CNAME:       www → cname.vercel-dns.com"
echo ""
read -p "Press Enter when DNS is configured..."

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ SETUP COMPLETE!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Your app is now live at: ${GREEN}https://balivisaassist.com${NC}"
echo ""
echo "Test your setup:"
echo "  • Main site: https://balivisaassist.com"
echo "  • Admin portal: https://balivisaassist.com/admin/login"
echo "  • Admin email: $ADMIN_EMAIL"
echo ""
echo "DNS may take 5-30 minutes to propagate."
echo ""
echo -e "${YELLOW}Thank you for using BaliVisaAssist!${NC}"
echo ""
