import { BrowserMultiFormatReader } from '@zxing/browser'
import { useCallback, useState } from 'react'

interface UseImageScannerOptions {
  onResult: (text: string) => void
}

export function useImageScanner({ onResult }: UseImageScannerOptions) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsScanning(true)
      setError(null)

      try {
        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const img = new Image()
            img.onload = async () => {
              try {
                const codeReader = new BrowserMultiFormatReader()
                const result = await codeReader.decodeFromImageElement(img)
                if (result) {
                  onResult(result.getText())
                } else {
                  setError('No QR code found in the image.')
                }
              } catch (err) {
                setError('Failed to read QR code from image.')
                console.error(err)
              } finally {
                setIsScanning(false)
              }
            }
            img.src = event.target?.result as string
          } catch (err) {
            setError('Failed to process image.')
            setIsScanning(false)
            console.error(err)
          }
        }
        reader.readAsDataURL(file)
      } catch (err) {
        setError('Failed to read file.')
        setIsScanning(false)
        console.error(err)
      }
    },
    [onResult],
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

