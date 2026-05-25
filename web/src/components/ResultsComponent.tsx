import { useState } from 'react'
import { AlertTriangle, ScanLine, Copy } from 'lucide-react'

interface ResultsComponentProps {
  result: string
  error?: string | null
}

export default function ResultsComponent({ result, error }: ResultsComponentProps) {
  const [copied, setCopied] = useState(false)
  const hasError = Boolean(error)
  const emptyStateHeading = hasError ? 'Unable to scan' : 'No scan results yet'
  const emptyStateDescription = hasError
    ? 'Try scanning another QR code.'
    : 'Select a mode and start scanning to see results here.'

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-lg overflow-hidden bg-[var(--paper)] ring ring-[var(--line-strong)] divide-y divide-[var(--line)]">
      <div data-slot="header" className="p-4 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-medium text-[var(--ink)]">Scan Results</h3>
        </div>
      </div>

      <div data-slot="body" className="p-4 sm:p-6">
        <div className="space-y-4">
          {hasError && (
            <div
              data-orientation="vertical"
              data-slot="root"
              className="relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5 items-start bg-[color:var(--error)/0.1] text-[var(--error)] ring ring-inset ring-[color:var(--error)/0.25]"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <div data-slot="wrapper" className="min-w-0 flex-1 flex flex-col">
                <div data-slot="description" className="text-sm opacity-90">
                  {error}
                </div>
              </div>
            </div>
          )}

          {result ? (
            <section className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--muted)]">Scanned Text:</p>
                <div className="p-4 rounded-lg bg-[var(--paper-deep)] border border-[var(--line)] break-all font-mono text-sm">
                  {result}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyResult}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--paper)] transition hover:bg-[color:var(--accent-deep)] active:bg-[color:var(--accent-deep)/0.85]"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ScanLine className="w-12 h-12 text-[var(--muted)] mb-4" aria-hidden="true" />
              <p className="text-[var(--muted)]">{emptyStateHeading}</p>
              <p className="text-sm text-[var(--muted)] mt-2">{emptyStateDescription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
