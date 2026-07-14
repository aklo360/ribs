import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

function normalizeSiteUrl(value: string | undefined) {
  const siteUrl = value?.trim() || SITE.url;
  const withProtocol = /^https?:\/\//.test(siteUrl)
    ? siteUrl
    : `https://${siteUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

const metadataSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.CF_PAGES_URL
);
const metadataTitle = `${SITE.name} · ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(metadataSiteUrl),
  title: {
    default: metadataTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  alternates: {
    canonical: metadataSiteUrl,
  },
  keywords: [
    "Roots in Blue Stone",
    "RIBS",
    "reggae",
    "rock",
    "blues",
    "soul",
    "live band",
    "Poconos band",
    "Pennsylvania band",
    "book a band",
    "wedding band",
    "festival band",
  ],
  openGraph: {
    type: "website",
    url: metadataSiteUrl,
    title: metadataTitle,
    description: SITE.description,
    siteName: SITE.name,
    images: [
      {
        url: "/img/social/og-card.png",
        width: 1200,
        height: 630,
        alt: metadataTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metadataTitle,
    description: SITE.description,
    images: ["/img/social/og-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
        <Script
          id="mcjs"
          src={SITE.mailchimpConnectedSiteScript}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
