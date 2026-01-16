import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import "@/app/splash.css";
import { Noto_Sans_Devanagari } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/home/Footer";
import FooterTrust from "@/components/home/FooterTrust";
import Ticker from "@/components/home/Ticker";
import FloatingWhatsAppButton from "@/components/home/FloatingWhatsAppButton";
import RegisterSW from "@/components/home/registerSW";
import Script from "next/script"
import { AuthProvider } from "@/context/AuthContext";
import BadgeHandler from "@/components/common/BadgeHandler";


const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#A37F2C" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: "सपना श्री ज्वैलर्स, नागदा | Sapna Shri Jewellers Nagda |",
  description:
    "Official website of Sapna Shri Jewellers, Nagda — trusted jewellery shop offering gold and silver ornaments.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SSJ",
    statusBarStyle: "black-translucent", // Options: "default", "black", "black-translucent"
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", rel: "icon", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", rel: "icon", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", rel: "icon", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", rel: "icon", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  authors: [{ name: "Sapna Shri Jewellers" }],
  robots: "index, follow",
  alternates: {
    types: {
      'application/opensearchdescription+xml': [
        { url: '/opensearch.xml', title: 'Sapna Shri' },
      ],
    },
  },
  other: {
    "color-scheme": "light dark",
  },
};


export default function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className="">
      <head>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="Sapna Shri"
          href="/opensearch.xml"
        />
      </head>
      
      <body className={notoDevanagari.className}>
        <BadgeHandler />
        <AuthProvider>
          <RegisterSW />
          {/* Floating WhatsApp Button */}
          <FloatingWhatsAppButton />

          {/* Main layout */}
          <div className="container mx-auto mb-15 md:mb-0">
            <Navbar />
            <Ticker />
            <div className="px-2 max-w-6xl mx-auto py-4">{children}</div>

            <FooterTrust />
            <Footer />

            <a id="powered-by-mehtalogy"
              href="https://mehtalogy.in"
              target="_blank" title="Powered by Mehtalogy LABS">
              Mehtalogy LABS
            </a>

            <Script src="https://mehtalogy.in/pb/v1.js"
              strategy="afterInteractive" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}