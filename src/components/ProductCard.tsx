import type { Product } from '../types'
import { EXPLORER_URL } from '../config/chains'

type Props = {
  product: Product | null
  isLoading: boolean
  notFound: boolean
}

export function ProductCard({ product, isLoading, notFound }: Props) {
  if (isLoading)
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600" />
        <p className="text-sm">Consultando Monad...</p>
      </div>
    )

  if (notFound)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <span className="text-5xl">✗</span>
        <p className="mt-3 text-lg font-bold text-red-700">Serial no registrado</p>
        <p className="mt-1 text-sm text-red-500">
          Este producto no tiene pasaporte en Monad. Posible falsificación.
        </p>
      </div>
    )

  if (!product) return null

  const isActive = product.status === 0
  const issuedDate = new Date(Number(product.issuedAt) * 1000).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className={`rounded-xl border p-6 ${isActive ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`rounded-full px-4 py-1 text-sm font-bold tracking-wide ${isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {isActive ? '✓ ORIGINAL' : '✗ REVOCADO'}
        </span>
        <span className="text-xs text-gray-400">{issuedDate}</span>
      </div>

      <h2 className="mt-4 text-xl font-bold text-gray-900">{product.productLine}</h2>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Emisor:</span>
          <span>Handoo Demo Brand</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Wallet:</span>
          <a
            href={`${EXPLORER_URL}/address/${product.issuer}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-purple-600 underline"
          >
            {product.issuer.slice(0, 6)}...{product.issuer.slice(-4)}
          </a>
        </div>
        {!isActive && (
          <div className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-700">
            Este pasaporte fue revocado por el emisor original.
          </div>
        )}
      </div>
    </div>
  )
}
