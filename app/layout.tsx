import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Happy Hour — Off-peak deals near you',
  description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
  keywords: ['restaurant deals', 'happy hour', 'food discounts', 'local restaurants', 'dining deals', 'off-peak specials'],
  authors: [{ name: 'Happy Hour Team' }],
  creator: 'Happy Hour',
  publisher: 'Happy Hour',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.orderhappyhour.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Happy Hour — Off-peak deals near you',
    description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
    url: 'https://www.orderhappyhour.com',
    siteName: 'Happy Hour',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Happy Hour - Restaurant deals and discounts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Hour — Off-peak deals near you',
    description: 'Restaurants flip the switch when they\'re quiet. You get instant deals nearby.',
    images: ['/og-image.jpg'],
    creator: '@happyhour',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://nominatim.openstreetmap.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Happy Hour",
              "url": "https://www.orderhappyhour.com",
              "description": "Restaurants flip the switch when they're quiet. You get instant deals nearby.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.orderhappyhour.com/explore?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
