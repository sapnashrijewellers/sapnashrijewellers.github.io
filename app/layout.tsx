import type { Metadata, Viewport } from 'next';
import '@/app/globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/home/Footer';
import FloatingWhatsAppButton from '@/components/home/FloatingWhatsAppButton';
import GoToTop from '@/components/common/GoToTop';
import Script from 'next/script';

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),

  title: {
    default: 'सपना श्री ज्वेलर्स नागदा | Sapna Shri Jewellers Nagda',
    template: '%s',
  },

  description:
    'Official website of Sapna Shri Jewellers, Nagda — 35+ years of trusted jewelry craftsmanship offering BIS 916 Hallmark gold and silver ornaments.',

  icons: {
    icon: [
      {
        url: '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        url: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-touch-icon.png',
  },

  authors: [
    {
      name: 'Sapna Shri Jewellers',
      url: baseURL,
    },
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  alternates: {
    canonical: `${baseURL}/`,
    types: {
      'application/opensearchdescription+xml': [
        {
          url: '/opensearch.xml',
          title: 'Sapna Shri Jewellers Search',
        },
      ],
    },
  },

  other: {
    'color-scheme': 'light',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-93YXKJV18B" strategy="afterInteractive" />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-93YXKJV18B');
          `}
        </Script>

        <link rel="describedby" type="text/markdown" href="https://sapnashrijewellers.in/llms.txt" />
        {/* pinterest verification meta tag */}
        <meta name="p:domain_verify" content="757373a06d146840bd703f3b5dd8ec21" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main-content"
          className="focus:bg-primary sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Skip to main content
        </a>

        <FloatingWhatsAppButton />

        <header className="border-theme/30 sticky top-0 z-40 w-full bg-(--color-surface)/80 shadow-xs backdrop-blur-xl">
          <div className="mx-auto max-w-7xl p-0">
            <Navbar />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="w-full grow focus:outline-none">
          {children}
        </main>

        <footer className="w-full">
          {/* <FooterTrust /> */}
          <Footer />
        </footer>
        <GoToTop />
      </body>
    </html>
  );
}
