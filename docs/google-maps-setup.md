# Google Maps Places API Setup

This document explains how to set up Google Maps Places API for address autocomplete functionality.

## Prerequisites

1. Google Cloud Platform account
2. Billing enabled on your GCP project

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

### 2. Enable Places API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click on "Places API" and enable it
4. Also enable "Maps JavaScript API" if not already enabled

### 3. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to specific APIs and domains for security

### 4. Configure Environment Variables

Add the following to your environment variables:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key-here"
```

For Vercel deployment:
```bash
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

### 5. Test the Integration

The address autocomplete will automatically work on:
- Merchant signup form (address field)
- Merchant venue creation form
- Any other forms using the `AddressAutocomplete` component

## Features

- **Address Autocomplete**: Real-time address suggestions as you type
- **Address Parsing**: Automatically fills city, state, and ZIP code fields
- **Geocoding**: Provides latitude/longitude coordinates
- **International Support**: Works with addresses worldwide

## Usage

```tsx
import { AddressAutocomplete, parseAddressComponents } from '@/components/ui/AddressAutocomplete';

<AddressAutocomplete
  value={address}
  onChange={(address) => setAddress(address)}
  onAddressSelect={(place) => {
    // Handle selected address
    const parsed = parseAddressComponents(place.address_components);
    setCity(parsed.city);
    setState(parsed.state);
    setZipCode(parsed.zipCode);
  }}
  placeholder="Enter your address"
  required
/>
```

## Security Notes

- Restrict your API key to specific domains in production
- Monitor API usage to avoid unexpected charges
- Consider implementing rate limiting for address autocomplete requests

## Troubleshooting

### Common Issues

1. **"Google Maps API key not found"**
   - Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in environment variables
   - Check that the API key is correctly copied (no extra spaces)

2. **"Places API not enabled"**
   - Enable Places API in Google Cloud Console
   - Wait a few minutes for the API to propagate

3. **"Quota exceeded"**
   - Check your Google Cloud billing and quotas
   - Consider implementing caching for repeated addresses

### Debug Mode

To debug address autocomplete issues, check the browser console for Google Maps API errors.
