import { useState } from 'react'
import { useVerify } from '../hooks/useVerify.mock'
import { ProductCard } from './ProductCard'
import { DEMO_PRODUCTS } from '../data/demo'

export function VerifyForm() {
  const [serial, setSerial] = useState('')
  const { verify, product, isLoading, notFound, reset } = useVerify()

  const handleVerify = () => {
    if (!serial.trim()) return
    verify(serial.trim())
  }

  const handleDemoClick = (s: string) => {
    setSerial(s)
    verify(s)
  }

  const handleClear = () => {
    setSerial('')
    reset()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={serial}
          onChange={e => { setSerial(e.target.value); reset() }}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          placeholder="Ingresa el serial del producto"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
        <button
          onClick={handleVerify}
          disabled={!serial.trim() || isLoading}
          className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-40"
        >
          Verificar
        </button>
        {(product || notFound) && (
          <button
            onClick={handleClear}
            className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
          >
            ✕
          </button>
        )}
      </div>

      {/* Botones de demo rápido */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400">Demo:</span>
        {DEMO_PRODUCTS.map(p => (
          <button
            key={p.serial}
            onClick={() => handleDemoClick(p.serial)}
            className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-600 transition hover:bg-purple-100 hover:text-purple-700"
          >
            {p.label}
          </button>
        ))}
      </div>

      <ProductCard product={product} isLoading={isLoading} notFound={notFound} />
    </div>
  )
}
