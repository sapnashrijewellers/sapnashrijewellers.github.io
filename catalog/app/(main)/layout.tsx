import type { Metadata, Viewport } from "next";
import { Yatra_One } from "next/font/google";
import "@/app/globals.css";
import "@/app/splash.css";
import { Noto_Sans_Devanagari } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/home/Footer";
import FooterTrust from "@/components/home/FooterTrust";
import FloatingWhatsAppButton from "@/components/home/FloatingWhatsAppButton";
import RegisterSW from "@/components/home/registerSW";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import BadgeHandler from "@/components/common/BadgeHandler";
import GoToTop from "@/components/common/GoToTop";

const yatraOne = Yatra_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
  display: "swap",
  variable: "--font-yatra-one",
  preload: true,
  fallback: ["Noto Sans Devanagari", "serif"],
  adjustFontFallback: true, // Prevents Cumulative Layout Shift (CLS)
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
  display: "swap",
  variable: "--font-noto-devanagari",
});

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: {
    default: "सपना श्री ज्वेलर्स नागदा | Sapna Shri Jewellers Nagda",
    template: "%s | Sapna Shri Jewellers Nagda",
  },
  description:
    "Official website of Sapna Shri Jewellers, Nagda — 35+ years of trusted jewellery craftsmanship offering BIS 916 Hallmark gold and silver ornaments.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SSJ",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96-v4.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-v4.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  authors: [{ name: "Sapna Shri Jewellers", url: baseURL }],
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
        { url: "/opensearch.xml", title: "Sapna Shri Jewellers Search" },
      ],
    },
  },
  other: {
    "color-scheme": "light dark",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${yatraOne.variable} ${notoDevanagari.variable}`}>
      <body
        className={`flex flex-col min-h-screen transition-colors antialiased`}
      >
        {/* Accessible Skip Link for Keyboard & Screen Reader Users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>

        <BadgeHandler />

        <AuthProvider>
          <RegisterSW />

          {/* Floating WhatsApp CTA */}
          <FloatingWhatsAppButton />

          {/* Persistent Accessible Sticky Header */}
          <header className="w-full sticky top-0 z-40 bg-(--color-surface)/80 backdrop-blur-xl border-theme/30 shadow-xs">
            <div className="max-w-7xl mx-auto p-0">
              <Navbar />
            </div>
          </header>

          {/* Main Landmark Area */}
          <main id="main-content" tabIndex={-1} className="grow w-full focus:outline-none">
            {children}
          </main>

          {/* Trust Ribbon & Main Footer */}
          <footer className="w-full mt-auto">
            <FooterTrust />
            <Footer />

            <div className="text-center py-2 text-xs text-muted-foreground border-t border-theme/20">
              <a
                id="powered-by-mehtalogy"
                href="https://mehtalogy.in"
                target="_blank"
                rel="noopener noreferrer"
                title="Powered by Mehtalogy LABS"
                aria-label="Powered by Mehtalogy LABS (opens in a new window)"
                className="hover:underline hover:text-primary transition-colors"
              >
                Mehtalogy LABS
              </a>
            </div>
          </footer>

          {/* Non-critical 3rd Party Script loaded lazily to preserve LCP/FID */}
          <Script
            src="https://mehtalogy.in/pb/v1.js"
            strategy="lazyOnload"
          />

          <GoToTop />
        </AuthProvider>
      </body>
    </html>
  );
}