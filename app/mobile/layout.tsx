import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Happy Hour — Find Amazing Deals',
  description: 'Discover amazing restaurant deals near you. Save money on great food with Happy Hour.',
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
    canonical: '/mobile',
  },
  openGraph: {
    title: 'Happy Hour — Find Amazing Deals',
    description: 'Discover amazing restaurant deals near you. Save money on great food with Happy Hour.',
    url: 'https://www.orderhappyhour.com/mobile',
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
    creator: '@happyhour',
    title: 'Happy Hour — Find Amazing Deals',
    description: 'Discover amazing restaurant deals near you. Save money on great food with Happy Hour.',
    images: ['/og-image.jpg'],
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export default function MobileLayout({
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Happy Hour',
              url: 'https://www.orderhappyhour.com',
              description: "Restaurants flip the switch when they're quiet. You get instant deals nearby.",
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.orderhappyhour.com/explore?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
