'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Filter, Heart, Star, Clock, Users, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

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
}

interface FilterState {
  category: string;
  priceRange: string;
  distance: number;
  timeWindow: string;
  isOpen: boolean;
}

// Mock data with more sophisticated structure
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
    validUntil: '7:00 PM'
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
    validUntil: '3:00 PM'
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
    validUntil: '10:00 PM'
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
    validUntil: '2:00 PM'
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
    validUntil: '2:00 AM'
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
    validUntil: '8:00 PM'
  }
];

// Sophisticated Mobile Header Component
const MobileHeader = ({ onSearchClick, onFilterClick }: { onSearchClick: () => void; onFilterClick: () => void }) => (
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
          onClick={onSearchClick}
          style={{ 
            padding: '8px', 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Search size={18} color="#6b7280" />
        </button>
        <button 
          onClick={onFilterClick}
          style={{ 
            padding: '8px', 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <SlidersHorizontal size={18} color="#6b7280" />
        </button>
          </div>
        </div>
    
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
      <MapPin size={16} color="#64748b" />
      <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Brooklyn, New York</span>
      <ChevronDown size={16} color="#94a3b8" />
    </div>
      </div>
    );

// Sophisticated Deal Card Component
const DealCard = ({ deal, onFavorite, isFavorited }: { deal: Deal; onFavorite: (id: string) => void; isFavorited: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{ 
        backgroundColor: 'white', 
        padding: '16px', 
        marginBottom: '16px', 
        borderRadius: '16px', 
        boxShadow: isHovered ? '0 10px 25px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with category and favorite */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(deal.id);
          }}
          style={{ 
            padding: '4px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart 
            size={20} 
            color={isFavorited ? "#ef4444" : "#9ca3af"} 
            fill={isFavorited ? "#ef4444" : "none"}
          />
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
            <MapPin size={12} color="#9ca3af" />
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
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{deal.rating}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
          <Clock size={12} color="#9ca3af" />
          <span style={{ fontWeight: '500' }}>
            {deal.isOpen ? `Open until ${deal.validUntil}` : 'Closed'}
          </span>
        </div>
        <button style={{ 
          backgroundColor: '#f97316', 
          color: 'white', 
          fontSize: '12px', 
          fontWeight: '600', 
          padding: '8px 16px', 
          borderRadius: '20px', 
          border: 'none', 
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(249, 115, 22, 0.3)'
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
  );
};

// Sophisticated Filters Bottom Sheet
const FiltersBottomSheet = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  filters: FilterState; 
  onFiltersChange: (filters: FilterState) => void;
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            style={{ 
              padding: '4px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
            Category
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Food', 'Drinks', 'Brunch'].map((category) => (
              <button
                key={category}
                onClick={() => onFiltersChange({ ...filters, category })}
                style={{
                  padding: '8px 12px',
                  backgroundColor: filters.category === category ? '#3b82f6' : '#f3f4f6',
                  color: filters.category === category ? 'white' : '#374151',
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
                
        {/* Distance Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
            Distance: {filters.distance} miles
          </label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={filters.distance}
            onChange={(e) => onFiltersChange({ ...filters, distance: parseFloat(e.target.value) })}
            style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: '#e5e7eb' }}
          />
                  </div>
                  
        {/* Time Window Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
            Time Window
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Now', '3-6 PM', '6-9 PM', '9-11 PM'].map((time) => (
              <button
                key={time}
                onClick={() => onFiltersChange({ ...filters, timeWindow: time })}
                style={{
                  padding: '8px 12px',
                  backgroundColor: filters.timeWindow === time ? '#3b82f6' : '#f3f4f6',
                  color: filters.timeWindow === time ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {time}
                    </button>
            ))}
          </div>
      </div>

        {/* Open Now Toggle */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.isOpen}
              onChange={(e) => onFiltersChange({ ...filters, isOpen: e.target.checked })}
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Open now only</span>
          </label>
            </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => onFiltersChange({ category: 'All', priceRange: 'All', distance: 5, timeWindow: 'Now', isOpen: false })}
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
            onClick={onClose}
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
  );
};

// Sophisticated Bottom Navigation
const MobileBottomNav = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'search', label: 'Search', icon: MapPin },
    { id: 'wallet', label: 'Wallet', icon: Users },
    { id: 'account', label: 'Account', icon: Users }
  ];

  return (
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
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
                <button 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px', 
                color: isActive ? '#f97316' : '#9ca3af', 
                backgroundColor: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: isActive ? '28px' : '24px', 
                height: isActive ? '28px' : '24px', 
                backgroundColor: isActive ? '#fed7aa' : 'transparent', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={isActive ? 18 : 16} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: isActive ? '600' : '400' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
                  </div>
  );
};

// Main Mobile Page Component
export default function MobilePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(mockDeals);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('explore');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: 'All',
    distance: 5,
    timeWindow: 'Now',
    isOpen: false
  });

  // Filter deals based on current filters
  useEffect(() => {
    let filtered = deals;

    if (filters.category !== 'All') {
      filtered = filtered.filter(deal => deal.category === filters.category);
    }

    if (filters.isOpen) {
      filtered = filtered.filter(deal => deal.isOpen);
    }

    // Filter by distance (simplified - in real app would use actual coordinates)
    const maxDistance = filters.distance;
    filtered = filtered.filter(deal => {
      const distance = parseFloat(deal.distance);
      return distance <= maxDistance;
    });

    setFilteredDeals(filtered);
  }, [deals, filters]);

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

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '16px',
      paddingBottom: '100px' // Space for bottom nav
    }}>
      {/* Header */}
      <MobileHeader 
        onSearchClick={() => setShowSearch(true)} 
        onFilterClick={() => setShowFilters(true)} 
      />

      {/* Content */}
                  <div>
        {/* Results Header */}
        <div style={{ marginBottom: '16px' }}>
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
            {filters.category !== 'All' && `Filtered by ${filters.category.toLowerCase()}`}
            {filters.isOpen && ' • Open now'}
          </p>
              </div>

        {/* Deals List */}
        <div>
          {filteredDeals.map((deal) => (
            <DealCard 
              key={deal.id} 
              deal={deal} 
              onFavorite={handleFavorite}
              isFavorited={favorites.has(deal.id)}
            />
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
              Try adjusting your filters to see more results
            </p>
                <button 
              onClick={() => setShowFilters(true)}
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
              Adjust Filters
                </button>
          </div>
        )}
        </div>

      {/* Filters Bottom Sheet */}
      <FiltersBottomSheet 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}