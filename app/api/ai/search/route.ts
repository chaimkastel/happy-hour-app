import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

// Force dynamic rendering for AI search API
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { query, userPreferences } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get all deals from database
    const deals = await prisma.deal.findMany({
      where: { status: 'ACTIVE' },
      include: { venue: true },
      take: 50
    });

    // Transform deals for AI processing
    const transformedDeals = deals.map((deal: any) => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      percentOff: deal.percentOff,
      cuisine: 'Restaurant',
      venueName: deal.venue?.name || 'Restaurant',
      address: deal.venue?.address || '',
      rating: deal.venue?.rating || 4.0,
      priceTier: deal.venue?.priceTier || 'MID_RANGE',
      tags: deal.conditions ? JSON.parse(deal.conditions as string) : [],
      maxRedemptions: deal.maxRedemptions,
      redeemedCount: 0
    }));

    // AI-powered search and ranking logic
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    const scoredDeals = transformedDeals.map(deal => {
      let score = 0;
      const dealText = `${deal.title} ${deal.description} ${deal.cuisine} ${deal.venueName} ${deal.tags.join(' ')}`.toLowerCase();
      
      // Exact title match (highest priority)
      if (deal.title.toLowerCase().includes(query.toLowerCase())) {
        score += 100;
      }
      
      // Description match
      if (deal.description.toLowerCase().includes(query.toLowerCase())) {
        score += 50;
      }
      
      // Cuisine match
      if (deal.cuisine.toLowerCase().includes(query.toLowerCase())) {
        score += 40;
      }
      
      // Venue name match
      if (deal.venueName.toLowerCase().includes(query.toLowerCase())) {
        score += 30;
      }
      
      // Tag matches
      deal.tags.forEach((tag: string) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          score += 20;
        }
      });
      
      // Word-by-word matching
      searchTerms.forEach(term => {
        if (dealText.includes(term)) {
          score += 10;
        }
      });
      
      // Boost popular deals
      if (deal.redeemedCount > 0) {
        score += Math.min(deal.redeemedCount * 2, 20);
      }
      
      // Boost high discounts
      if (deal.percentOff >= 50) {
        score += 15;
      } else if (deal.percentOff >= 30) {
        score += 10;
      }
      
      // Boost high-rated venues
      if (deal.rating >= 4.5) {
        score += 10;
      } else if (deal.rating >= 4.0) {
        score += 5;
      }
      
      return { ...deal, score };
    });

    // Sort by score and filter out zero-score deals
    const rankedDeals = scoredDeals
      .filter(deal => deal.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // Generate AI insights
    const insights = generateInsights(rankedDeals, query);
    
    // Generate smart suggestions
    const suggestions = generateSuggestions(query, transformedDeals);

    return NextResponse.json({
      deals: rankedDeals,
      insights,
      suggestions,
      total: rankedDeals.length,
      query: query
    });

  } catch (error) {
    console.error('AI Search error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI search', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateInsights(deals: any[], query: string): string[] {
  const insights = [];
  
  if (deals.length === 0) {
    insights.push("No deals found matching your search. Try broader terms like 'pizza', 'sushi', or 'happy hour'.");
    return insights;
  }
  
  const avgDiscount = deals.reduce((sum, deal) => sum + deal.percentOff, 0) / deals.length;
  const topCuisine = deals.reduce((acc, deal) => {
    acc[deal.cuisine] = (acc[deal.cuisine] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonCuisine = Object.entries(topCuisine).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
  
  insights.push(`Found ${deals.length} amazing deals with an average discount of ${Math.round(avgDiscount)}%`);
  
  if (mostCommonCuisine) {
    insights.push(`Most popular cuisine in your results: ${mostCommonCuisine}`);
  }
  
  const highDiscountDeals = deals.filter(deal => deal.percentOff >= 50);
  if (highDiscountDeals.length > 0) {
    insights.push(`${highDiscountDeals.length} deals with 50%+ discounts available!`);
  }
  
  const popularDeals = deals.filter(deal => deal.redeemedCount > 0);
  if (popularDeals.length > 0) {
    insights.push(`${popularDeals.length} deals are already popular with other customers`);
  }
  
  return insights;
}

function generateSuggestions(query: string, allDeals: any[]): string[] {
  const suggestions = [];
  const queryLower = query.toLowerCase();
  
  // Cuisine suggestions
  const cuisines = [...new Set(allDeals.map(deal => deal.cuisine))];
  const matchingCuisines = cuisines.filter(cuisine => 
    cuisine.toLowerCase().includes(queryLower) || queryLower.includes(cuisine.toLowerCase())
  );
  
  if (matchingCuisines.length > 0) {
    suggestions.push(`Try searching for "${matchingCuisines[0]}" specifically`);
  }
  
  // Popular search terms
  const popularTerms = ['happy hour', 'lunch', 'dinner', 'brunch', 'pizza', 'sushi', 'italian', 'mexican', 'chinese'];
  const matchingTerms = popularTerms.filter(term => 
    term.includes(queryLower) || queryLower.includes(term)
  );
  
  if (matchingTerms.length > 0) {
    suggestions.push(`Popular searches include "${matchingTerms[0]}"`);
  }
  
  // Discount-based suggestions
  if (queryLower.includes('cheap') || queryLower.includes('budget')) {
    suggestions.push('Look for deals with 40%+ discounts for the best value');
  }
  
  if (queryLower.includes('fancy') || queryLower.includes('upscale')) {
    suggestions.push('Check out restaurants with 4+ star ratings');
  }
  
  return suggestions.slice(0, 3);
}
