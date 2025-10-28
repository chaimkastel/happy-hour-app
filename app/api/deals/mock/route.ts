import { NextResponse } from 'next/server';

// Mock deals with real Unsplash images for testing the UI
const mockDeals = [
  {
    id: 'deal_1',
    title: 'Happy Hour Craft Cocktails',
    description: '50% off all craft cocktails and wine by the glass during happy hour',
    percentOff: 50,
    originalPrice: 1800,
    discountedPrice: 900,
    startAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Started 2 hours ago
    endAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Ends in 2 hours
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Brooklyn Bistro',
      address: '456 Atlantic Ave',
      city: 'Brooklyn',
      state: 'NY',
      rating: 4.7,
      businessType: ['Italian', 'Restaurant']
    }
  },
  {
    id: 'deal_2',
    title: 'Happy Hour Pizza Special',
    description: '50% off wood-fired pizzas and $5 craft beer',
    percentOff: 50,
    originalPrice: 2400,
    discountedPrice: 1200,
    startAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Pizza Paradise',
      address: '789 Flatbush Ave',
      city: 'Brooklyn',
      state: 'NY',
      rating: 4.5,
      businessType: ['Pizza', 'Italian']
    }
  },
  {
    id: 'deal_3',
    title: 'Sushi Night Special',
    description: '40% off all sushi rolls and sake flights',
    percentOff: 40,
    originalPrice: 3000,
    discountedPrice: 1800,
    startAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Sakura Sushi',
      address: '234 5th Ave',
      city: 'Manhattan',
      state: 'NY',
      rating: 4.8,
      businessType: ['Sushi', 'Japanese']
    }
  },
  {
    id: 'deal_4',
    title: 'Wings & Beer Deal',
    description: 'Buy one get one half off all wings and craft beers',
    percentOff: 50,
    originalPrice: 1600,
    discountedPrice: 800,
    startAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd4?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'The Sports Bar',
      address: '123 Main St',
      city: 'Brooklyn',
      state: 'NY',
      rating: 4.3,
      businessType: ['Burgers', 'American']
    }
  },
  {
    id: 'deal_5',
    title: 'Brunch Special',
    description: '30% off entire brunch menu including bottomless mimosas',
    percentOff: 30,
    originalPrice: 2200,
    discountedPrice: 1540,
    startAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1526318890-1c15d6cccba4?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Cafe Benedict',
      address: '567 Park Ave',
      city: 'Brooklyn',
      state: 'NY',
      rating: 4.6,
      businessType: ['Brunch', 'Cafe']
    }
  },
  {
    id: 'deal_6',
    title: 'Taco Tuesday Madness',
    description: 'All tacos $2 each and margaritas $5',
    percentOff: 40,
    originalPrice: 2000,
    discountedPrice: 1200,
    startAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Taco Diablo',
      address: '890 Grand St',
      city: 'Brooklyn',
      state: 'NY',
      rating: 4.9,
      businessType: ['Mexican', 'Latin']
    }
  },
  {
    id: 'deal_7',
    title: 'Burger Special',
    description: 'All burgers 40% off with fries and a drink',
    percentOff: 40,
    originalPrice: 1400,
    discountedPrice: 840,
    startAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Burger Junction',
      address: '321 Washington Ave',
      city: 'Brooklyn',
      state: 'NY',
      rating: 4.4,
      businessType: ['Burgers', 'American']
    }
  },
  {
    id: 'deal_8',
    title: 'Thai Curry Special',
    description: '30% off all curries and $3 Thai tea',
    percentOff: 30,
    originalPrice: 1800,
    discountedPrice: 1260,
    startAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop&q=80',
    venue: {
      name: 'Thai Garden',
      address: '654 Amsterdam Ave',
      city: 'Manhattan',
      state: 'NY',
      rating: 4.9,
      businessType: ['Thai', 'Asian']
    }
  }
];

export async function GET() {
  return NextResponse.json({ deals: mockDeals });
}

