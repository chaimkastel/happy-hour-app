import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get real category counts from database
    const allCategories = await Promise.all([
      getCategoryCount('Pizza', '🍕', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop&crop=center'),
      getCategoryCount('Burgers', '🍔', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&crop=center'),
      getCategoryCount('Sushi', '🍣', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop&crop=center'),
      getCategoryCount('Coffee', '☕', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&crop=center'),
      getCategoryCount('Desserts', '🍰', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&crop=center'),
      getCategoryCount('Cocktails', '🍹', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop&crop=center'),
    ]);

    // Only return categories that have deals
    const categories = allCategories.filter(category => category.count > 0);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

async function getCategoryCount(name: string, icon: string, image: string) {
  try {
    const count = await prisma.deal.count({
      where: {
        active: true,
        startAt: { lte: new Date() },
        endAt: { gte: new Date() },
        OR: [
          { title: { contains: name, mode: 'insensitive' } },
          { description: { contains: name, mode: 'insensitive' } },
        ]
      }
    });

    return {
      name,
      icon,
      count,
      image
    };
  } catch (error) {
    console.error(`Error counting category ${name}:`, error);
    return {
      name,
      icon,
      count: 0,
      image
    };
  }
}
