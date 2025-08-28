'use client'

interface Deal {
  id: string
  venue: {
    latitude: number
    longitude: number
    name: string
  }
}

interface MapWithClustersProps {
  deals: Deal[]
  userLocation?: { lat: number; lng: number } | null
}

export default function MapWithClusters({ deals, userLocation }: MapWithClustersProps) {
  const openInGoogleMaps = () => {
    if (deals.length === 0) return
    
    // Center on first deal or user location
    const center = userLocation || { lat: deals[0].venue.latitude, lng: deals[0].venue.longitude }
    const url = `https://www.google.com/maps?q=${center.lat},${center.lng}&z=12`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:from-blue-200 hover:via-indigo-200 hover:to-purple-200 dark:hover:from-blue-800/40 dark:hover:via-indigo-800/40 dark:hover:to-purple-800/40 transition-all duration-300"
         onClick={openInGoogleMaps}>
      
      {/* Map Icon */}
      <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Map Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
          Interactive Map View
        </h3>
        <p className="text-blue-600 dark:text-blue-300 mb-3">
          {deals.length} deal{deals.length !== 1 ? 's' : ''} available
        </p>
        <p className="text-sm text-blue-500 dark:text-blue-400">
          Click to open in Google Maps
        </p>
      </div>
      
      {/* Deal Pins Preview */}
      {deals.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {deals.slice(0, 6).map((deal, index) => (
            <div key={deal.id} className="w-3 h-3 bg-red-500 rounded-full animate-pulse" 
                 style={{ animationDelay: `${index * 0.2}s` }} />
          ))}
          {deals.length > 6 && (
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
          )}
        </div>
      )}
    </div>
  )
}
