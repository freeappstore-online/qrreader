import { BrowserMultiFormatReader } from '@zxing/browser'
import { useEffect, useRef } from 'react'

interface Props {
  onResult: (text: string) => void
  onError?: (message: string) => void
  enabled?: boolean
}

const getCameraErrorMessage = (error: unknown) => {
  const errorName = error instanceof Error ? error.name : String(error)

  if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
    return 'Camera access was denied. Please allow camera permission to scan.'
  }

  return 'Failed to start camera scanner. Please check your camera permissions and try again.'
}

export default function QRScanner({ onResult, onError, enabled = true }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const codeReader = new BrowserMultiFormatReader()

    let controls: {
      stop: () => void
    }

    async function startScanner() {
      try {
        controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (result) {
              onResult(result.getText())
            }
          },
        )
      } catch (error) {
        console.error(error)
        onError?.(getCameraErrorMessage(error))
      }
    }

    startScanner()

    return () => {
      controls?.stop()
    }
  }, [enabled, onError, onResult])

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
      />

      {enabled ? (
        <div className="qr-shaded-region pointer-events-none">
          <div className="cutout" />
        </div>
      ) : null}
    </div>
  )
}