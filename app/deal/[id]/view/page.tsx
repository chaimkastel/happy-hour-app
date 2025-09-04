import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deal Details - Happy Hour',
  description: 'View details of this amazing deal.',
};

export default function DealViewPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Deal Details</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600">
              This page will show the details of a specific deal. The deal ID will be passed as a parameter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
