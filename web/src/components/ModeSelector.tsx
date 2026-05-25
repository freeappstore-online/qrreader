import { Camera, Upload, ScanLine } from 'lucide-react'

interface ModeSelectorProps {
  onSelectMode: (mode: 'camera' | 'image') => void
}

const scanModes = [
  {
    key: 'camera' as const,
    label: 'Camera',
    icon: Camera,
    variant: 'primary',
  },
  {
    key: 'image' as const,
    label: 'Upload',
    icon: Upload,
    variant: 'secondary',
  },
]

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-[var(--paper)] ring ring-[var(--line-strong)] divide-y divide-[var(--line)]">
      <div data-slot="header" className="p-4 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2">
          <ScanLine className="text-[var(--accent)]" />
          <h3 className="text-lg font-medium text-[var(--ink)]">Scan Mode</h3>
        </div>
      </div>
      <div data-slot="body" className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3">
          {scanModes.map(({ key, label, icon: Icon, variant }) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelectMode(key)}
              className={
                variant === 'primary'
                  ? 'rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--paper)] transition hover:bg-[color:var(--accent-deep)] active:bg-[color:var(--accent-deep)] inline-flex items-center justify-center gap-1.5'
                  : 'rounded-md bg-[var(--panel)] border border-[var(--line)] px-3 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--paper-deep)] active:bg-[var(--paper-deep)] inline-flex items-center justify-center gap-1.5'
              }
            >
              <Icon className={variant === 'primary' ? 'text-[var(--paper)]' : ''} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
