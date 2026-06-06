import { useEffect, useState } from 'react'
import { useVerify } from '../hooks/useVerify.mock'
import { VerificationSeal } from './VerificationSeal'
import { DEMO_PRODUCTS } from '../data/demo'

type Props = {
  initialSerial?: string
  onSerialConsumed?: () => void
}

export function VerifyForm({ initialSerial, onSerialConsumed }: Props) {
  const [serial, setSerial] = useState('')
  const { verify, product, isLoading, notFound, reset } = useVerify()

  useEffect(() => {
    if (!initialSerial) return
    setSerial(initialSerial)
    verify(initialSerial)
    onSerialConsumed?.()
  }, [initialSerial])

  const handleVerify = () => {
    if (!serial.trim()) return
    verify(serial.trim())
  }

  const handleClear = () => {
    setSerial('')
    reset()
  }

  const brandName = DEMO_PRODUCTS.find(p => p.serial === serial.trim())?.brand ?? undefined

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <input
          value={serial}
          onChange={e => { setSerial(e.target.value); reset() }}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          placeholder="Ingresa el serial del producto (ej. HAT-001)"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
        <button
          onClick={handleVerify}
          disabled={!serial.trim() || isLoading}
          className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-40"
        >
          Verificar
        </button>
        {(product || notFound) && (
          <button
            onClick={handleClear}
            className="rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-400 hover:bg-gray-50"
          >
            ✕
          </button>
        )}
      </div>

      {/* Demo rápido */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400">Probar:</span>
        {DEMO_PRODUCTS.map(p => (
          <button
            key={p.serial}
            onClick={() => { setSerial(p.serial); verify(p.serial) }}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-600 transition hover:bg-purple-100 hover:text-purple-700"
          >
            {p.serial} · {p.label}
          </button>
        ))}
      </div>

      {/* Resultado */}
      <VerificationSeal
        product={product}
        isLoading={isLoading}
        notFound={notFound}
        serial={serial}
        brandName={brandName ?? undefined}
      />
    </div>
  )
}
