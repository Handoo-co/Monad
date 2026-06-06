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

  return (
    <div className="space-y-3">
      <input
        value={serial}
        onChange={e => setSerial(e.target.value)}
        placeholder="Serial del producto (ej. HAT-003)"
        disabled={isBusy || isSuccess}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
      />
      <input
        value={productLine}
        onChange={e => setProductLine(e.target.value)}
        placeholder="Línea de producto (ej. Sombrero Vueltiao)"
        disabled={isBusy || isSuccess}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
      />

      {!isSuccess ? (
        <button
          onClick={handleIssue}
          disabled={!canSubmit}
          className="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-40"
        >
          {isPending && 'Confirma en tu wallet...'}
          {isConfirming && 'Registrando en Monad...'}
          {!isBusy && 'Emitir Pasaporte'}
        </button>
      ) : (
        <button
          onClick={handleReset}
          className="w-full rounded-lg border border-purple-200 py-2.5 text-sm font-medium text-purple-600 transition hover:bg-purple-50"
        >
          Emitir otro pasaporte
        </button>
      )}

      {/* Feedback de estados */}
      {isPending && (
        <p className="text-center text-xs text-gray-500">
          Abre MetaMask y confirma la transacción →
        </p>
      )}
      {isConfirming && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
          Esperando confirmación on-chain...
        </div>
      )}
      {isSuccess && txHash && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="font-semibold text-green-700">Pasaporte emitido ✓</p>
          <a
            href={`${EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-green-600 underline"
          >
            Ver transacción en Monad Explorer →
          </a>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={reset} className="mt-1 text-xs text-red-500 underline">
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}
