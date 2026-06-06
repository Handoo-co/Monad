import { useEffect } from 'react'
import { useVerify } from '../hooks/useVerify.mock'
import { QRCodeLink } from './QRCodeLink'
import { EXPLORER_URL } from '../config/chains'
import { ADMIN_PRODUCTS } from '../data/adminDemo'
import { DEMO_PRODUCTS } from '../data/demo'
import type { Product } from '../types'

type Props = {
  serial: string
  onBack: () => void
}

function getMeta(serial: string) {
  const demo = DEMO_PRODUCTS.find(p => p.serial === serial)
  const admin = ADMIN_PRODUCTS.find(p => p.serial === serial)
  return {
    name: demo?.name ?? admin?.productLine ?? serial,
    icon: demo?.icon ?? '📦',
    description: demo?.description ?? null,
    brand: demo?.brand ?? admin?.brand ?? null,
    certifier: demo?.certifier ?? 'Artesanías de Colombia',
    category: demo?.category ?? admin ? 'Producto certificado' : null,
  }
}

export function ProductPage({ serial, onBack }: Props) {
  const { verify, product, isLoading, notFound } = useVerify()

  useEffect(() => { verify(serial) }, [serial])

  const meta = getMeta(serial)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Volver
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-[10px] font-bold text-white">H</div>
            <span className="text-xs font-semibold text-gray-500">Handoo OriginPass</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8">
        {isLoading && <LoadingState />}
        {notFound && <NotFoundState serial={serial} />}
        {product && <ProductDetail serial={serial} product={product} meta={meta} />}
      </main>

      <footer className="mt-4 pb-8 text-center text-xs text-gray-400">
        Monad Testnet · Chain ID 10143
      </footer>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-purple-100 border-t-purple-600" />
        <div className="absolute inset-2 rounded-full bg-purple-50" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Consultando Monad Testnet</p>
        <p className="text-xs text-gray-400 mt-0.5">Chain ID 10143 · ~400ms</p>
      </div>
    </div>
  )
}

function NotFoundState({ serial }: { serial: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white">✗</div>
        <p className="mt-3 text-lg font-bold text-white">Sin registro en cadena</p>
        <p className="text-sm text-red-100">No encontrado en Monad Testnet</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm font-semibold text-red-800">Posible falsificación</p>
          <p className="text-xs text-red-600 mt-1">
            El serial <span className="font-mono font-bold">{serial}</span> no tiene pasaporte registrado.
            Este producto puede ser una imitación no autorizada.
          </p>
        </div>
        <p className="text-[11px] text-gray-400 text-center">
          Contacta directamente a la marca ante cualquier duda.
        </p>
      </div>
    </div>
  )
}

function ProductDetail({ serial, product, meta }: {
  serial: string
  product: Product
  meta: ReturnType<typeof getMeta>
}) {
  const isActive = product.status === 0
  const issuedDate = new Date(Number(product.issuedAt) * 1000).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className={`overflow-hidden rounded-2xl shadow-sm ${isActive ? 'border border-emerald-100' : 'border border-amber-100'}`}>
        <div className={`px-6 py-6 ${isActive
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
          : 'bg-gradient-to-r from-amber-500 to-amber-600'}`}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl">
              {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
                }`}>
                  {isActive ? '✓ AUTÉNTICO' : '! REVOCADO'}
                </span>
              </div>
              <h1 className="mt-1 text-xl font-bold text-white leading-tight">{meta.name}</h1>
              {meta.brand && (
                <p className={`text-sm mt-0.5 ${isActive ? 'text-emerald-100' : 'text-amber-100'}`}>
                  {meta.brand}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Revoked alert */}
        {!isActive && (
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-3">
            <p className="text-xs font-semibold text-amber-800">Unidad retirada de circulación</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Este pasaporte fue revocado por el emisor. No compres esta unidad como auténtica.
            </p>
          </div>
        )}

        {/* Certification table */}
        <div className="bg-white">
          <div className="bg-gray-50 border-b border-gray-100 px-5 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Datos del certificado</p>
          </div>
          <div className="divide-y divide-gray-50">
            <CertRow label="Serial" value={serial} mono />
            <CertRow label="Línea de producto" value={product.productLine} />
            {meta.brand && <CertRow label="Marca emisora" value={meta.brand} highlight={isActive} />}
            <CertRow label="Certifica ante" value={meta.certifier} />
            <CertRow label="Fecha de emisión" value={issuedDate} />
            <CertRow
              label="Wallet emisor"
              value={`${product.issuer.slice(0, 6)}...${product.issuer.slice(-4)}`}
              href={`${EXPLORER_URL}/address/${product.issuer}`}
            />
            <CertRow
              label="Transacción"
              value="Ver en explorer →"
              href={`${EXPLORER_URL}/tx/${product.serialHash}`}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      {meta.description && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Sobre este producto</p>
          <p className="text-sm text-gray-600 leading-relaxed">{meta.description}</p>
        </div>
      )}

      {/* QR share */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">Compartir verificación</p>
        <div className="flex items-center gap-5">
          <div className="shrink-0 rounded-xl border border-gray-100 p-2">
            <QRCodeLink serial={serial} size={100} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Escanea para verificar</p>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Cualquier persona puede escanear este QR para confirmar la autenticidad directamente en Monad.
            </p>
            <p className="mt-2 break-all font-mono text-[10px] text-gray-400">
              {window.location.origin}?serial={serial}
            </p>
          </div>
        </div>
      </div>

      {/* Chain footer */}
      <div className="flex items-center justify-center gap-2 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[9px] font-bold text-white">M</span>
        <span className="text-xs text-gray-400">Verificado en Monad Testnet · Chain 10143</span>
      </div>
    </div>
  )
}

function CertRow({ label, value, href, highlight, mono }: {
  label: string; value: string; href?: string; highlight?: boolean; mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3 bg-white">
      <span className="shrink-0 text-xs text-gray-400">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-xs font-medium text-purple-600 underline decoration-dotted hover:text-purple-800 transition-colors">
          {value}
        </a>
      ) : (
        <span className={`text-xs font-semibold text-right ${mono ? 'font-mono' : ''} ${highlight ? 'text-emerald-700' : 'text-gray-800'}`}>
          {value}
        </span>
      )}
    </div>
  )
}
