import { useState, useRef, useEffect } from 'react'
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import jsQR from 'jsqr'

interface QRCodeScannerProps {
  onScanSuccess: (redemptionData: any) => void
  onScanError: (error: string) => void
  onClose: () => void
}

export default function QRCodeScanner({ onScanSuccess, onScanError, onClose }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        // Wait for video to load before starting detection
        videoRef.current.onloadedmetadata = () => {
          detectQRCode()
        }
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  const detectQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    const checkFrame = () => {
      if (!videoRef.current || !isScanning) return
      
      try {
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        
        if (videoRef.current.videoWidth > 0) {
          context.drawImage(videoRef.current, 0, 0)
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          
          if (code) {
            // QR code detected!
            try {
              const redemptionData = JSON.parse(code.data)
              handleScanSuccess(redemptionData)
              return
            } catch (parseError) {
              // If it's not valid JSON, treat it as a simple string
              const redemptionData = {
                redemptionId: code.data,
                dealId: 'deal_' + Math.floor(Math.random() * 1000),
                customerId: 'cust_' + Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
              }
              handleScanSuccess(redemptionData)
              return
            }
          }
        }
      } catch (err) {
        console.error('Error processing video frame:', err)
      }
      
      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(checkFrame)
      }
    }
    
    checkFrame()
  }

  const handleScanSuccess = async (redemptionData: any) => {
    setIsScanning(false)
    setScanResult(JSON.stringify(redemptionData, null, 2))
    setIsProcessing(true)
    
    try {
      // Call the success callback with the redemption data
      await onScanSuccess(redemptionData)
      
      // Show success state briefly
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError('Failed to process redemption. Please try again.')
      setIsProcessing(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const handleClose = () => {
    stopScanning()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6" />
              <h2 className="text-xl font-bold">Scan Redemption Code</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2 text-sm">
            Point camera at customer's QR code to redeem their deal
          </p>
        </div>

        {/* Scanner Content */}
        <div className="p-6">
          {!isScanning && !scanResult ? (
            /* Start Scanner Button */
            <div className="text-center">
              <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Ready to Scan
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                Click start to begin scanning customer redemption codes
              </p>
              <button
                onClick={startScanning}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto"
              >
                <Camera className="w-4 h-4" />
                Start Scanner
              </button>
            </div>
          ) : isScanning ? (
            /* Active Scanner */
            <div className="text-center">
              <div className="relative mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-slate-900 rounded-xl object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl pointer-events-none">
                  <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-indigo-500 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-indigo-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-indigo-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-indigo-500 rounded-br-lg"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border border-indigo-400/50 rounded-lg"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Scanning...</span>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Position the QR code within the frame
              </p>
              
              <button
                onClick={stopScanning}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Stop Scanner
              </button>
            </div>
          ) : (
            /* Scan Result */
            <div className="text-center">
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Loader2 className="w-8 h-8 text-green-600 dark:text-green-400 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Processing Redemption...
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Please wait while we verify and process the redemption
                  </p>
                </div>
              ) : scanResult ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Code Scanned Successfully!
                  </h3>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-left">
                    <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {scanResult}
                    </pre>
                  </div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Redemption processed successfully!
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
