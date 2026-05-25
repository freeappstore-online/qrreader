import { useCallback, useEffect, useRef, useState } from 'react'
import HeaderComponent from '../components/HeaderComponent'
import ModeSelector from '../components/ModeSelector'
import ScannerArea from '../components/ScannerArea'
import NotificationToast from '../components/NotificationToast'
import ResultsComponent from '../components/ResultsComponent'
import { useImageScanner } from '../components/qr/ImageScanner'

type Mode = 'camera' | 'image' | null

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('camera')
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState('')
  const [imageError, setImageError] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const notificationTimer = useRef<number | null>(null)

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    if (notificationTimer.current) {
      window.clearTimeout(notificationTimer.current)
    }
    notificationTimer.current = window.setTimeout(() => {
      setNotification(null)
      notificationTimer.current = null
    }, 4000)
  }, [])

  const imageScanner = useImageScanner({
    onResult: handleScanResult,
    onError: (message) => {
      setImageError(message)
      showNotification(message, 'error')
    },
  })

  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        window.clearTimeout(notificationTimer.current)
      }
    }
  }, [])

  const handleCameraError = useCallback(
    (message: string) => {
      setCameraError(message)
      setIsScanning(false)
      showNotification(message, 'error')
    },
    [showNotification],
  )

  function handleModeSelect(selectedMode: 'camera' | 'image') {
    setMode(selectedMode)
    setResult('')
    setImageError(null)
    setCameraError(null)
    imageScanner.clearError()
    setIsScanning(false)
  }

  function handleStartScan() {
    setIsScanning(true)
    setCameraError(null)
    imageScanner.clearError()
  }

  function handleStopScan() {
    setIsScanning(false)
  }

  function handleScanResult(text: string) {
    setResult(text)
    setImageError(null)
    setIsScanning(false)
    showNotification('QR code scanned successfully.', 'success')
  }

  function handleImageSelect(file: File) {
    setImageError(null)
    imageScanner.handleImageSelect(file)
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-6 flex-1 overflow-y-auto p-3 sm:p-6">
      <HeaderComponent />
      <main className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Mode Selector */}
            <ModeSelector onSelectMode={handleModeSelect} />

            {/* Scanner Area */}
            <ScannerArea
              mode={mode}
              isScanning={isScanning}
              onStartScan={handleStartScan}
              onStopScan={handleStopScan}
              onResult={handleScanResult}
              onImageSelect={handleImageSelect}
              onClearResult={() => setResult('')}
              onClearImageError={() => setImageError(null)}
              previewError={imageError}
              cameraError={cameraError}
              onCameraError={handleCameraError}
            />
          </div>

          {/* Right Column */}
          <ResultsComponent result={result} error={mode === 'image' ? null : imageScanner.error} />
        </div>
      </main>
      {notification && (
        <NotificationToast message={notification.message} type={notification.type} />
      )}
    </div>
  )
}