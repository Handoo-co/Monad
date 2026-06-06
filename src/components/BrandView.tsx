import { useState } from 'react'
import { useBrandPassports } from '../hooks/useBrandPassports.mock'
import { EXPLORER_URL } from '../config/chains'
import { QRCodeLink } from './QRCodeLink'
import type { AdminProduct } from '../data/adminDemo'

type Filter = 'all' | 'active' | 'revoked'

export function BrandView() {
  const { brand, products, revoke, revokeState, resetRevoke } = useBrandPassports()
  const [filter, setFilter] = useState<Filter>('all')
  const [confirmingSerial, setConfirmingSerial] = useState<string | null>(null)

  if (!brand) return null

  const active = products.filter(p => p.status === 'active').length
  const revoked = products.filter(p => p.status === 'revoked').length

  const visible = products.filter(p => {
    if (filter === 'all') return true
    return p.status === filter
  })

  const handleRevokeClick = (serial: string) => {
    setConfirmingSerial(serial)
  }

  const handleRevokeConfirm = () => {
    if (!confirmingSerial) return
    revoke(confirmingSerial)
    setConfirmingSerial(null)
  }

  return (
    <div className="space-y-6">
      {/* Brand identity card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl font-bold text-purple-600">
              {brand.name[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{brand.name}</h2>
              <p className="text-xs text-gray-500">{brand.category}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Activa
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoCell label="Certifica ante" value={brand.certifier} />
          <InfoCell label="Registro" value={brand.registeredAt} />
          <InfoCell
            label="Wallet"
            value={`${brand.wallet.slice(0, 6)}...${brand.wallet.slice(-4)}`}
            href={`${EXPLORER_URL}/address/${brand.wallet}`}
          />
          <InfoCell label="Red" value="Monad Testnet · 10143" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'all' ? 'border-indigo-200 bg-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/40'}`}
        >
          <p className={`text-2xl font-bold ${filter === 'all' ? 'text-indigo-700' : 'text-gray-800'}`}>
            {products.length}
          </p>
          <p className={`mt-0.5 text-xs font-medium ${filter === 'all' ? 'text-indigo-600' : 'text-gray-500'}`}>
            Total
          </p>
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'active' ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-100 hover:bg-emerald-50/40'}`}
        >
          <p className={`text-2xl font-bold ${filter === 'active' ? 'text-emerald-700' : 'text-gray-800'}`}>
            {active}
          </p>
          <p className={`mt-0.5 text-xs font-medium ${filter === 'active' ? 'text-emerald-600' : 'text-gray-500'}`}>
            Activos
          </p>
        </button>
        <button
          onClick={() => setFilter('revoked')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'revoked' ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white hover:border-amber-100 hover:bg-amber-50/40'}`}
        >
          <p className={`text-2xl font-bold ${filter === 'revoked' ? 'text-amber-700' : 'text-gray-800'}`}>
            {revoked}
          </p>
          <p className={`mt-0.5 text-xs font-medium ${filter === 'revoked' ? 'text-amber-600' : 'text-gray-500'}`}>
            Revocados
          </p>
        </button>
      </div>

      {/* Notification de revocación exitosa */}
      {revokeState.isSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <p className="text-sm font-medium text-emerald-800">
              Pasaporte <span className="font-mono">{revokeState.serial}</span> revocado correctamente.
            </p>
          </div>
          <button onClick={resetRevoke} className="text-xs text-emerald-500 hover:text-emerald-700">
            ✕
          </button>
        </div>
      )}

      {/* Product list */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-sm font-bold text-gray-900">
            Mis pasaportes
            {filter !== 'all' && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                · {filter === 'active' ? 'Activos' : 'Revocados'}
              </span>
            )}
          </h3>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {visible.length}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-400">No hay pasaportes en esta categoría.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {visible.map(p => (
              <ProductRow
                key={p.serial}
                product={p}
                revokeState={revokeState}
                onRevoke={() => handleRevokeClick(p.serial)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de revocación */}
      {confirmingSerial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Revocar pasaporte</h3>
            <p className="mt-2 text-sm text-gray-500">
              ¿Confirmas que quieres revocar el serial{' '}
              <span className="font-mono font-semibold text-gray-800">{confirmingSerial}</span>?
              Esta acción se registrará en Monad y no se puede deshacer.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmingSerial(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRevokeConfirm}
                className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                Revocar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductRow({ product: p, revokeState, onRevoke }: {
  product: AdminProduct
  revokeState: { serial: string | null; isPending: boolean; isConfirming: boolean }
  onRevoke: () => void
}) {
  const isBeingRevoked = revokeState.serial === p.serial && (revokeState.isPending || revokeState.isConfirming)
  const [showQr, setShowQr] = useState(false)

  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Info */}
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${p.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-gray-900">{p.serial}</span>
            <StatusPill status={p.status} />
          </div>
          <p className="mt-0.5 text-xs text-gray-500">{p.productLine}</p>
        </div>
      </div>

      {/* Meta + actions */}
      <div className="ml-6 flex items-center gap-3 sm:ml-0">
        <div className="text-right">
          <p className="text-xs text-gray-400">Emitido</p>
          <p className="text-xs font-medium text-gray-700">{p.issuedAt}</p>
        </div>
        <button
          onClick={() => setShowQr(v => !v)}
          title="Ver QR"
          className="rounded-lg border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-200 transition-colors"
        >
          QR
        </button>
        <a
          href={`${EXPLORER_URL}/tx/${p.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-100 px-3 py-1.5 font-mono text-xs text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
        >
          Tx →
        </a>
        {p.status === 'active' && (
          <button
            onClick={onRevoke}
            disabled={isBeingRevoked}
            className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
          >
            {isBeingRevoked
              ? (revokeState.isPending ? 'Firmando...' : 'Confirmando...')
              : 'Revocar'}
          </button>
        )}
      </div>

      {/* Inline QR panel */}
      {showQr && (
        <div className="ml-6 mt-1 flex items-center gap-3 sm:col-span-2">
          <QRCodeLink serial={p.serial} size={96} />
          <div>
            <p className="text-[11px] font-medium text-gray-500">Escanea para verificar</p>
            <p className="mt-0.5 break-all font-mono text-[10px] text-gray-400">
              {window.location.origin}?serial={p.serial}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusPill({ status }: { status: 'active' | 'revoked' }) {
  return status === 'active' ? (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Activo</span>
  ) : (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Revocado</span>
  )
}

function InfoCell({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="mt-0.5 block font-mono text-xs font-semibold text-indigo-600 underline decoration-dotted hover:text-indigo-800">
          {value}
        </a>
      ) : (
        <p className="mt-0.5 text-xs font-semibold text-gray-800">{value}</p>
      )}
    </div>
  )
}
