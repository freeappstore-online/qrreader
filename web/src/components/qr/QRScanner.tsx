import { BrowserMultiFormatReader } from '@zxing/browser'
import { useEffect, useRef } from 'react'

interface Props {
  onResult: (text: string) => void
  enabled?: boolean
}

export default function QRScanner({ onResult, enabled = true }: Props) {
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
      }
    }

    startScanner()

    return () => {
      controls?.stop()
    }
  }, [onResult, enabled])

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
    />
  )
}