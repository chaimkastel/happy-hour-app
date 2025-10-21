import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orderhappyhour.com';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    locale = 'en_US',
    alternateLocales = [],
    noindex = false,
    nofollow = false,
  } = config;

  const fullTitle = title.includes('Happy Hour') ? title : `${title} | Happy Hour`;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const robots = [];
  if (noindex) robots.push('noindex');
  if (nofollow) robots.push('nofollow');
  if (!noindex && !nofollow) robots.push('index', 'follow');

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: robots.join(', '),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: alternateLocales.reduce((acc, locale) => {
        acc[locale] = `${baseUrl}/${locale}${url || ''}`;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'Happy Hour',
      locale,
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@happyhour',
      site: '@happyhour',
    },
    other: {
      'geo.region': 'US',
      'geo.placename': 'United States',
      'ICBM': '39.8283, -98.5795',
      'DC.title': fullTitle,
      'DC.description': description,
      'DC.creator': author || 'Happy Hour',
      'DC.subject': keywords.join(', '),
      'DC.language': locale,
      'DC.type': type,
    },
  };

  return metadata;
}

// Deal-specific metadata
export function generateDealMetadata(deal: {
  id: string;
  title: string;
  description: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  percentOff: number;
  image?: string;
  tags?: string[];
}) {
  const title = `${deal.percentOff}% Off at ${deal.venue.name} - ${deal.title}`;
  const description = `${deal.description} Get ${deal.percentOff}% off at ${deal.venue.name} in ${deal.venue.city}, ${deal.venue.state}. ${deal.venue.address}`;
  
  return generateMetadata({
    title,
    description,
    keywords: [
      'restaurant deals',
      'happy hour',
      deal.venue.name,
      deal.venue.city,
      deal.venue.state,
      `${deal.percentOff}% off`,
      'food discounts',
      'dining deals',
      ...(deal.tags || []),
    ],
    url: `/deal/${deal.id}`,
    type: 'website',
    image: deal.image,
    tags: deal.tags,
  });
}

// Venue-specific metadata
export function generateVenueMetadata(venue: {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  cuisine?: string;
  image?: string;
}) {
  const title = `${venue.name} - Restaurant Deals in ${venue.city}, ${venue.state}`;
  const description = `${venue.description} Find great deals and happy hour specials at ${venue.name} in ${venue.city}, ${venue.state}. ${venue.address}`;
  
  return generateMetadata({
    title,
    description,
    keywords: [
      venue.name,
      venue.city,
      venue.state,
      'restaurant deals',
      'happy hour',
      venue.cuisine || 'restaurant',
      'food discounts',
      'dining',
    ],
    url: `/venue/${venue.id}`,
    type: 'website',
    image: venue.image,
  });
}

// City-specific metadata
export function generateCityMetadata(city: {
  name: string;
  state: string;
  description?: string;
}) {
  const title = `Restaurant Deals in ${city.name}, ${city.state} - Happy Hour`;
  const description = city.description || `Find the best restaurant deals and happy hour specials in ${city.name}, ${city.state}. Save money on dining out with local restaurant discounts.`;
  
  return generateMetadata({
    title,
    description,
    keywords: [
      'restaurant deals',
      'happy hour',
      city.name,
      city.state,
      'food discounts',
      'dining deals',
      'local restaurants',
      'off-peak specials',
    ],
    url: `/explore?city=${encodeURIComponent(city.name)}&state=${encodeURIComponent(city.state)}`,
    type: 'website',
  });
}

// JSON-LD structured data
export function generateDealStructuredData(deal: {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  startAt: string;
  endAt: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    website?: string;
  };
  image?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: deal.title,
    description: deal.description,
    price: `${deal.percentOff}% off`,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: deal.startAt,
    validThrough: deal.endAt,
    seller: {
      '@type': 'Restaurant',
      name: deal.venue.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: deal.venue.address,
        addressLocality: deal.venue.city,
        addressRegion: deal.venue.state,
        addressCountry: 'US',
      },
      ...(deal.venue.latitude && deal.venue.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: deal.venue.latitude,
          longitude: deal.venue.longitude,
        },
      }),
      ...(deal.venue.phone && { telephone: deal.venue.phone }),
      ...(deal.venue.website && { url: deal.venue.website }),
    },
    ...(deal.image && {
      image: deal.image.startsWith('http') ? deal.image : `${baseUrl}${deal.image}`,
    }),
  };

  return JSON.stringify(structuredData);
}

export function generateVenueStructuredData(venue: {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  cuisine?: string;
  image?: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: venue.name,
    description: venue.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      addressLocality: venue.city,
      addressRegion: venue.state,
      addressCountry: 'US',
    },
    ...(venue.latitude && venue.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.latitude,
        longitude: venue.longitude,
      },
    }),
    ...(venue.phone && { telephone: venue.phone }),
    ...(venue.website && { url: venue.website }),
    ...(venue.cuisine && { servesCuisine: venue.cuisine }),
    ...(venue.image && {
      image: venue.image.startsWith('http') ? venue.image : `${baseUrl}${venue.image}`,
    }),
  };

  return JSON.stringify(structuredData);
}

export function generateWebSiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Happy Hour',
    url: baseUrl,
    description: 'Find amazing restaurant deals and happy hour specials near you',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/explore?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Happy Hour',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
      },
    },
  };

  return JSON.stringify(structuredData);
}