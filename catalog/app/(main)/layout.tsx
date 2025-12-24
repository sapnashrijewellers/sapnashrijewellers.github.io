import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Noto_Sans_Devanagari } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/home/Footer";
import FooterTrust from "@/components/home/FooterTrust";
import Ticker from "@/components/home/Ticker";
import FloatingWhatsAppButton from "@/components/home/FloatingWhatsAppButton";
import RegisterSW from "@/components/home/registerSW";
import Script from "next/script"
import { AuthProvider } from "@/context/AuthContext";

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon.ico", rel: "shortcut icon" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },

  authors: [{ name: "Sapna Shri Jewellers" }],
  robots: "index, follow",
  other: {
    "color-scheme": "light dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};


export default function RootLayout({ children, }: { children: React.ReactNode; }) {

  return (
    <html lang="en" className="">
      <body className={notoDevanagari.className}>
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