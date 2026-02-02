# BaliVisaAssist Admin Portal

## Overview

The BaliVisaAssist Admin Portal is a full-featured employee management system for tracking visa applications, customers, documents, and payments. Built with Next.js 16, React 19, TypeScript, and Supabase.

## What Was Implemented

### Phase 1: Core Infrastructure ✅

**Supabase Integration**
- Created Supabase client libraries for browser and server
- Set up middleware for authentication
- Configured Row-Level Security (RLS) policies
- Type-safe database schema with TypeScript

**Database Schema**
- `admin_users` - Employee accounts
- `customers` - Customer profiles
- `applications` - Visa applications with auto-generated numbers
- `documents` - File upload tracking
- `payments` - Payment tracking and verification
- `activity_logs` - Audit trail for all actions

**Authentication**
- Email/password login for admin users
- Protected routes with middleware
- Session management with Supabase Auth
- Automatic redirect for unauthorized access

### Phase 2: Admin UI ✅

**Layout & Navigation**
- Responsive sidebar navigation
- Dark mode support (inherited from main site)
- Mobile-friendly design
- Clean, professional interface

**Dashboard** (`/admin`)
- Total applications count
- This month's applications
- In-progress applications count
- Monthly revenue (verified payments)
- Status breakdown (visual cards)
- Recent applications list
- Quick action buttons

**Applications Management** (`/admin/applications`)
- List all applications in a sortable table
- Search by application #, customer name, or service
- Filter by status
- Status badges with color coding
- Application number format: `BVA-YYYYMMDD-####`
- Create new applications
- Link to application details

**Customer Management** (`/admin/customers`)
- List all customers
- Create new customer profiles
- Store customer information:
  - Name, email, WhatsApp number
  - Nationality, date of birth
  - Passport number and expiry
  - Notes
- Link customers to applications

**Settings** (`/admin/settings`)
- Placeholder page for future features

### Phase 3: API Routes ✅

**Statistics API** (`/api/stats`)
- GET - Dashboard statistics
- Returns: total applications, status breakdown, monthly stats, recent applications

**Applications API** (`/api/applications`)
- GET - List all applications with customer data
- POST - Create new application
- Automatically generates application numbers
- Logs activity to audit trail

**Customers API** (`/api/customers`)
- GET - List all customers
- POST - Create new customer
- Validates required fields

### Features Implemented

✅ **Admin Authentication**
- Secure login page
- Session-based authentication
- Protected admin routes
- Logout functionality

✅ **Dashboard Analytics**
- Real-time statistics
- Status breakdown visualization
- Recent activity feed
- Quick action shortcuts

✅ **Application Management**
- Create applications from customer + service
- Auto-generated application numbers
- Status tracking (8 states)
- Priority levels (low, normal, high, urgent)
- Service selection from existing data
- Quoted price with auto-fill

✅ **Customer Management**
- Full CRUD for customer profiles
- WhatsApp integration ready
- Passport information tracking
- Source tracking (WhatsApp, email, etc.)

✅ **Search & Filter**
- Full-text search on applications
- Filter by status
- Sort by date, priority, etc.

✅ **Responsive Design**
- Mobile-optimized
- Tablet-friendly
- Desktop full-featured

✅ **Type Safety**
- Full TypeScript coverage
- Type-safe database queries
- Validated API responses

## File Structure

```
/app/
  /admin/
    layout.tsx                  # Admin layout with sidebar
    page.tsx                    # Dashboard
    /login/
      page.tsx                  # Login page
    /applications/
      page.tsx                  # Applications list
      /new/
        page.tsx                # Create application
    /customers/
      page.tsx                  # Customers list
      /new/
        page.tsx                # Create customer
    /settings/
      page.tsx                  # Settings (placeholder)

  /api/
    /stats/
      route.ts                  # Dashboard statistics
    /applications/
      route.ts                  # Applications CRUD
    /customers/
      route.ts                  # Customers CRUD

/components/
  /admin/
    Sidebar.tsx                 # Navigation sidebar
    ApplicationsTable.tsx       # Applications data table
    ApplicationForm.tsx         # Create/edit application form
    CustomerForm.tsx            # Create/edit customer form
    StatusBadge.tsx             # Status indicator component
    StatsCard.tsx               # Dashboard stat card

/lib/
  /supabase/
    client.ts                   # Browser Supabase client
    server.ts                   # Server Supabase client
    middleware.ts               # Auth middleware

/types/
  supabase.ts                   # Database schema types
  admin.ts                      # Admin user types
  customer.ts                   # Customer types
  application.ts                # Application types

middleware.ts                   # Route protection
supabase-migration.sql          # Database setup script
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (configured, not yet used)
- **Email**: Resend (configured, not yet used)

## Environment Variables

Required in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Existing vars (keep these)
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL=info@balivisaassist.com
NEXT_PUBLIC_WHATSAPP_NUMBER=your_number
```

## Setup Instructions

See `ADMIN_PORTAL_SETUP.md` for detailed setup instructions.

Quick start:
1. Create Supabase project
2. Run `supabase-migration.sql` in Supabase SQL Editor
3. Create storage bucket named `documents`
4. Create first admin user in Supabase Auth
5. Add admin user to `admin_users` table
6. Copy `.env.local.example` to `.env.local` and fill in Supabase credentials
7. Run `npm install` (already done)
8. Run `npm run dev`
9. Visit `http://localhost:3000/admin/login`

## Application Workflow

### Typical Usage Flow

1. **Customer contacts via WhatsApp**
2. **Admin logs into portal** → `/admin/login`
3. **Creates customer profile** → `/admin/customers/new`
   - Name, WhatsApp, nationality, etc.
4. **Creates application** → `/admin/applications/new`
   - Select customer
   - Select service (C1 Visa, KITAS, etc.)
   - Set price, priority, start date
   - Auto-generates application number (e.g., `BVA-20260202-0001`)
5. **Future: Upload documents** (not yet implemented)
6. **Future: Track payments** (not yet implemented)
7. **Update status as application progresses**
8. **Customer receives email notifications** (not yet implemented)

## Application Status Flow

```
new
  → documents_pending
    → documents_received
      → under_review
        → submitted_to_immigration
          → approved
            → completed

(cancelled) - can be set at any time
```

## What's NOT Implemented Yet (Future Phases)

### Phase 4: Application Details (Next Priority)
- [ ] View individual application details
- [ ] Edit application
- [ ] Update status with dropdown
- [ ] View linked customer info
- [ ] Activity timeline for application

### Phase 5: Document Upload
- [ ] Upload passport scans
- [ ] Upload passport photos
- [ ] Upload flight tickets
- [ ] Upload proof of accommodation
- [ ] Upload proof of payment
- [ ] Document categorization
- [ ] File preview
- [ ] Delete documents

### Phase 6: Payment Tracking
- [ ] Record payments
- [ ] Upload proof of payment
- [ ] Multiple payment methods (QRIS, Cash, Bank Transfer)
- [ ] Payment status workflow
- [ ] Calculate payment balance
- [ ] Payment history

### Phase 7: Activity Logs
- [ ] Auto-log all actions
- [ ] Display activity timeline
- [ ] User attribution

### Phase 8: Email Notifications
- [ ] Application created confirmation
- [ ] Status update emails
- [ ] Document received confirmation
- [ ] Payment received confirmation

### Phase 9: Advanced Features
- [ ] Export to CSV
- [ ] Advanced filtering (date range, service type, etc.)
- [ ] Bulk actions
- [ ] Assign applications to agents
- [ ] User management (create/edit admin users)
- [ ] Email template customization
- [ ] Reports and analytics
- [ ] Customer portal (customers can track their applications)

## Database Schema

### admin_users
- id (UUID, PK)
- email (unique)
- full_name
- role (admin/agent)
- is_active
- last_login_at
- created_at, updated_at

### customers
- id (UUID, PK)
- first_name, last_name
- email
- whatsapp_number
- nationality
- date_of_birth
- passport_number, passport_expiry
- source (whatsapp/email/etc)
- notes
- created_at, updated_at

### applications
- id (UUID, PK)
- application_number (auto-generated, unique)
- customer_id (FK → customers)
- service_id, service_name
- status (8 states)
- priority (4 levels)
- quoted_price
- desired_start_date
- assigned_to (FK → admin_users)
- created_by (FK → admin_users)
- created_at, updated_at, completed_at

### documents
- id (UUID, PK)
- application_id (FK → applications)
- type (passport/photo/ticket/etc)
- file_name, file_path, file_size, mime_type
- status (received/verified/rejected)
- uploaded_by (FK → admin_users)
- notes
- created_at

### payments
- id (UUID, PK)
- application_id (FK → applications)
- amount
- payment_method (qris/cash/bank_transfer)
- payment_status (pending/received/verified/refunded)
- payment_date
- reference_number
- proof_of_payment_path
- notes
- recorded_by (FK → admin_users)
- created_at, updated_at

### activity_logs
- id (UUID, PK)
- application_id (FK → applications)
- user_id (FK → admin_users)
- action
- description
- metadata (JSONB)
- created_at

## API Endpoints

### GET /api/stats
Returns dashboard statistics
- totalApplications
- statusBreakdown
- thisMonthApplications
- thisMonthRevenue
- recentApplications (last 5)

### GET /api/applications
Returns all applications with customer data
- Sorted by created_at DESC

### POST /api/applications
Create new application
- Requires: customer_id, service_id, service_name, quoted_price
- Optional: status, priority, desired_start_date
- Auto-generates application_number
- Logs activity

### GET /api/customers
Returns all customers
- Sorted by created_at DESC

### POST /api/customers
Create new customer
- Requires: first_name, last_name, whatsapp_number, nationality
- Optional: email, date_of_birth, passport_number, passport_expiry, notes

## Security

**Implemented:**
- Row-Level Security (RLS) on all tables
- Server-side authentication checks
- Protected API routes
- CSRF protection via Next.js
- SQL injection protection (Supabase)
- Environment variable protection

**Recommended for Production:**
- Enable MFA for admin accounts
- Use strong passwords
- Rotate service role keys regularly
- Monitor Supabase logs
- Set up database backups
- Add rate limiting (Upstash Redis)
- Enable Supabase email verification

## Performance

**Optimizations Implemented:**
- Server-side data fetching
- `cache: 'no-store'` for real-time data
- Efficient database queries with JOINs
- Indexed foreign keys
- Optimized images for Supabase

**Future Optimizations:**
- React Query for client-side caching
- Pagination for large datasets
- Virtual scrolling for tables
- Image optimization with Next.js Image

## Cost Breakdown

**Free Tier (Current):**
- Supabase: $0/month
  - 500MB database
  - 1GB file storage
  - 50,000 monthly active users
- Vercel: $0/month (Hobby plan)
- Resend: $0/month (100 emails/day)
- **Total: $0/month**

**When Scaling:**
- Supabase Pro: $25/month (8GB DB, 100GB storage)
- Resend: $20/month (50K emails/month)
- **Total: ~$45/month**

## Testing Checklist

**Basic Functionality:**
- [ ] Can log in as admin
- [ ] Dashboard loads with stats
- [ ] Can create customer
- [ ] Can create application
- [ ] Application number auto-generates correctly
- [ ] Can search applications
- [ ] Can filter by status
- [ ] Sidebar navigation works
- [ ] Can log out

**Data Integrity:**
- [ ] Customer linked to application
- [ ] Status badge shows correct color
- [ ] Prices formatted correctly (IDR)
- [ ] Dates formatted correctly
- [ ] Activity logs created (check Supabase)

**Edge Cases:**
- [ ] Creating application without customers shows warning
- [ ] Invalid login shows error
- [ ] Unauthorized access redirects to login
- [ ] Form validation works

## Support & Troubleshooting

**Common Issues:**

1. **"Failed to fetch applications"**
   - Check Supabase credentials in `.env.local`
   - Verify database tables exist
   - Check RLS policies are enabled

2. **"Unauthorized" on login**
   - User must exist in Supabase Auth
   - User must exist in `admin_users` table
   - Email must match exactly

3. **Application number not generating**
   - Check trigger exists in database
   - Verify sequence exists
   - Check Supabase logs

## Next Steps

1. **Complete Phase 4**: Application detail view with status updates
2. **Complete Phase 5**: Document upload functionality
3. **Complete Phase 6**: Payment tracking
4. **Deploy to production**: Vercel + production Supabase
5. **Set up email notifications**: Configure Resend templates

## Contributing

When adding new features:
1. Update database schema in `supabase-migration.sql`
2. Update TypeScript types in `/types`
3. Create API route in `/app/api`
4. Create UI component in `/components/admin`
5. Update this README

## License

Proprietary - BaliVisaAssist Internal Use Only

---

**Status**: Phase 1-3 Complete ✅ | Phases 4-9 In Progress 🚧

For setup instructions, see `ADMIN_PORTAL_SETUP.md`
