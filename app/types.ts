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
  inPersonOnly: boolean; // Changed from dineInOnly to be more inclusive
  tags: string[];
  venue: {
    id: string;
    name: string;
    slug: string;
    address: string;
    latitude: number;
    longitude: number;
    businessType: string[]; // Changed from cuisine to businessType
    priceTier: string;
    rating: number;
    photos: string[];
  };
}

export interface Filters {
  distance: number;
  minPercentOff: number;
  businessType: string; // Changed from cuisine to businessType
  sortBy: 'ending-soon' | 'percent-off' | 'distance';
}

