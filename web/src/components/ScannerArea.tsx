import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import QRScanner from './qr/QRScanner'
import { Camera, Upload, Play, StopCircle, Info } from 'lucide-react'

interface ScannerAreaProps {
  mode: 'camera' | 'image' | null
  isScanning: boolean
  onStartScan: () => void
  onStopScan: () => void
  onResult: (text: string) => void
  onImageSelect: (file: File) => void
  onClearResult: () => void
  onClearImageError: () => void
  previewError?: string | null
  cameraError?: string | null
  onCameraError?: (message: string) => void
}

const cardStyles = 'rounded-lg overflow-hidden bg-[var(--paper)] ring ring-[var(--line-strong)] divide-y divide-[var(--line)]'
const calloutStyles = 'relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5 items-start bg-[color:var(--sky-soft)]/20 text-[var(--sky)] ring ring-inset ring-[color:var(--sky)/0.25]'

export default function ScannerArea({
  mode,
  isScanning,
  onStartScan,
  onStopScan,
  onResult,
  onImageSelect,
  onClearResult,
  onClearImageError,
  previewError,
  cameraError,
  onCameraError,
}: ScannerAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewName, setPreviewName] = useState<string | null>(null)

  const revokePreviewUrl = (url: string | null) => {
    if (url) {
      URL.revokeObjectURL(url)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const newUrl = URL.createObjectURL(file)
    setPreviewUrl((currentUrl) => {
      revokePreviewUrl(currentUrl)
      return newUrl
    })
    setPreviewName(file.name)
    onImageSelect(file)
  }

  useEffect(() => {
    return () => {
      revokePreviewUrl(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (mode !== 'image' && previewUrl) {
      revokePreviewUrl(previewUrl)
      setPreviewUrl(null)
      setPreviewName(null)
      onClearResult()
      onClearImageError()
    }
  }, [mode, previewUrl, onClearResult, onClearImageError])

  const handleClosePreview = () => {
    revokePreviewUrl(previewUrl)
    setPreviewUrl(null)
    setPreviewName(null)
    onClearResult()
    onClearImageError()
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  if (!mode) {
    return null
  }

  const renderInfoCallout = (message: string) => (
    <div className={calloutStyles}>
      <span className="shrink-0 text-[1.25rem]" aria-hidden="true">
        <Info />
      </span>
      <div className="min-w-0 flex-1 flex flex-col">
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  )

  if (mode === 'camera') {
    return (
      <div className={cardStyles}>
        <div data-slot="header" className="p-4 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <Camera className="text-[var(--accent)]" />
            <h3 className="text-lg font-medium text-[var(--ink)]">Scan from Camera</h3>
          </div>
        </div>

        <div data-slot="body" className="p-4 sm:p-6">
          <div className="space-y-4">
            {renderInfoCallout('Allow camera access and point it at a QR code to scan.')}

            <div
              id="qr-reader-scanner"
              className="w-full min-h-[180px] sm:min-h-[240px] md:min-h-[300px] flex items-center justify-center bg-[var(--paper-deep)] border border-[var(--line)] rounded-lg overflow-hidden relative"
            >
              {isScanning ? (
                <QRScanner onResult={onResult} onError={onCameraError} />
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
                    <span data-slot="label" className="truncate">
                      Start Scan
                    </span>
                  </button>
                </div>
              )}
            </div>

            {cameraError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {cameraError}
              </div>
            ) : null}

            {isScanning ? (
              <button
                type="button"
                onClick={onStopScan}
                className="w-full rounded-md font-medium inline-flex items-center justify-center transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-[var(--paper)] bg-red-500 hover:bg-[color:var(--error)] active:bg-[color:var(--error)/0.8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--error)]"
              >
                <StopCircle />
                <span>Stop Scan</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cardStyles}>
      <div data-slot="header" className="p-4 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <Upload className="text-[var(--accent)]" />
          <h3 className="text-lg font-medium text-[var(--ink)]">Scan from File</h3>
        </div>
      </div>

      <div data-slot="body" className="p-4 sm:p-6">
        <div className="space-y-4">
          {renderInfoCallout('Select a QR code image file to scan.')}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {previewUrl ? (
            <div className="rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--paper-deep)]">
              <div className="flex items-start justify-between gap-3 p-3 border-b border-[var(--line)] bg-[var(--paper)]">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Selected Image</p>
                  {previewName ? <p className="text-xs text-[var(--muted)] truncate">{previewName}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] bg-[var(--line)] hover:bg-[var(--line-strong)] transition-colors"
                >
                  Close
                </button>
              </div>

              {previewError ? (
                <div className="p-3 text-sm text-[var(--error)] bg-[color:var(--error)/0.1] border-t border-b border-[var(--line)]">
                  {previewError}
                </div>
              ) : null}

              <img src={previewUrl} alt="Selected QR code preview" className="w-full h-56 object-contain bg-[var(--paper)]" />
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleChooseFile}
            className="w-full rounded-md font-medium inline-flex items-center justify-center transition-colors px-2.5 py-1.5 text-sm gap-1.5 text-[var(--paper)] bg-[var(--accent)] hover:bg-[color:var(--accent-deep)] active:bg-[color:var(--accent-deep)/0.65] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <Upload className="w-4 h-4" />
            <span>Choose File</span>
          </button>
        </div>
      </div>
    </div>
  )
}
