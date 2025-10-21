import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MobileLayout from '@/components/layout/MobileLayout';
import Footer from '@/components/layout/Footer';
import { Providers } from '@/components/providers';
import { SkipToMain } from '@/components/accessibility/SkipToMain';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Happy Hour — Off-peak deals near you',
  description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
  keywords: 'restaurant deals,happy hour,food discounts,local restaurants,dining deals,off-peak specials',
  authors: [{ name: 'Happy Hour Team' }],
  creator: 'Happy Hour',
  publisher: 'Happy Hour',
  robots: 'index, follow',
  metadataBase: new URL('https://www.orderhappyhour.com'),
  openGraph: {
    title: 'Happy Hour — Off-peak deals near you',
    description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
    url: 'https://www.orderhappyhour.com/',
    siteName: 'Happy Hour',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.orderhappyhour.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Happy Hour - Restaurant deals and discounts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@happyhour',
    title: 'Happy Hour — Off-peak deals near you',
    description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
    images: ['https://www.orderhappyhour.com/og-image.jpg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f97316',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://nominatim.openstreetmap.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Happy Hour',
              url: 'https://www.orderhappyhour.com',
              description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.orderhappyhour.com/explore?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <SkipToMain />
        <Providers>
          <MobileLayout>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </MobileLayout>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}