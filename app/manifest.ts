import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orderhappyhour.com';
  
  return {
    name: 'Happy Hour - Restaurant Deals',
    short_name: 'Happy Hour',
    description: 'Find amazing restaurant deals and happy hour specials near you',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    categories: ['food', 'lifestyle', 'shopping', 'business'],
    lang: 'en',
    dir: 'ltr',
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
      }
    ],
    shortcuts: [
      {
        name: 'Explore Deals',
        short_name: 'Explore',
        description: 'Find deals near you',
        url: '/explore',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'My Account',
        short_name: 'Account',
        description: 'View your account',
        url: '/account',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192'
          }
        ]
      },
      {
        name: 'My Wallet',
        short_name: 'Wallet',
        description: 'View your redeemed deals',
        url: '/wallet',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192'
          }
        ]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  };
}
