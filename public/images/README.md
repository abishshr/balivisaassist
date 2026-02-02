# BaliVisaAssist Images

## Current Images

All images are sourced from Unsplash (free to use under Unsplash License).

### 1. bali-hero.jpg (652 KB)
- **Used in**: Homepage Hero section
- **Description**: Beautiful Bali rice terraces
- **Source**: Unsplash
- **Dimensions**: 1920px width (optimized by Next.js)

### 2. bali-temple.jpg (775 KB)
- **Used in**: About page hero section
- **Description**: Traditional Bali temple
- **Source**: Unsplash
- **Dimensions**: 1920px width (optimized by Next.js)

### 3. bali-beach.jpg (348 KB)
- **Used in**: CTA section (all pages)
- **Description**: Stunning Bali beach scene
- **Source**: Unsplash
- **Dimensions**: 1920px width (optimized by Next.js)

### 4. og-image.jpg (180 KB)
- **Used in**: Social media sharing (Open Graph)
- **Description**: Bali landscape for social previews
- **Source**: Unsplash
- **Dimensions**: 1200px width

---

## Where Background Images Are Used

1. **Homepage** (`/`)
   - Hero: `bali-hero.jpg` (rice terraces)
   - CTA: `bali-beach.jpg` (beach)

2. **Services Page** (`/services`)
   - CTA: `bali-beach.jpg` (beach)

3. **About Page** (`/about`)
   - Hero: `bali-temple.jpg` (temple)
   - CTA: `bali-beach.jpg` (beach)

4. **FAQ Page** (`/faq`)
   - CTA: `bali-beach.jpg` (beach)

5. **Contact Page** (`/contact`)
   - No background images currently

6. **Individual Service Pages** (`/services/[slug]`)
   - No background images currently (could be added if desired)

---

## Adding More Images

To add more images:

1. Download high-quality images (1920px+ width recommended)
2. Optimize them (use tinypng.com or similar)
3. Save to `/public/images/` folder
4. Use Next.js Image component for best performance:

```tsx
import Image from 'next/image';

<Image
  src="/images/your-image.jpg"
  alt="Description"
  fill
  className="object-cover"
  quality={90}
/>
```

---

## Image Optimization

All images are automatically optimized by Next.js:
- Responsive sizing
- WebP conversion (when supported)
- Lazy loading
- Blur-up placeholder

No need to manually optimize!

---

## Attribution

All images from Unsplash are free to use under the Unsplash License:
https://unsplash.com/license

No attribution required, but always appreciated.
