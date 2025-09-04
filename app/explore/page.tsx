import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Deals - Happy Hour',
  description: 'Discover amazing deals at restaurants near you.',
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Deals</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600">
              This page will show a list of available deals that users can explore and filter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
