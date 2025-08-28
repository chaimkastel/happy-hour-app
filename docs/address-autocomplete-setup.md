# Address Autocomplete Setup Guide

## Overview

The AddressAutocomplete component provides intelligent address input with Google Places API integration. It offers type-ahead suggestions, structured address parsing, and comprehensive accessibility support.

## Setup Requirements

### 1. Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Add the key to your environment variables:

```bash
GOOGLE_PLACES_API_KEY="your-api-key-here"
```

### 2. API Endpoints

The component uses two API endpoints:

- `/api/address/autocomplete` - For address suggestions
- `/api/address/details` - For detailed address information

Both endpoints are already implemented and handle:
- Rate limiting
- Error handling
- Input validation
- Security headers

## Usage

### Basic Implementation

```tsx
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { AddressData } from '@/types/address';

function MyComponent() {
  const [address, setAddress] = useState('');

  const handleAddressChange = (addressData: AddressData) => {
    console.log('Selected address:', addressData);
    setAddress(addressData.formatted);
  };

  return (
    <AddressAutocomplete
      value={address}
      onChange={handleAddressChange}
      placeholder="Enter your address..."
      required
    />
  );
}
```

### Advanced Configuration

```tsx
<AddressAutocomplete
  value={address}
  onChange={handleAddressChange}
  placeholder="Start typing your address..."
  required
  disabled={false}
  className="w-full"
  onError={(error) => console.error('Address error:', error)}
  onLoadingChange={(loading) => setLoading(loading)}
/>
```

## Features

### ✅ Implemented Features

- **Type-ahead suggestions** with 300ms debounce
- **Keyboard navigation** (Arrow keys, Enter, Escape)
- **Screen reader support** with proper ARIA attributes
- **Error handling** with user-friendly messages
- **Loading states** with visual indicators
- **Click outside to close** functionality
- **Address validation** and structured data parsing
- **Mobile-friendly** with touch targets ≥44px
- **Rate limiting** protection
- **Security headers** and input sanitization

### 🔧 Technical Details

- **Provider**: Google Places API
- **Debounce**: 300ms delay for API calls
- **Accessibility**: WCAG 2.1 AA compliant
- **Mobile**: Touch-optimized with scroll lock
- **Error Recovery**: Graceful fallback to manual entry
- **Performance**: AbortController for request cancellation

## Data Structure

The component returns structured address data:

```typescript
interface AddressData {
  formatted: string;           // "123 Main St, New York, NY 10001, USA"
  components: {
    street1: string;          // "123 Main St"
    street2?: string;         // "Apt 4B" (optional)
    city: string;             // "New York"
    state: string;            // "NY"
    postalCode: string;       // "10001"
    country: string;          // "US"
  };
  coordinates: {
    lat: number;              // 40.7128
    lng: number;              // -74.0060
  };
  placeId: string;            // Google Places ID
}
```

## Testing

Run the test suite:

```bash
npm test AddressAutocomplete
```

Tests cover:
- Component rendering
- User interactions
- API integration
- Error handling
- Accessibility features
- Keyboard navigation

## Security Considerations

1. **API Key Protection**: Store in environment variables
2. **Rate Limiting**: Implemented at API level
3. **Input Validation**: All inputs are sanitized
4. **CORS**: Proper headers set
5. **Error Handling**: No sensitive data exposed

## Cost Management

Google Places API pricing (as of 2024):
- Autocomplete: $2.83 per 1,000 requests
- Place Details: $3.00 per 1,000 requests

**Recommendations**:
- Implement caching for repeated addresses
- Use rate limiting to prevent abuse
- Monitor usage in Google Cloud Console
- Consider Mapbox Places as alternative (cheaper)

## Troubleshooting

### Common Issues

1. **"Address service not configured"**
   - Check GOOGLE_PLACES_API_KEY environment variable
   - Verify API key has Places API enabled

2. **"Failed to load address suggestions"**
   - Check network connectivity
   - Verify API key permissions
   - Check rate limiting

3. **Suggestions not appearing**
   - Ensure input is at least 3 characters
   - Check browser console for errors
   - Verify API quota not exceeded

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will log API requests and responses to the console.

## Future Enhancements

- [ ] Caching layer for repeated addresses
- [ ] Support for international addresses
- [ ] Batch address validation
- [ ] Offline fallback mode
- [ ] Custom styling themes
- [ ] Integration with other providers (Mapbox, Algolia)
