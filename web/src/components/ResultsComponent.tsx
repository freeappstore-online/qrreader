import { AlertTriangle, ScanLine } from 'lucide-react'

interface ResultsComponentProps {
  result: string
  error?: string | null
}

export default function ResultsComponent({ result, error }: ResultsComponentProps) {
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
          {error && (
            <div data-orientation="vertical" data-slot="root"
              className="relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5 items-start bg-[color:var(--error)/0.1] text-[var(--error)] ring ring-inset ring-[color:var(--error)/0.25]">
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <div data-slot="wrapper" className="min-w-0 flex-1 flex flex-col">
                <div data-slot="description" className="text-sm opacity-90">
                  {error}
                </div>
              </div>
            </div>
          )}
          {result ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--muted)]">Scanned Text:</p>
              <div className="p-4 rounded-lg bg-[var(--paper-deep)] border border-[var(--line)] break-all font-mono text-sm">
                {result}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ScanLine className="w-12 h-12 text-[var(--muted)] mb-4" aria-hidden="true" />
              <p className="text-[var(--muted)]">
                {error ? 'Unable to scan' : 'No scan results yet'}
              </p>
              <p className="text-sm text-[var(--muted)] mt-2">
                {error ? 'Try scanning another QR code' : 'Select a mode and start scanning to see results here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
