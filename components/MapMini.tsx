'use client'

interface MapMiniProps {
  lat: number
  lng: number
  label: string
}

export default function MapMini({ lat, lng, label }: MapMiniProps) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 transition-all duration-300"
         onClick={openInGoogleMaps}>
      
      {/* Map Icon */}
      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Location Info */}
      <div className="text-center">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
          {label}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-300">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
          Click to open in Google Maps
        </p>
      </div>
    </div>
  )
}
