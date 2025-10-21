import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry if DSN is provided and valid
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your-sentry-dsn') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
} else {
  console.log('Sentry not initialized - DSN not configured');
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
