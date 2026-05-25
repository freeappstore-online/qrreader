import { BrowserMultiFormatReader } from '@zxing/browser'
import { useCallback, useState } from 'react'

interface UseImageScannerOptions {
  onResult: (text: string) => void
  onError?: (message: string) => void
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('Failed to read image file.'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image.'))
    image.src = src
  })
}

export function useImageScanner({ onResult, onError }: UseImageScannerOptions) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsScanning(true)
      setError(null)

      try {
        const dataUrl = await readFileAsDataUrl(file)
        const image = await loadImage(dataUrl)
        const codeReader = new BrowserMultiFormatReader()
        const result = await codeReader.decodeFromImageElement(image)

        if (!result?.getText()) {
          throw new Error('No QR code found in the image.')
        }

        onResult(result.getText())
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Failed to read QR code from image.'

        setError(message)
        onError?.(message)
        console.error(err)
      } finally {
        setIsScanning(false)
      }
    },
    [onError, onResult],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    handleImageSelect,
    isScanning,
    error,
    clearError,
  }
}

