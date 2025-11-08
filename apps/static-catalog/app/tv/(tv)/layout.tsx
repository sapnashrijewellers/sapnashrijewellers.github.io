import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Noto_Sans_Devanagari } from "next/font/google";
import LogoHeader from "@/components/LogoHeader";
import RatesPanel from "@/components/RatesPanel";
import WhatsAppContact from "@/components/WhatsAppContact";
import Ticker from "@/components/Ticker";

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

export default function TVLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="theme-dark">
      <body className={notoDevanagari.className}>
        {/* Main layout */}
       <div className="min-h-screen flex flex-col p-2 overflow-hidden">
      
      <LogoHeader />
      <Ticker />
      {/* 2-column layout */}
      <div className="grid grid-cols-[2fr_1fr] gap-2 flex-1 h-full">
        {/* Left: Product slideshow */}
        <div className="flex justify-center items-center">
          {children}
        </div>

        {/* Right: Rates panel */}
        <div className="flex flex-col">
          <RatesPanel />
          {/* WhatsApp Contact */}
        <WhatsAppContact />
        </div>        
      </div>
    </div>
      </body>
    </html>
  );
}