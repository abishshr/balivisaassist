import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";
import { AnalyticsWrapper } from "@/components/analytics/AnalyticsWrapper";
import { SEO } from "@/constants/company";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, localBusinessJsonLd } from "@/lib/structured-data";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    template: '%s | BaliVisaAssist',
    default: SEO.defaultTitle,
  },
  description: SEO.defaultDescription,
  keywords: SEO.defaultKeywords,
  authors: [{ name: "BaliVisaAssist" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SEO.siteUrl,
    siteName: "BaliVisaAssist",
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [
      {
        url: SEO.ogImage,
        width: 1200,
        height: 630,
        alt: "BaliVisaAssist - Indonesia Visa Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [SEO.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "facebook-domain-verification": "dm0y9hd6kqjr1gkcuwhlaqx7babxum",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} antialiased bg-transparent`}
      >
        <MotionProvider>
          <AnalyticsWrapper />
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={localBusinessJsonLd()} />
          <PublicShell>{children}</PublicShell>
        </MotionProvider>
      </body>
    </html>
  );
}
