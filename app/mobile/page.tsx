'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
  };
  distance: string;
  rating: number;
  isOpen: boolean;
  category: string;
  imageUrl?: string;
  validUntil?: string;
  featured?: boolean;
  priceRange?: string;
  cuisine?: string;
}

interface FilterState {
  categories: string[];
  priceRange: string;
  distance: number;
  timeWindow: string;
  isOpen: boolean;
  sortBy: string;
}

// Enhanced mock data
const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Happy Hour Special',
    description: '50% off all drinks and appetizers during happy hour',
    percentOff: 50,
    venue: {
      name: 'The Local Pub',
      address: '123 Main St, Downtown'
    },
    distance: '0.3 mi',
    rating: 4.5,
    isOpen: true,
    category: 'Drinks',
    validUntil: '7:00 PM',
    featured: true,
    priceRange: '$$',
    cuisine: 'American'
  },
  {
    id: '2',
    title: 'Lunch Deal',
    description: '30% off lunch entrees and sides',
    percentOff: 30,
    venue: {
      name: 'Bella Vista',
      address: '456 Oak Ave, Midtown'
    },
    distance: '0.7 mi',
    rating: 4.2,
    isOpen: true,
    category: 'Food',
    validUntil: '3:00 PM',
    priceRange: '$$$',
    cuisine: 'Italian'
  },
  {
    id: '3',
    title: 'Dinner Special',
    description: 'Buy one get one free on select entrees',
    percentOff: 50,
    venue: {
      name: 'Spice Garden',
      address: '789 Pine St, Uptown'
    },
    distance: '1.2 mi',
    rating: 4.8,
    isOpen: false,
    category: 'Food',
    validUntil: '10:00 PM',
    priceRange: '$$',
    cuisine: 'Indian'
  },
  {
    id: '4',
    title: 'Weekend Brunch',
    description: '25% off brunch items and bottomless mimosas',
    percentOff: 25,
    venue: {
      name: 'Sunrise Cafe',
      address: '321 Elm St, Riverside'
    },
    distance: '0.9 mi',
    rating: 4.3,
    isOpen: true,
    category: 'Brunch',
    validUntil: '2:00 PM',
    priceRange: '$$',
    cuisine: 'American'
  },
  {
    id: '5',
    title: 'Late Night Bites',
    description: '40% off late night menu after 10pm',
    percentOff: 40,
    venue: {
      name: 'Midnight Diner',
      address: '654 Maple Ave, Eastside'
    },
    distance: '1.5 mi',
    rating: 4.1,
    isOpen: true,
    category: 'Food',
    validUntil: '2:00 AM',
    priceRange: '$',
    cuisine: 'Diner'
  },
  {
    id: '6',
    title: 'Cocktail Hour',
    description: 'Premium cocktails at happy hour prices',
    percentOff: 35,
    venue: {
      name: 'Sky Lounge',
      address: '999 High St, Skyline'
    },
    distance: '2.1 mi',
    rating: 4.7,
    isOpen: true,
    category: 'Drinks',
    validUntil: '8:00 PM',
    priceRange: '$$$',
    cuisine: 'Cocktail Bar'
  },
  {
    id: '7',
    title: 'Sushi Special',
    description: 'All-you-can-eat sushi for $25',
    percentOff: 40,
    venue: {
      name: 'Sakura Sushi',
      address: '555 Cherry Blossom Way'
    },
    distance: '0.8 mi',
    rating: 4.6,
    isOpen: true,
    category: 'Food',
    validUntil: '9:00 PM',
    priceRange: '$$',
    cuisine: 'Japanese'
  },
  {
    id: '8',
    title: 'Taco Tuesday',
    description: '2-for-1 tacos and $5 margaritas',
    percentOff: 50,
    venue: {
      name: 'Cantina Loca',
      address: '777 Fiesta Blvd'
    },
    distance: '1.3 mi',
    rating: 4.4,
    isOpen: true,
    category: 'Food',
    validUntil: '11:00 PM',
    priceRange: '$',
    cuisine: 'Mexican'
  }
];

export default function MobilePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(mockDeals);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState("Brooklyn, New York");
  const [filters, setFilters] = useState<FilterState>({
    categories: ['All'],
    priceRange: 'All',
    distance: 5,
    timeWindow: 'Now',
    isOpen: false,
    sortBy: 'distance'
  });

  // Filter and sort deals
  useEffect(() => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(query) ||
        deal.description.toLowerCase().includes(query) ||
        deal.venue.name.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query) ||
        deal.cuisine?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (!filters.categories.includes('All')) {
      filtered = filtered.filter(deal => filters.categories.includes(deal.category));
    }

    // Price range filter
    if (filters.priceRange !== 'All') {
      filtered = filtered.filter(deal => deal.priceRange === filters.priceRange);
    }

    // Open now filter
    if (filters.isOpen) {
      filtered = filtered.filter(deal => deal.isOpen);
    }

    // Distance filter
    const maxDistance = filters.distance;
    filtered = filtered.filter(deal => {
      const distance = parseFloat(deal.distance);
      return distance <= maxDistance;
    });

    // Sort deals
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.percentOff - a.percentOff;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredDeals(filtered);
  }, [deals, searchQuery, filters]);

  const handleFavorite = useCallback((dealId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dealId)) {
        newFavorites.delete(dealId);
      } else {
        newFavorites.add(dealId);
      }
      return newFavorites;
    });
  }, []);

  const handleViewDeal = useCallback((dealId: string) => {
    // Navigate to deal detail page
    window.location.href = `/deal/${dealId}`;
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleCategoryToggle = (category: string) => {
    if (category === 'All') {
      setFilters(prev => ({ ...prev, categories: ['All'] }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes('All') 
          ? [category]
          : prev.categories.includes(category)
            ? prev.categories.filter(c => c !== category)
            : [...prev.categories.filter(c => c !== 'All'), category]
      }));
    }
  };

  const categories = ['All', 'Food', 'Drinks', 'Brunch'];
  const priceRanges = ['All', '$', '$$', '$$$'];
  const sortOptions = [
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Rating' },
    { value: 'discount', label: 'Discount' },
    { value: 'featured', label: 'Featured' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '16px',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px', 
        marginBottom: '16px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '24px' }}>🍺</span>
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>Happy Hour</h1>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontWeight: '500' }}>Find amazing deals</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              style={{ 
                padding: '8px', 
                backgroundColor: showSearch ? '#3b82f6' : '#f9fafb', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="18" height="18" fill="none" stroke={showSearch ? "white" : "currentColor"} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
            <button 
              type="button"
              onClick={() => setShowFilters(true)}
              style={{ 
                padding: '8px', 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {showSearch && (
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deals, restaurants, cuisines..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>
        )}
        
        {/* Location Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '8px 12px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>{currentLocation}</span>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryToggle(category)}
              style={{
                padding: '8px 16px',
                backgroundColor: filters.categories.includes(category) ? '#3b82f6' : 'white',
                color: filters.categories.includes(category) ? 'white' : '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: filters.categories.includes(category) ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort and Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {filteredDeals.length} deals near you
            </h2>
            <div style={{ 
              fontSize: '20px', 
              animation: 'bounce 2s infinite',
              display: 'inline-block'
            }}>
              🍔
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {searchQuery && `Results for "${searchQuery}"`}
            {!searchQuery && !filters.categories.includes('All') && `Filtered by ${filters.categories.join(', ').toLowerCase()}`}
            {filters.isOpen && ' • Open now'}
          </p>
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      {/* Deals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredDeals.map((deal) => (
          <div 
            key={deal.id} 
            style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: deal.featured ? '2px solid #fbbf24' : '1px solid #f3f4f6',
              position: 'relative'
            }}
          >
            {/* Featured Badge */}
            {deal.featured && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '16px',
                backgroundColor: '#fbbf24',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(251, 191, 36, 0.3)'
              }}>
                ⭐ FEATURED
              </div>
            )}

            {/* Header with category and favorite */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  backgroundColor: '#dbeafe', 
                  color: '#1e40af', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  fontSize: '11px', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {deal.category}
                </div>
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  color: '#374151', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  fontSize: '11px', 
                  fontWeight: '500'
                }}>
                  {deal.priceRange}
                </div>
                {deal.cuisine && (
                  <div style={{ 
                    backgroundColor: '#fef3c7', 
                    color: '#92400e', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    fontWeight: '500'
                  }}>
                    {deal.cuisine}
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleFavorite(deal.id)}
                style={{ 
                  padding: '4px', 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  fill={favorites.has(deal.id) ? "#ef4444" : "none"} 
                  stroke={favorites.has(deal.id) ? "#ef4444" : "#9ca3af"} 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ flex: 1, marginRight: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                  {deal.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                  {deal.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span style={{ fontWeight: '500' }}>{deal.venue.name}</span>
                  <span>•</span>
                  <span>{deal.distance}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  padding: '6px 10px', 
                  borderRadius: '8px', 
                  marginBottom: '6px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                }}>
                  {deal.percentOff}% OFF
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <svg width="14" height="14" fill="#fbbf24" stroke="#fbbf24" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{deal.rating}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span style={{ fontWeight: '500' }}>
                  {deal.isOpen ? `Open until ${deal.validUntil}` : 'Closed'}
                </span>
              </div>
              <button 
                onClick={() => handleViewDeal(deal.id)}
                style={{ 
                  backgroundColor: '#f97316', 
                  color: 'white', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f97316';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                View Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDeals.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
            No deals found
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px 0' }}>
            Try adjusting your search or filters to see more results
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({
                categories: ['All'],
                priceRange: 'All',
                distance: 5,
                timeWindow: 'Now',
                isOpen: false,
                sortBy: 'distance'
              });
            }}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Filters Bottom Sheet */}
      {showFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: '100%',
            maxHeight: '80vh',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '20px',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                style={{ 
                  padding: '4px', 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ marginBottom: '30px', maxHeight: '50vh', overflowY: 'auto' }}>
              {/* Category Filter */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Category
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: filters.categories.includes(category) ? '#3b82f6' : '#f3f4f6',
                        color: filters.categories.includes(category) ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Price Range
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {priceRanges.map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: price }))}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: filters.priceRange === price ? '#3b82f6' : '#f3f4f6',
                        color: filters.priceRange === price ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Distance: {filters.distance} miles
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={filters.distance}
                  onChange={(e) => setFilters(prev => ({ ...prev, distance: parseFloat(e.target.value) }))}
                  style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: '#e5e7eb' }}
                />
              </div>

              {/* Open Now Toggle */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.isOpen}
                    onChange={(e) => setFilters(prev => ({ ...prev, isOpen: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Open now only</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setFilters({
                  categories: ['All'],
                  priceRange: 'All',
                  distance: 5,
                  timeWindow: 'Now',
                  isOpen: false,
                  sortBy: 'distance'
                })}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  flex: 2,
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb', 
        padding: '8px 16px 12px',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#f97316', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px'
          }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              backgroundColor: '#fed7aa', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '600' }}>Explore</span>
          </button>
          <button style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#9ca3af', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px'
          }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span style={{ fontSize: '11px' }}>Favorites</span>
          </button>
          <button style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#9ca3af', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px'
          }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span style={{ fontSize: '11px' }}>Search</span>
          </button>
          <button style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#9ca3af', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px'
          }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span style={{ fontSize: '11px' }}>Wallet</span>
          </button>
          <button style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '4px', 
            color: '#9ca3af', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px'
          }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#d1d5db', borderRadius: '9999px' }}></div>
            <span style={{ fontSize: '11px' }}>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}