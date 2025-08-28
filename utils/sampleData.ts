import { Deal } from '@/types';

export const getSampleDeals = (): Deal[] => [
  {
    id: '1',
    title: 'Happy Hour Special',
    description: '50% off all drinks and appetizers during quiet hours',
    percentOff: 50,
    status: 'LIVE',
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    maxRedemptions: 20,
    redeemedCount: 8,
    minSpend: 25.0,
    inPersonOnly: true,
    tags: ['happy-hour', 'drinks', 'appetizers'],
    venue: {
      id: 'v1',
      name: 'Crown Heights Trattoria',
      slug: 'crown-heights-trattoria',
      address: '123 Nostrand Ave, Brooklyn, NY 11216',
      latitude: 40.6681,
      longitude: -73.9442,
      businessType: ['Italian', 'Mediterranean'],
      priceTier: 'MODERATE',
      rating: 4.5,
      photos: ['https://picsum.photos/seed/trattoria1/800/600']
    }
  },
  {
    id: '2',
    title: 'Lunch Rush Deal',
    description: '30% off all lunch items to fill the restaurant',
    percentOff: 30,
    status: 'LIVE',
    startAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    maxRedemptions: 15,
    redeemedCount: 12,
    minSpend: 15.0,
    inPersonOnly: true,
    tags: ['lunch', 'food', 'quick-service'],
    venue: {
      id: 'v2',
      name: 'Brooklyn Brew House',
      slug: 'brooklyn-brew-house',
      address: '456 Atlantic Ave, Brooklyn, NY 11217',
      latitude: 40.6782,
      longitude: -73.9442,
      businessType: ['American', 'Brewery', 'Gastropub'],
      priceTier: 'MODERATE',
      rating: 4.3,
      photos: ['https://picsum.photos/seed/brewhouse1/800/600']
    }
  },
  {
    id: '3',
    title: 'Weekend Special',
    description: '25% off craft beers and burgers',
    percentOff: 25,
    status: 'LIVE',
    startAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    maxRedemptions: 25,
    redeemedCount: 5,
    minSpend: 20.0,
    inPersonOnly: true,
    tags: ['weekend', 'beer', 'burgers'],
    venue: {
      id: 'v3',
      name: 'Sunset Diner',
      slug: 'sunset-diner',
      address: '789 Ocean Ave, Brooklyn, NY 11226',
      latitude: 40.7282,
      longitude: -73.7949,
      businessType: ['Mexican', 'Latin American'],
      priceTier: 'BUDGET',
      rating: 4.1,
      photos: ['https://picsum.photos/seed/diner1/800/600']
    }
  },
  {
    id: '4',
    title: 'Early Bird Discount',
    description: '40% off dinner entrees before 6 PM',
    percentOff: 40,
    status: 'LIVE',
    startAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    maxRedemptions: 30,
    redeemedCount: 18,
    minSpend: 35.0,
    inPersonOnly: true,
    tags: ['early-bird', 'dinner', 'entrees'],
    venue: {
      id: 'v4',
      name: 'Prospect Heights Bistro',
      slug: 'prospect-heights-bistro',
      address: '321 Vanderbilt Ave, Brooklyn, NY 11238',
      latitude: 40.6789,
      longitude: -73.9690,
      businessType: ['French', 'Bistro'],
      priceTier: 'PREMIUM',
      rating: 4.7,
      photos: ['https://picsum.photos/seed/bistro1/800/600']
    }
  },
  {
    id: '5',
    title: 'Taco Tuesday',
    description: 'Buy one taco, get one free every Tuesday',
    percentOff: 50,
    status: 'LIVE',
    startAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    maxRedemptions: 50,
    redeemedCount: 32,
    minSpend: 12.0,
    inPersonOnly: false,
    tags: ['taco-tuesday', 'mexican', 'lunch'],
    venue: {
      id: 'v5',
      name: 'Taco Loco',
      slug: 'taco-loco',
      address: '555 5th Ave, Brooklyn, NY 11215',
      latitude: 40.6610,
      longitude: -73.9800,
      businessType: ['Mexican', 'Street Food'],
      priceTier: 'BUDGET',
      rating: 4.2,
      photos: ['https://picsum.photos/seed/taco1/800/600']
    }
  }
];

export const getSampleCuisines = (): string[] => [
  'Italian',
  'Mexican',
  'American',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'French',
  'Greek',
  'Korean',
  'Vietnamese',
  'Lebanese',
  'Turkish',
  'Spanish',
  'Portuguese',
  'Brazilian',
  'Peruvian',
  'Argentine',
  'Caribbean'
];

export const getSampleTags = (): string[] => [
  'happy-hour',
  'lunch',
  'dinner',
  'breakfast',
  'brunch',
  'drinks',
  'appetizers',
  'entrees',
  'desserts',
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'organic',
  'local',
  'seasonal',
  'quick-service',
  'fine-dining',
  'casual',
  'romantic',
  'family-friendly',
  'date-night',
  'business-lunch',
  'group-dining',
  'outdoor-seating',
  'live-music',
  'sports-bar',
  'wine-bar',
  'cocktail-bar',
  'brewery',
  'distillery'
];

export const getSamplePriceTiers = (): string[] => [
  'BUDGET',
  'MODERATE',
  'PREMIUM',
  'LUXURY'
];

export const getSampleVenues = () => [
  {
    id: 'v1',
    name: 'Crown Heights Trattoria',
    slug: 'crown-heights-trattoria',
    address: '123 Nostrand Ave, Brooklyn, NY 11216',
    latitude: 40.6681,
    longitude: -73.9442,
          businessType: ['Italian', 'Mediterranean'],
    priceTier: 'MODERATE',
    rating: 4.5,
    photos: ['https://picsum.photos/seed/trattoria1/800/600'],
    isVerified: true
  },
  {
    id: 'v2',
    name: 'Brooklyn Brew House',
    slug: 'brooklyn-brew-house',
    address: '456 Atlantic Ave, Brooklyn, NY 11217',
    latitude: 40.6782,
    longitude: -73.9442,
          businessType: ['American', 'Brewery', 'Gastropub'],
    priceTier: 'MODERATE',
    rating: 4.3,
    photos: ['https://picsum.photos/seed/brewhouse1/800/600'],
    isVerified: true
  },
  {
    id: 'v3',
    name: 'Sunset Diner',
    slug: 'sunset-diner',
    address: '789 Ocean Ave, Brooklyn, NY 11226',
    latitude: 40.7282,
    longitude: -73.7949,
          businessType: ['Mexican', 'Latin American'],
    priceTier: 'BUDGET',
    rating: 4.1,
    photos: ['https://picsum.photos/seed/diner1/800/600'],
    isVerified: false
  }
];

export const getSampleStats = () => ({
  deals: {
    totalDeals: 156,
    activeDeals: 89,
    totalRedemptions: 1247,
    averageRating: 4.3,
    totalVenues: 67,
    totalMerchants: 45
  },
  users: {
    totalRedemptions: 23,
    totalSavings: 156.78,
    favoriteCuisines: ['Italian', 'Mexican', 'American'],
    averageRating: 4.2,
    streakDays: 7,
    points: 1250,
    badges: ['First Deal', 'Week Warrior', 'Italian Lover']
  },
  merchants: {
    totalVenues: 3,
    totalDeals: 12,
    totalRedemptions: 89,
    totalRevenue: 2340.50,
    averageRating: 4.4,
    activeDeals: 8
  }
});

export const getSampleNotifications = () => [
  {
    id: 'n1',
    type: 'DEAL_ALERT',
    title: 'New Deal Available!',
    message: '50% off at Crown Heights Trattoria - Limited time only!',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'n2',
    type: 'PROMOTION',
    title: 'Weekend Special',
    message: 'Double points on all redemptions this weekend!',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n3',
    type: 'SYSTEM',
    title: 'Welcome to Happy Hour!',
    message: 'Start exploring amazing deals in your area.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export const getSampleReviews = () => [
  {
    id: 'r1',
    rating: 5,
    comment: 'Amazing deal! The food was incredible and the service was top-notch.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r2',
    rating: 4,
    comment: 'Great value for money. Will definitely come back!',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r3',
    rating: 5,
    comment: 'Perfect for a date night. The atmosphere was romantic and the food was delicious.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

