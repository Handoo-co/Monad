import type { Product } from '../types/index'
import { EXPLORER_URL } from '../config/chains'

type Props = {
  product: Product | null
  isLoading: boolean
  notFound: boolean
  serial?: string
  brandName?: string
}

export function VerificationSeal({ product, isLoading, notFound, serial, brandName }: Props) {
  if (isLoading) return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-12 text-center shadow-sm">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent border-t-accent" />
        <div className="absolute inset-2 rounded-full bg-neutral" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">Consultando Monad Testnet</p>
        <p className="text-xs text-gray-400 mt-0.5">Chain ID 10143 · ~400ms</p>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="overflow-hidden rounded-2xl border border-secondary bg-white shadow-sm">
      <div className="bg-gradient-to-r from-secondary to-accent px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white">
            ✗
          </div>
          <div>
            <p className="font-bold text-white">Sin registro en cadena</p>
            <p className="text-xs text-secondary">No encontrado en Monad Testnet</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="rounded-xl bg-red-50 border border-secondary p-4">
          <p className="text-sm font-semibold text-red-800">Posible falsificación</p>
          <p className="text-xs text-red-600 mt-1">
            El serial <span className="font-mono font-bold">{serial}</span> no tiene pasaporte
            registrado. Este producto puede ser una imitación no autorizada.
          </p>
        </div>
        <p className="text-[11px] text-gray-400 text-center">
          Blockchain verifica el certificado, no el objeto físico. Contacta directamente a la marca ante cualquier duda.
        </p>
      </div>
    </div>
  )

  if (!product) return null

  const isActive = product.status === "Valid"
  const issuedDate = new Date(Number(product.issuedAt) * 1000).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const displayBrand = brandName ?? 'Handoo Demo Brand'

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${isActive ? 'border-emerald-100' : 'border-amber-100'} bg-white`}>
      {/* Header del sello */}
      <div className={`px-6 py-5 ${isActive
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
        : 'bg-gradient-to-r from-amber-500 to-amber-600'}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white">
            {isActive ? '✓' : '!'}
          </div>
          <div>
            <p className="font-bold text-white">
              {isActive ? 'Sello de Autenticidad' : 'Pasaporte Revocado'}
            </p>
            <p className={`text-xs ${isActive ? 'text-emerald-100' : 'text-amber-100'}`}>
              {isActive ? 'Verificado en Monad Testnet' : 'Retirado de circulación'}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className={`text-[10px] uppercase tracking-widest font-semibold ${isActive ? 'text-emerald-200' : 'text-amber-200'}`}>
              Denominación
            </p>
            <p className={`text-[10px] uppercase tracking-widest font-semibold ${isActive ? 'text-emerald-200' : 'text-amber-200'}`}>
              de Origen
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Nombre del producto */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{product.productLine}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Artesanías Colombianas</p>
          </div>
          <span className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold ${
            isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isActive ? 'ACTIVO' : 'REVOCADO'}
          </span>
        </div>

        {/* Tabla de certificación */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Datos del certificado
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            <CertRow label="Certificado por" value={displayBrand} highlight={isActive} />
            <CertRow label="Autorizado ante" value="Artesanías de Colombia" />
            <CertRow label="Fecha de emisión" value={issuedDate} />
            <CertRow
              label="Wallet emisor"
              value={`${product.issuer.slice(0, 6)}...${product.issuer.slice(-4)}`}
              href={`${EXPLORER_URL}/address/${product.issuer}`}
            />
          </div>
        </div>

        {/* Alerta revocado */}
        {!isActive && (
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs font-semibold text-amber-800">Unidad retirada de circulación</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Este pasaporte fue revocado por el emisor. No compres ni revises esta unidad como auténtica.
            </p>
          </div>
        )}

        {/* Footer chain */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[8px] font-bold text-white">M</span>
            <span className="text-xs text-gray-500">Monad Testnet · Chain 10143</span>
          </div>
          <a
            href={`${EXPLORER_URL}/address/${product.issuer}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            Ver en explorer →
          </a>
        </div>
      </div>
    </div>
  )
}

function CertRow({ label, value, href, highlight }: {
  label: string; value: string; href?: string; highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs font-medium text-purple-600 underline decoration-dotted hover:text-purple-800 transition-colors">
          {value}
        </a>
      ) : (
        <span className={`text-xs font-semibold text-right ${highlight ? 'text-emerald-700' : 'text-gray-800'}`}>
          {value}
        </span>
      )}
    </div>
  )
}
