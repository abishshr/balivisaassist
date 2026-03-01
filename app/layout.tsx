import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";
import { AnalyticsWrapper } from "@/components/analytics/AnalyticsWrapper";
import { SEO } from "@/constants/company";
import { MotionProvider } from "@/components/providers/MotionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SEO.defaultTitle,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
      >
        <MotionProvider>
          <AnalyticsWrapper />
          <PublicShell>{children}</PublicShell>
        </MotionProvider>
      </body>
    </html>
  );
}
