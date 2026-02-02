# BaliVisaAssist Website

Professional visa assistance website for Indonesia, operated by PT CIPTA SOLUSI GLOBAL.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
balivisaassist/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with Header, Footer, Analytics
│   ├── page.tsx                 # Homepage
│   ├── about/page.tsx           # About page
│   ├── contact/page.tsx         # Contact page
│   ├── faq/page.tsx             # FAQ page
│   ├── privacy-policy/page.tsx  # Privacy Policy
│   ├── terms-of-service/page.tsx # Terms of Service
│   ├── services/
│   │   ├── page.tsx             # Services listing
│   │   └── [slug]/page.tsx      # Dynamic service pages (all 7 services)
│   ├── sitemap.ts               # Dynamic sitemap
│   └── not-found.tsx            # Custom 404 page
│
├── components/
│   ├── analytics/               # Google Analytics & Meta Pixel
│   ├── common/                  # WhatsAppButton, StructuredData
│   ├── forms/                   # Contact form (to be implemented)
│   ├── layout/                  # Header, Footer
│   ├── sections/                # Homepage sections
│   ├── services/                # ServiceCard
│   └── ui/                      # Reusable UI components
│
├── data/
│   ├── services.ts              # All 7 visa services with pricing
│   ├── whatsapp-messages.ts     # WhatsApp message templates
│   ├── faqs.json                # FAQ data (editable)
│   └── legal.json               # Privacy & Terms content (editable)
│
├── lib/
│   ├── analytics.ts             # GA4 & Meta Pixel tracking functions
│   ├── rate-limit.ts            # Anti-spam rate limiting
│   ├── utils.ts                 # Utility functions (cn, formatPrice, etc.)
│   ├── validations.ts           # Zod schemas for forms
│   └── whatsapp.ts              # WhatsApp URL generation
│
├── constants/
│   └── company.ts               # Company info, SEO defaults
│
├── types/
│   └── index.ts                 # TypeScript type definitions
│
└── public/
    ├── robots.txt               # SEO robots file
    └── images/                  # Image assets
```

## 📊 All 7 Visa Services

1. **C1 Visa** - IDR 2,700,000 (60-day business visa)
2. **Retirement KITAS** - IDR 8,500,000 (1-year retiree permit)
3. **Digital Nomad KITAS** - IDR 14,500,000 (5-year remote work permit)
4. **Investor/Working KITAS** - IDR 18,000,000 (1-year work permit)
5. **VOA Visa** - IDR 650,000 (30-day tourist visa)
6. **D12 Visa** - IDR 7,500,000 (1-year investor visa)
7. **PT PMA** - IDR 17,500,000 (Company setup)

## ✅ Features Implemented

- ✅ Next.js 15 with App Router & TypeScript
- ✅ Tailwind CSS 4 with Bali-inspired design theme
- ✅ 18 pages (home, services, 7 service detail pages, about, faq, contact, 2 legal pages, 404)
- ✅ Mobile-first responsive design
- ✅ WhatsApp integration with prefilled messages
- ✅ Google Analytics 4 integration
- ✅ Meta Pixel integration
- ✅ SEO-optimized (sitemap, robots.txt, metadata)
- ✅ Legal compliance (PT operator disclosures in footer & legal pages)
- ✅ Compliance disclaimer on key pages
- ✅ Dynamic service pages (one template for all services)
- ✅ Accordion FAQs
- ✅ Rate limiting (anti-spam)

## 🔧 Environment Variables

Create a `.env.local` file with:

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXX

# Email Service (Resend)
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX

# Contact Information
CONTACT_EMAIL=info@balivisaassist.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+62XXXXXXXXXXX
```

## 🚢 Deployment to Vercel

### 1. Initialize Git & Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: BaliVisaAssist website"
git remote add origin https://github.com/YOUR_USERNAME/balivisaassist.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables (see above)
5. Click "Deploy"

### 3. Add Custom Domain
1. In Vercel project settings → Domains
2. Add `balivisaassist.com`
3. Update DNS records as instructed
4. SSL certificate will auto-provision

## 📝 Content Management

### Update Pricing
Edit `/data/services.ts`:
```typescript
{
  id: 'c1-visa',
  name: 'C1 Visa',
  startingPrice: 2700000, // Change this value
  // ...
}
```

### Update FAQs
Edit `/data/faqs.json`:
```json
{
  "question": "Your question?",
  "answer": "Your answer."
}
```

### Update Legal Pages
Edit `/data/legal.json` - Update privacy policy or terms sections.

### Update Company Info
Edit `/constants/company.ts` - Change email, WhatsApp, address.

## 🎨 Design Theme

- **Primary Colors**: Emerald-600 (#059669), Teal-600 (#0d9488)
- **Secondary Color**: Orange-500 (#f97316)
- **Neutral**: Slate shades
- **Font**: Geist Sans (via next/font/google)

## 📊 Analytics Events

### Google Analytics 4
- `view_service` - Service page views
- `click_whatsapp` - WhatsApp button clicks
- `submit_contact_form` - Form submissions
- `view_pricing` - Services page views

### Meta Pixel
- `PageView` - All page views
- `ViewContent` - Service page views
- `Contact` - WhatsApp clicks
- `Lead` - Form submissions

## 🔒 Legal Compliance

✅ **PT Operator Disclosure** appears in:
- Footer (all pages)
- Privacy Policy
- Terms of Service
- About page

✅ **Compliance Disclaimer** ("Not government affiliated") appears on:
- Homepage
- Services listing page
- Individual service pages

## 🧪 Testing Checklist

Before going live:
- [ ] Add environment variables to `.env.local`
- [ ] Test WhatsApp button (set NEXT_PUBLIC_WHATSAPP_NUMBER)
- [ ] Verify all navigation links work
- [ ] Test mobile responsiveness
- [ ] Check all 7 service pages load correctly
- [ ] Verify pricing displays correctly
- [ ] Test on multiple browsers
- [ ] Run Lighthouse audit (target 90+ score)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Email**: Resend (ready to integrate)
- **Analytics**: Google Analytics 4 + Meta Pixel
- **Deployment**: Vercel

## 📞 Support

For development questions:
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com

## 📄 License

Copyright © 2024 PT CIPTA SOLUSI GLOBAL. All rights reserved.

---

**Built with ❤️ for BaliVisaAssist**
