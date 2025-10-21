# Happy Hour API Documentation

## Overview

The Happy Hour API provides endpoints for managing deals, venues, users, and merchants. All API endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most endpoints require authentication using NextAuth.js sessions. Include the session cookie in your requests.

### Headers

```
Content-Type: application/json
Cookie: next-auth.session-token=your-session-token
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Search endpoints**: 50 requests per 15 minutes
- **General API endpoints**: 100 requests per 15 minutes
- **Upload endpoints**: 10 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Endpoints

### Authentication

#### POST /api/auth/signup

Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

#### POST /api/auth/verify-email

Verify user email address.

**Request Body:**
```json
{
  "token": "verification_token"
}
```

### Deals

#### GET /api/deals/search

Search for deals with optional filters.

**Query Parameters:**
- `q` (string, optional) - Search query
- `location` (string, optional) - Location filter
- `limit` (number, optional) - Number of results (default: 20, max: 100)
- `offset` (number, optional) - Pagination offset (default: 0)

**Response:**
```json
{
  "deals": [
    {
      "id": "deal_id",
      "type": "HAPPY_HOUR",
      "title": "Happy Hour Special",
      "description": "50% off all drinks",
      "percentOff": 50,
      "originalPrice": 1000,
      "discountedPrice": 500,
      "startsAt": "2024-01-01T17:00:00Z",
      "endsAt": "2024-01-01T19:00:00Z",
      "conditions": ["Valid Monday-Friday"],
      "maxRedemptions": 100,
      "perUserLimit": 1,
      "priority": 1,
      "venue": {
        "id": "venue_id",
        "name": "Restaurant Name",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "rating": 4.5,
        "photos": ["photo_url"]
      },
      "vouchersCount": 25,
      "favoritesCount": 10
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

#### POST /api/deals/[id]/claim

Claim a deal and create a voucher.

**Response:**
```json
{
  "success": true,
  "voucher": {
    "id": "voucher_id",
    "code": "ABC123",
    "status": "CLAIMED",
    "expiresAt": "2024-01-08T23:59:59Z",
    "deal": {
      "id": "deal_id",
      "title": "Happy Hour Special",
      "venue": {
        "name": "Restaurant Name",
        "address": "123 Main St"
      }
    }
  }
}
```

### Venues

#### GET /api/venues

Get list of venues.

**Query Parameters:**
- `city` (string, optional) - Filter by city
- `state` (string, optional) - Filter by state
- `limit` (number, optional) - Number of results (default: 20)
- `offset` (number, optional) - Pagination offset (default: 0)

**Response:**
```json
{
  "venues": [
    {
      "id": "venue_id",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "rating": 4.5,
      "reviewCount": 150,
      "photos": ["photo_url"],
      "hours": {
        "monday": "9:00 AM - 10:00 PM",
        "tuesday": "9:00 AM - 10:00 PM"
      },
      "priceTier": "MID_RANGE",
      "cuisineType": "American",
      "isActive": true,
      "isApproved": true
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

### Merchants

#### GET /api/merchant/dashboard

Get merchant dashboard data.

**Response:**
```json
{
  "merchant": {
    "id": "merchant_id",
    "companyName": "Restaurant Group",
    "contactEmail": "contact@restaurant.com",
    "approved": true,
    "subscriptionStatus": "ACTIVE"
  },
  "venues": [
    {
      "id": "venue_id",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "isActive": true,
      "isApproved": true,
      "deals": [
        {
          "id": "deal_id",
          "title": "Happy Hour Special",
          "active": true,
          "redeemedCount": 25
        }
      ]
    }
  ],
  "stats": {
    "totalVenues": 3,
    "totalDeals": 15,
    "totalVouchers": 250,
    "totalRevenue": 5000
  }
}
```

#### POST /api/merchant/venues

Create a new venue.

**Request Body:**
```json
{
  "name": "New Restaurant",
  "address": "456 Oak St",
  "city": "Los Angeles",
  "state": "CA",
  "zip": "90210",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "timezone": "America/Los_Angeles",
  "hours": {
    "monday": "9:00 AM - 10:00 PM",
    "tuesday": "9:00 AM - 10:00 PM"
  },
  "priceTier": "PREMIUM",
  "cuisineType": "Italian"
}
```

#### POST /api/merchant/deals

Create a new deal.

**Request Body:**
```json
{
  "venueId": "venue_id",
  "type": "HAPPY_HOUR",
  "title": "Happy Hour Special",
  "description": "50% off all drinks",
  "percentOff": 50,
  "originalPrice": 1000,
  "discountedPrice": 500,
  "startsAt": "2024-01-01T17:00:00Z",
  "endsAt": "2024-01-01T19:00:00Z",
  "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "timeWindows": [
    {
      "start": "17:00",
      "end": "19:00"
    }
  ],
  "conditions": ["Valid Monday-Friday"],
  "maxRedemptions": 100,
  "perUserLimit": 1,
  "priority": 1,
  "active": true
}
```

### Vouchers

#### GET /api/vouchers

Get user's vouchers.

**Response:**
```json
{
  "vouchers": [
    {
      "id": "voucher_id",
      "code": "ABC123",
      "status": "CLAIMED",
      "originalPrice": 1000,
      "discountedPrice": 500,
      "expiresAt": "2024-01-08T23:59:59Z",
      "redeemedAt": null,
      "deal": {
        "id": "deal_id",
        "title": "Happy Hour Special",
        "venue": {
          "name": "Restaurant Name",
          "address": "123 Main St"
        }
      }
    }
  ]
}
```

#### POST /api/vouchers/redeem

Redeem a voucher.

**Request Body:**
```json
{
  "voucherId": "voucher_id"
}
```

**Response:**
```json
{
  "success": true,
  "voucher": {
    "id": "voucher_id",
    "code": "ABC123",
    "status": "REDEEMED",
    "redeemedAt": "2024-01-01T18:30:00Z",
    "deal": {
      "id": "deal_id",
      "title": "Happy Hour Special",
      "venue": {
        "name": "Restaurant Name",
        "address": "123 Main St"
      }
    }
  }
}
```

### Favorites

#### GET /api/favorites

Get user's favorite deals.

**Response:**
```json
{
  "favorites": [
    {
      "id": "favorite_id",
      "deal": {
        "id": "deal_id",
        "title": "Happy Hour Special",
        "venue": {
          "name": "Restaurant Name",
          "address": "123 Main St"
        }
      },
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### POST /api/favorites

Add a deal to favorites.

**Request Body:**
```json
{
  "dealId": "deal_id"
}
```

#### DELETE /api/favorites

Remove a deal from favorites.

**Request Body:**
```json
{
  "dealId": "deal_id"
}
```

### Admin

#### GET /api/admin/stats

Get platform statistics (Admin only).

**Response:**
```json
{
  "totalUsers": 1000,
  "totalMerchants": 50,
  "totalVenues": 75,
  "totalDeals": 200,
  "totalVouchers": 5000,
  "activeDeals": 150,
  "pendingApprovals": 5,
  "totalRevenue": 25000,
  "systemHealth": "excellent"
}
```

#### GET /api/admin/venues

Get all venues with admin controls.

**Query Parameters:**
- `status` (string, optional) - Filter by status (all, pending, approved)
- `limit` (number, optional) - Number of results (default: 10)

**Response:**
```json
{
  "venues": [
    {
      "id": "venue_id",
      "name": "Restaurant Name",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "isApproved": true,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "merchant": {
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        }
      },
      "deals": [
        {
          "id": "deal_id",
          "title": "Happy Hour Special",
          "active": true
        }
      ],
      "_count": {
        "deals": 5,
        "vouchers": 100
      }
    }
  ]
}
```

#### PATCH /api/admin/venues

Update venue status (Admin only).

**Request Body:**
```json
{
  "venueId": "venue_id",
  "action": "approve"
}
```

**Actions:**
- `approve` - Approve venue
- `reject` - Reject venue
- `suspend` - Suspend venue
- `activate` - Activate venue

### Newsletter

#### POST /api/newsletter/subscribe

Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "source": "website"
}
```

#### DELETE /api/newsletter/subscribe

Unsubscribe from newsletter.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Health Check

#### GET /api/health

Check system health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "responseTime": 45,
  "version": "1.0.0",
  "environment": "production",
  "config": {
    "DATABASE_URL": "set",
    "NEXTAUTH_URL": "set",
    "NEXTAUTH_SECRET": "set",
    "STRIPE_SECRET_KEY": "set",
    "REDIS_URL": "set"
  }
}
```

## Webhooks

### Stripe Webhooks

#### POST /api/webhooks/stripe

Handle Stripe webhook events.

**Headers:**
```
stripe-signature: webhook_signature
```

**Supported Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

## SDK Examples

### JavaScript/TypeScript

```typescript
// Search for deals
const response = await fetch('/api/deals/search?q=pizza&location=New York', {
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'next-auth.session-token=your-session-token'
  }
});

const data = await response.json();
console.log(data.deals);

// Claim a deal
const claimResponse = await fetch('/api/deals/deal_id/claim', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': 'next-auth.session-token=your-session-token'
  }
});

const claimData = await claimResponse.json();
console.log(claimData.voucher);
```

### Python

```python
import requests

# Search for deals
response = requests.get(
    'https://your-domain.com/api/deals/search',
    params={'q': 'pizza', 'location': 'New York'},
    headers={'Cookie': 'next-auth.session-token=your-session-token'}
)

data = response.json()
print(data['deals'])

# Claim a deal
claim_response = requests.post(
    'https://your-domain.com/api/deals/deal_id/claim',
    headers={'Cookie': 'next-auth.session-token=your-session-token'}
)

claim_data = claim_response.json()
print(claim_data['voucher'])
```

## Testing

Use the provided test utilities to test API endpoints:

```typescript
import { testFactories, testUtils } from '@/lib/test-utils';

// Create test data
const user = await testFactories.createUser();
const merchant = await testFactories.createMerchant();
const venue = await testFactories.createVenue();
const deal = await testFactories.createDeal();

// Test API endpoints
const response = await fetch('/api/deals/search');
const data = await response.json();

// Clean up
await testUtils.cleanup();
```

## Support

For API support, please contact:
- Email: api-support@happyhour.com
- Documentation: https://docs.happyhour.com
- Status Page: https://status.happyhour.com
