import { prisma } from '@/lib/db';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orderhappyhour.com';

  // Basic static routes
  const routes: MetadataRoute.Sitemap = [
    '',
    '/explore',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/cookies',
    '/partner',
    '/merchant/login',
    '/merchant/signup',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Deals
  let dealEntries: MetadataRoute.Sitemap = [];
  try {
    const deals = await prisma.deal.findMany({ select: { id: true, updatedAt: true } });
    dealEntries = deals.map((d) => ({
      url: `${baseUrl}/deal/${d.id}`,
      lastModified: d.updatedAt,
      changeFrequency: 'hourly',
      priority: 0.8,
    }));
  } catch {
    // ignore if db unavailable
  }

  return [...routes, ...dealEntries];
}


