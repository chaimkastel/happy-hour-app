import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { generateDealMetadata, generateDealStructuredData } from '@/lib/seo';

interface DealLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        percentOff: true,
        tags: true,
        venue: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });

    if (!deal) {
      return {
        title: 'Deal Not Found | Happy Hour',
        description: 'The requested deal could not be found.',
      };
    }

    // Extract city and state from venue if available
    const city = '';
    const state = '';
    
    return generateDealMetadata({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      venue: {
        name: deal.venue.name,
        address: deal.venue.address,
        city,
        state,
      },
      percentOff: deal.percentOff,
      tags: deal.tags ? JSON.parse(deal.tags) : [],
    });
  } catch (error) {
    console.error('Error generating deal metadata:', error);
    return {
      title: 'Deal | Happy Hour',
      description: 'Find amazing restaurant deals and happy hour specials.',
    };
  }
}

export default function DealLayout({ children, params }: DealLayoutProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateDealStructuredData({
            id: params.id,
            title: 'Deal',
            description: 'Restaurant deal',
            percentOff: 10,
            startAt: new Date().toISOString(),
            endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            venue: {
              name: 'Restaurant',
              address: 'Address',
              city: 'City',
              state: 'State',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
