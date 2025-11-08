import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Noto_Sans_Devanagari } from "next/font/google";
// import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterTrust from "@/components/FooterTrust";
import Ticker from "@/components/Ticker";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import RegisterSW from "@/components/registerSW";

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "सपना श्री ज्वैलर्स, नागदा | Sapna Shri Jewellers Nagda |",
  description:
    "Official website of Sapna Shri Jewellers, Nagda — trusted jewellery shop offering gold and silver ornaments.",
  icons: {
    icon: [
      { url: "/icons/favicon-96x96-v1.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/favicon-v1.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-v1.ico", rel: "shortcut icon" },
    ],
    apple: "/icons/apple-touch-icon-v1.png",
  },
  authors: [{ name: "Sapna Shri Jewellers" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="theme-dark">
      <body className={notoDevanagari.className}>
        <RegisterSW />

        {/* Floating WhatsApp Button */}
        <FloatingWhatsAppButton />

        {/* Main layout */}
        <div className="container mx-auto">
          <Navbar />
          <Ticker />
          <div className="p-4 max-w-6xl mx-auto">{children}</div>
          <FooterTrust />
          <Footer />
        </div>
      </body>
    </html>
  );
}