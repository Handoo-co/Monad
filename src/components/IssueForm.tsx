import { useState } from 'react'
import { useIssue } from '../hooks/useIssue.mock'
import { EXPLORER_URL } from '../config/chains'

export function IssueForm() {
  const [serial, setSerial] = useState('')
  const [productLine, setProductLine] = useState('')
  const { issue, isPending, isConfirming, isSuccess, txHash, error, reset } = useIssue()

  const canSubmit = serial.trim() && productLine.trim() && !isPending && !isConfirming
  const isBusy = isPending || isConfirming

  const handleIssue = () => {
    if (!canSubmit) return
    issue(serial.trim(), productLine.trim())
  }

  const handleReset = () => {
    setSerial('')
    setProductLine('')
    reset()
  }

  if (isSuccess && txHash) return (
    <div className="space-y-3">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-lg mx-auto mb-2">
          ✓
        </div>
        <p className="font-semibold text-emerald-800 text-sm">Pasaporte emitido</p>
        <p className="text-xs text-emerald-600 mt-1">Registrado en Monad Testnet</p>
        <a
          href={`${EXPLORER_URL}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-purple-600 hover:text-purple-800 underline decoration-dotted"
        >
          Ver en Monad Explorer →
        </a>
      </div>
      <button
        onClick={handleReset}
        className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
      >
        Emitir otro pasaporte
      </button>
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <input
          value={serial}
          onChange={e => setSerial(e.target.value)}
          placeholder="Serial del producto (ej. HAT-003)"
          disabled={isBusy}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <input
          value={productLine}
          onChange={e => setProductLine(e.target.value)}
          placeholder="Línea de producto (ej. Sombrero Vueltiao)"
          disabled={isBusy}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
        />
      </div>

      <button
        onClick={handleIssue}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {isBusy && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
        {isPending && 'Confirma en tu wallet...'}
        {isConfirming && 'Registrando en Monad...'}
        {!isBusy && 'Emitir Pasaporte'}
      </button>

      {isPending && (
        <p className="text-center text-xs text-gray-500">
          Abre tu wallet y confirma la transacción
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">Error al emitir</p>
          <p className="text-xs text-red-500 mt-0.5">{error}</p>
          <button onClick={reset} className="mt-2 text-xs font-medium text-red-600 underline decoration-dotted hover:text-red-800">
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}
