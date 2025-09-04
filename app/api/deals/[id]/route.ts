import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    // Mock deal data - replace with actual database query
    const mockDeals: Record<string, any> = {
      '1': {
        id: '1',
        title: 'Happy Hour Special',
        description: '50% off all drinks and appetizers during our quiet hours. Perfect for unwinding after work with friends.',
        percentOff: 50,
        originalPrice: 25,
        discountedPrice: 12.50,
        venue: {
          id: 'venue-1',
          name: 'The Golden Spoon',
          address: '123 Main St, Downtown, NY 10001',
          phone: '(555) 123-4567',
          rating: 4.7,
          cuisine: 'American',
          distance: '0.3 mi',
          hours: 'Mon-Fri: 11AM-10PM, Sat-Sun: 10AM-11PM',
          photos: [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
          ]
        },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '10:00 PM',
        terms: 'Valid Monday-Friday 3PM-6PM. Cannot be combined with other offers. One per table. Subject to availability.',
        validUntil: 'December 31, 2025'
      },
      '2': {
        id: '2',
        title: 'Lunch Rush Relief',
        description: '30% off lunch entrees when we need to fill tables. Fresh ingredients, great prices.',
        percentOff: 30,
        originalPrice: 20,
        discountedPrice: 14,
        venue: {
          id: 'venue-2',
          name: 'Bella Vista',
          address: '456 Oak Ave, Midtown, NY 10002',
          phone: '(555) 234-5678',
          rating: 4.4,
          cuisine: 'Italian',
          distance: '0.8 mi',
          hours: 'Daily: 11AM-10PM',
          photos: [
            'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
          ]
        },
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '2:00 PM',
        terms: 'Valid Monday-Friday 11AM-2PM. Excludes weekends and holidays. Cannot be combined with other offers.',
        validUntil: 'December 31, 2025'
      },
      '3': {
        id: '3',
        title: 'Dinner for Two',
        description: '25% off dinner for two during our slowest hours. Perfect for a romantic evening.',
        percentOff: 25,
        originalPrice: 80,
        discountedPrice: 60,
        venue: {
          id: 'venue-3',
          name: 'Le Petit Bistro',
          address: '789 Pine St, Uptown, NY 10003',
          phone: '(555) 345-6789',
          rating: 4.9,
          cuisine: 'French',
          distance: '1.2 mi',
          hours: 'Tue-Sun: 5PM-11PM, Closed Mondays',
          photos: [
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
          ]
        },
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '9:00 PM',
        terms: 'Valid Tuesday-Thursday 5PM-7PM. Must order for two people. Cannot be combined with other offers.',
        validUntil: 'December 31, 2025'
      },
      '4': {
        id: '4',
        title: 'Late Night Bites',
        description: '40% off late night menu items. Perfect for night owls and late workers.',
        percentOff: 40,
        originalPrice: 15,
        discountedPrice: 9,
        venue: {
          id: 'venue-4',
          name: 'Midnight Diner',
          address: '321 Elm St, Night District, NY 10004',
          phone: '(555) 456-7890',
          rating: 4.2,
          cuisine: 'Comfort Food',
          distance: '0.6 mi',
          hours: '24/7',
          photos: [
            'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
          ]
        },
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '2:00 AM',
        terms: 'Valid daily 10PM-2AM. Late night menu only. Cannot be combined with other offers.',
        validUntil: 'December 31, 2025'
      },
      '5': {
        id: '5',
        title: 'Brunch Boost',
        description: '35% off brunch items on slow weekend mornings. Start your day right.',
        percentOff: 35,
        originalPrice: 18,
        discountedPrice: 11.70,
        venue: {
          id: 'venue-5',
          name: 'Sunny Side Up',
          address: '555 Sunrise Blvd, Eastside, NY 10005',
          phone: '(555) 567-8901',
          rating: 4.6,
          cuisine: 'Breakfast',
          distance: '1.0 mi',
          hours: 'Daily: 7AM-3PM',
          photos: [
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
          ]
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '11:00 AM',
        terms: 'Valid Saturday-Sunday 7AM-11AM. Brunch menu only. Cannot be combined with other offers.',
        validUntil: 'December 31, 2025'
      },
      '6': {
        id: '6',
        title: 'Cocktail Hour',
        description: 'Buy one get one free on all cocktails. Perfect for happy hour with friends.',
        percentOff: 50,
        originalPrice: 16,
        discountedPrice: 8,
        venue: {
          id: 'venue-6',
          name: 'The Mixing Room',
          address: '777 Bar St, Entertainment District, NY 10006',
          phone: '(555) 678-9012',
          rating: 4.8,
          cuisine: 'Cocktails',
          distance: '0.4 mi',
          hours: 'Mon-Thu: 4PM-12AM, Fri-Sat: 4PM-2AM, Sun: 4PM-10PM',
          photos: [
            'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
          ]
        },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '8:00 PM',
        terms: 'Valid Monday-Friday 4PM-8PM. Cocktails only. Cannot be combined with other offers.',
        validUntil: 'December 31, 2025'
      }
    };

    const deal = mockDeals[dealId];

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deal);

  } catch (error) {
    console.error('Deal API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}