# Happy Hour Mobile App

A React Native mobile application for the Happy Hour business deals platform, built with Expo.

## Features

- **Browse Deals**: View and search for local business deals
- **Merchant Dashboard**: Manage venues, deals, and business performance
- **Deal Details**: Comprehensive view of deal information
- **QR Code Generation**: For deal redemption
- **Modern UI**: Clean, intuitive interface with Tailwind-inspired styling

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **Expo Vector Icons** for icons
- **Custom API Service** for backend communication

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd happy-hour-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── DealsScreen.tsx
│   ├── MerchantScreen.tsx
│   ├── LoginScreen.tsx
│   ├── DealDetailScreen.tsx
│   └── QRCodeScreen.tsx
├── services/           # API and external services
│   └── api.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## Configuration

### API Configuration

The app is configured to connect to your local web backend. Update the `API_BASE_URL` in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

For production, change this to your deployed backend URL.

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
API_BASE_URL=https://your-backend-url.com/api
```

## Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation in `App.tsx`
3. Update types if needed in `src/types/index.ts`

### Styling

The app uses React Native StyleSheet with a design system inspired by Tailwind CSS. Colors, spacing, and typography are consistent throughout the app.

### API Integration

The `apiService` in `src/services/api.ts` handles all backend communication. Add new API endpoints as needed.

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **iOS Simulator not working**: Ensure Xcode is properly installed
3. **Android build issues**: Check Android SDK installation

### Debug Mode

Enable debug mode in the Expo app to see console logs and network requests.

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Test on both iOS and Android
4. Update documentation as needed

## License

MIT License - see LICENSE file for details
