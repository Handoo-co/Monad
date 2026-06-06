import { useState } from 'react'
import { ADMIN_BRANDS, ADMIN_PRODUCTS, EXPLORER_URL } from '../data/adminDemo'
import type { AdminBrand, AdminProduct } from '../data/adminDemo'

type Tab = 'overview' | 'brands' | 'products'

export function AdminView() {
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  const totalActive = ADMIN_PRODUCTS.filter(p => p.status === 'active').length
  const totalRevoked = ADMIN_PRODUCTS.filter(p => p.status === 'revoked').length
  const activeBrands = ADMIN_BRANDS.filter(b => b.status === 'active').length

  const filteredProducts = selectedBrand
    ? ADMIN_PRODUCTS.filter(p => p.brand === selectedBrand)
    : ADMIN_PRODUCTS

  return (
    <div className="min-h-screen bg-white">
      {/* Admin header */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-[11px] text-gray-400">Handoo OriginPass · Monad Testnet</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">Chain 10143 · En vivo</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1">
            {([
              { id: 'overview', label: 'Resumen' },
              { id: 'brands', label: 'Empresas' },
              { id: 'products', label: 'Productos' },
            ] as { id: Tab; label: string }[]).map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSelectedBrand(null) }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Empresas registradas" value={ADMIN_BRANDS.length} sub={`${activeBrands} activas`} color="indigo" />
              <StatCard label="Pasaportes emitidos" value={ADMIN_PRODUCTS.length} sub="total en cadena" color="purple" />
              <StatCard label="Activos" value={totalActive} sub="verificables hoy" color="emerald" />
              <StatCard label="Revocados" value={totalRevoked} sub="retirados" color="amber" />
            </div>

            {/* Companies quick list */}
            <div>
              <SectionHeader title="Empresas" action={{ label: 'Ver todas', onClick: () => setTab('brands') }} />
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                      <Th>Empresa</Th>
                      <Th>Certifica ante</Th>
                      <Th>Pasaportes</Th>
                      <Th>Estado</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ADMIN_BRANDS.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{b.name}</p>
                          <p className="text-xs text-gray-400">{b.category}</p>
                        </td>
                        <Td>{b.certifier}</Td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {b.productCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={b.status} type="brand" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent products */}
            <div>
              <SectionHeader title="Últimos pasaportes" action={{ label: 'Ver todos', onClick: () => setTab('products') }} />
              <ProductTable products={ADMIN_PRODUCTS.slice(-5).reverse()} />
            </div>
          </div>
        )}

        {/* ── BRANDS ── */}
        {tab === 'brands' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ADMIN_BRANDS.map(b => (
                <BrandCard
                  key={b.id}
                  brand={b}
                  onViewProducts={() => {
                    setSelectedBrand(b.name)
                    setTab('products')
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedBrand(null)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  !selectedBrand ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos ({ADMIN_PRODUCTS.length})
              </button>
              {ADMIN_BRANDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.name)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedBrand === b.name
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b.name} ({ADMIN_PRODUCTS.filter(p => p.brand === b.name).length})
                </button>
              ))}
            </div>

            <ProductTable products={filteredProducts} showBrand />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: {
  label: string; value: number; sub: string
  color: 'indigo' | 'purple' | 'emerald' | 'amber'
}) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-0.5 text-xs opacity-70">{sub}</p>
    </div>
  )
}

function SectionHeader({ title, action }: { title: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</h2>
      {action && (
        <button onClick={action.onClick} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
          {action.label} →
        </button>
      )}
    </div>
  )
}

function BrandCard({ brand, onViewProducts }: { brand: AdminBrand; onViewProducts: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
          {brand.name[0]}
        </div>
        <StatusBadge status={brand.status} type="brand" />
      </div>

      <div className="mt-3">
        <h3 className="font-bold text-gray-900">{brand.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{brand.category}</p>
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-3 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Certifica ante</span>
          <span className="font-medium text-gray-700">{brand.certifier}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Wallet</span>
          <a
            href={`${EXPLORER_URL}/address/${brand.wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-medium text-indigo-600 hover:text-indigo-800 underline decoration-dotted"
          >
            {brand.wallet.slice(0, 6)}...{brand.wallet.slice(-4)}
          </a>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Registro</span>
          <span className="font-medium text-gray-700">{brand.registeredAt}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {brand.productCount} pasaportes
        </span>
        <button
          onClick={onViewProducts}
          className="text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
        >
          Ver productos →
        </button>
      </div>
    </div>
  )
}

function ProductTable({ products, showBrand }: { products: AdminProduct[]; showBrand?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left">
            <Th>Serial</Th>
            <Th>Línea de producto</Th>
            {showBrand && <Th>Empresa</Th>}
            <Th>Estado</Th>
            <Th>Emisión</Th>
            <Th>Wallet emisor</Th>
            <Th>Tx</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map(p => (
            <tr key={p.serial} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3">
                <span className="font-mono text-xs font-semibold text-gray-800">{p.serial}</span>
              </td>
              <Td>{p.productLine}</Td>
              {showBrand && (
                <td className="px-4 py-3 text-xs text-gray-600 font-medium whitespace-nowrap">{p.brand}</td>
              )}
              <td className="px-4 py-3">
                <StatusBadge status={p.status} type="product" />
              </td>
              <Td>{p.issuedAt}</Td>
              <td className="px-4 py-3">
                <a
                  href={`${EXPLORER_URL}/address/${p.brandWallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-medium text-indigo-600 hover:text-indigo-800 underline decoration-dotted"
                >
                  {p.brandWallet.slice(0, 6)}...{p.brandWallet.slice(-4)}
                </a>
              </td>
              <td className="px-4 py-3">
                <a
                  href={`${EXPLORER_URL}/tx/${p.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-purple-600 hover:text-purple-800 underline decoration-dotted"
                >
                  {p.txHash.slice(0, 8)}...
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status, type }: {
  status: 'active' | 'revoked' | 'suspended'
  type: 'brand' | 'product'
}) {
  if (status === 'active') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {type === 'brand' ? 'Activa' : 'Activo'}
    </span>
  )
  if (status === 'revoked') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Revocado
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      Suspendida
    </span>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-xs text-gray-600">{children}</td>
}
