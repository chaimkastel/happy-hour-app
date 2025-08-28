export interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  status: string;
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  redeemedCount: number;
  minSpend?: number;
  inPersonOnly: boolean;
  tags: string[];
  venue: {
    id: string;
    name: string;
    slug: string;
    address: string;
    latitude: number;
    longitude: number;
    businessType: string[];
    priceTier: string;
    rating: number;
    photos: string[];
  };
}

export interface Filters {
  distance: number;
  minPercentOff: number;
  businessType: string;
  openNow: boolean;
  sortBy: 'ending-soon' | 'percent-off' | 'distance';
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'USER' | 'MERCHANT' | 'ADMIN';
  walletCardId?: string;
  preferredCities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  abnOrEIN?: string;
  payoutAccountId?: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: User;
  venues: Venue[];
}

export interface Venue {
  id: string;
  merchantId: string;
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  businessType: string[];
  priceTier: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
  hours: Record<string, any>;
  rating?: number;
  photos: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  merchant: Merchant;
  deals: Deal[];
}

export interface Redemption {
  id: string;
  userId: string;
  dealId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  redeemedAt: string;
  expiresAt: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  deal: Deal;
}

export interface WalletCard {
  id: string;
  userId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  balance: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Settlement {
  id: string;
  merchantId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  merchant: Merchant;
}

export interface DynamicPricingHint {
  id: string;
  venueId: string;
  type: 'QUIET_TIME' | 'WEATHER' | 'EVENT' | 'COMPETITION';
  description: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  validFrom: string;
  validTo: string;
  createdAt: string;
  updatedAt: string;
  venue: Venue;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'DEAL_ALERT' | 'PAYMENT' | 'SYSTEM' | 'PROMOTION';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Review {
  id: string;
  userId: string;
  dealId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  deal: Deal;
}

export interface SearchResult {
  deals: Deal[];
  total: number;
  filters: Filters;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface DistanceFilter {
  location: Location;
  radius: number; // in kilometers
}

export interface TimeFilter {
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}

export interface PriceFilter {
  minPrice?: number;
  maxPrice?: number;
  priceTier?: string[];
}

export interface CuisineFilter {
  cuisines: string[];
  exclude?: string[];
}

export interface DealFilters {
  distance?: DistanceFilter;
  time?: TimeFilter;
  price?: PriceFilter;
  cuisine?: CuisineFilter;
  tags?: string[];
  status?: string[];
  minPercentOff?: number;
  maxPercentOff?: number;
  openNow?: boolean;
  verifiedOnly?: boolean;
}

export interface SearchFilters extends DealFilters {
  query?: string;
  sortBy?: 'relevance' | 'distance' | 'rating' | 'price' | 'newest' | 'ending-soon';
  pagination?: PaginationParams;
}

export interface DealStats {
  totalDeals: number;
  activeDeals: number;
  totalRedemptions: number;
  averageRating: number;
  totalVenues: number;
  totalMerchants: number;
}

export interface UserStats {
  totalRedemptions: number;
  totalSavings: number;
  favoriteCuisines: string[];
  averageRating: number;
  streakDays: number;
  points: number;
  badges: string[];
}

export interface MerchantStats {
  totalVenues: number;
  totalDeals: number;
  totalRedemptions: number;
  totalRevenue: number;
  averageRating: number;
  activeDeals: number;
}

export interface AnalyticsData {
  deals: DealStats;
  users: UserStats;
  merchants: MerchantStats;
  trends: {
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
}

export interface AppConfig {
  features: {
    darkMode: boolean;
    notifications: boolean;
    locationServices: boolean;
    socialFeatures: boolean;
    gamification: boolean;
    groupDeals: boolean;
  };
  limits: {
    maxDealsPerVenue: number;
    maxRedemptionsPerDeal: number;
    maxPhotosPerVenue: number;
    maxTagsPerDeal: number;
  };
  settings: {
    defaultRadius: number;
    defaultCurrency: string;
    timezone: string;
    language: string;
  };
}

