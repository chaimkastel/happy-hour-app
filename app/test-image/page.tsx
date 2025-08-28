'use client';

export default function TestImagePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">PNG Image Test:</h2>
          <img 
            src="/images/hero-food-deals.png"
            alt="Test PNG"
            className="w-full max-w-md h-64 object-cover border-2 border-red-500"
            onError={(e) => {
              console.log('PNG Error:', e);
              e.currentTarget.style.border = '5px solid red';
            }}
            onLoad={() => {
              console.log('PNG Loaded!');
            }}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Direct URL Test:</h2>
          <p>Try this URL directly: <a href="/images/hero-food-deals.png" target="_blank" className="text-blue-500 underline">/images/hero-food-deals.png</a></p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">File Info:</h2>
          <p>File should be 2.3MB PNG image</p>
        </div>
      </div>
    </div>
  );
}
