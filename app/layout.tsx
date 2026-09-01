import type { Metadata, Viewport } from "next";
import { Yatra_One } from "next/font/google";

import "@/app/globals.css";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/home/Footer";
import FooterTrust from "@/components/home/FooterTrust";
import FloatingWhatsAppButton from "@/components/home/FloatingWhatsAppButton";
import GoToTop from "@/components/common/GoToTop";

const yatraOne = Yatra_One({
  weight: "400",
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-yatra-one",
  preload: false,
  fallback: ["Noto Sans Devanagari", "serif"],
  adjustFontFallback: true,
});

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#000000",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),

  title: {
    default: "सपना श्री ज्वेलर्स नागदा | Sapna Shri Jewellers Nagda",
    template: "%s | Sapna Shri Jewellers Nagda",
  },

  description:
    "Official website of Sapna Shri Jewellers, Nagda — 35+ years of trusted jewelry craftsmanship offering BIS 916 Hallmark gold and silver ornaments.",

  icons: {
    icon: [
      {
        url: "/favicon-96x96-v4.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon-v4.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-touch-icon.png",
  },

  authors: [
    {
      name: "Sapna Shri Jewellers",
      url: baseURL,
    },
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  alternates: {
    canonical: baseURL,
    types: {
      "application/opensearchdescription+xml": [
        {
          url: "/opensearch.xml",
          title: "Sapna Shri Jewellers Search",
        },
      ],
    },
  },

  other: {
    "color-scheme": "light dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={yatraOne.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
        >
          Skip to main content
        </a>

        <FloatingWhatsAppButton />

        <header className="sticky top-0 z-40 w-full border-theme/30 bg-(--color-surface)/80 shadow-xs backdrop-blur-xl">
          <div className="mx-auto max-w-7xl p-0">
            <Navbar />
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="grow w-full focus:outline-none"
        >
          {children}
        </main>

        <footer className="w-full">
          <FooterTrust />
          <Footer />         
        </footer>
        <GoToTop />
      </body>
    </html>
  );
}
