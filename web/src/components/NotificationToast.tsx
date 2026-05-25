interface NotificationToastProps {
  message: string
  type: 'success' | 'error'
}

export default function NotificationToast({ message, type }: NotificationToastProps) {
  const isSuccess = type === 'success'
  const statusLabel = isSuccess ? 'Success' : 'Error'
  const statusClass = isSuccess ? 'bg-emerald-500' : 'bg-red-500'

  return (
    <div className="fixed right-4 bottom-6 z-50 max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${statusClass}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--ink)]">{statusLabel}</p>
          <p className="mt-1 text-sm text-[var(--muted)] break-words">{message}</p>
        </div>
      </div>
    </div>
  )
}
