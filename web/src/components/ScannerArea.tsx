import QRScanner from './qr/QRScanner'
import { Camera, Upload, Play, StopCircle, Info } from 'lucide-react';

interface ScannerAreaProps {
  mode: 'camera' | 'image' | null
  isScanning: boolean
  onStartScan: () => void
  onStopScan: () => void
  onResult: (text: string) => void
  onImageSelect: (file: File) => void
}

export default function ScannerArea({
  mode,
  isScanning,
  onStartScan,
  onStopScan,
  onResult,
  onImageSelect,
}: ScannerAreaProps) {
  if (!mode) {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(file)
    }
  }

  if (mode === 'camera') {
    return (
      <div className="rounded-lg overflow-hidden bg-[var(--paper)] ring ring-[var(--line-strong)] divide-y divide-[var(--line)]">
        <div data-slot="header" className="p-4 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <Camera className="text-[var(--accent)]"/>
            <h3 className="text-lg font-medium text-[var(--ink)]">Scan from Camera</h3>
          </div>
        </div>
        <div data-slot="body" className="p-4 sm:p-6">
          <div className="space-y-4">
            <div data-orientation="vertical" data-slot="root"
              className="relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5 items-start bg-[color:var(--sky)/0.1] text-[var(--sky)] ring ring-inset ring-[color:var(--sky)/0.25]">
              <span className="shrink-0 text-[1.25rem]" aria-hidden="true"
                data-slot="icon"><Info /></span>
              <div data-slot="wrapper" className="min-w-0 flex-1 flex flex-col">
                <div data-slot="description" className="text-sm opacity-90">
                  Allow camera access and point it at a QR code to scan.
                </div>
              </div>
            </div>
            <div id="qr-reader-scanner"
              className="w-full min-h-[180px] sm:min-h-[240px] md:min-h-[300px] flex items-center justify-center bg-[var(--paper-deep)] border border-[var(--line)] rounded-lg overflow-hidden relative">
              {isScanning ? (
                <QRScanner onResult={onResult} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Camera className="text-[var(--muted)] size-16" />
                  <button
                    type="button"
                    onClick={onStartScan}
                    data-slot="base"
                    className="rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed disabled:opacity-75 transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-[var(--paper)] bg-[var(--accent)] hover:bg-[color:var(--accent-deep)] active:bg-[color:var(--accent-deep)/0.65] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    <Play />
                    <span data-slot="label" className="truncate">Start Scan</span>
                  </button>
                </div>
              )}
            </div>
            {isScanning && (
              <button
                type="button"
                onClick={onStopScan}
                className="w-full rounded-md font-medium inline-flex items-center justify-center transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-[var(--paper)] bg-red-500 hover:bg-[color:var(--error)] active:bg-[color:var(--error)/0.8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--error)]"
              >
                <StopCircle />
                <span>Stop Scan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden bg-[var(--paper)] ring ring-[var(--line-strong)] divide-y divide-[var(--line)]">
      <div data-slot="header" className="p-4 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <Upload className="text-[var(--accent)]" />
          <h3 className="text-lg font-medium text-[var(--ink)]">Scan from File</h3>
        </div>
      </div>
      <div data-slot="body" className="p-4 sm:p-6">
        <div className="space-y-4">
          <div data-orientation="vertical" data-slot="root"
            className="relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5 items-start bg-[color:var(--sky)/0.1] text-[var(--sky)] ring ring-inset ring-[color:var(--sky)/0.25]">
            <span className="shrink-0 text-[1.25rem]" aria-hidden="true"
              data-slot="icon"><Info /></span>
            <div data-slot="wrapper" className="min-w-0 flex-1 flex flex-col">
              <div data-slot="description" className="text-sm opacity-90">
                Select a QR code image file to scan.
              </div>
            </div>
          </div>
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              className="w-full rounded-md font-medium inline-flex items-center justify-center transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-[var(--paper)] bg-[var(--accent)] hover:bg-[color:var(--accent-deep)] active:bg-[color:var(--accent-deep)/0.65] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
            </button>
          </label>
        </div>
      </div>
    </div>
  )
}
