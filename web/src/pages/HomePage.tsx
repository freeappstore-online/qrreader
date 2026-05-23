import { useState } from 'react'
import HeaderComponent from '../components/HeaderComponent'
import ModeSelector from '../components/ModeSelector'
import ScannerArea from '../components/ScannerArea'
import ResultsComponent from '../components/ResultsComponent'
import { useImageScanner } from '../components/qr/ImageScanner'

type Mode = 'camera' | 'image' | null

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('camera')
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState('')

  const imageScanner = useImageScanner({
    onResult: handleScanResult,
  })

  function handleModeSelect(selectedMode: 'camera' | 'image') {
    setMode(selectedMode)
    setResult('')
    imageScanner.clearError()
    setIsScanning(false)
  }

  function handleStartScan() {
    setIsScanning(true)
    imageScanner.clearError()
  }

  function handleStopScan() {
    setIsScanning(false)
  }

  function handleScanResult(text: string) {
    setResult(text)
    setIsScanning(false)
  }

  function handleImageSelect(file: File) {
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
            />
          </div>

          {/* Right Column */}
          <ResultsComponent result={result} error={imageScanner.error} />
        </div>
      </main>
    </div>
  )
}