import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata, generateWebSiteStructuredData } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Explore Restaurant Deals',
  description: 'Discover amazing restaurant deals and happy hour specials near you. Save money on dining out with local restaurant discounts and off-peak specials.',
  keywords: [
    'restaurant deals',
    'happy hour',
    'food discounts',
    'local restaurants',
    'dining deals',
    'off-peak specials',
    'restaurant coupons',
    'food promotions',
    'dining savings',
    'restaurant offers',
  ],
  url: '/explore',
  type: 'website',
});

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateWebSiteStructuredData(),
        }}
      />
      {children}
    </>
  );
}

