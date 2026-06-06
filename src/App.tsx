import { useMemo, useState } from 'react'
import { ConnectButton } from './components/ConnectButton'
import { PublicProductView } from './components/PublicProductView'
import { CompanyPortal } from './components/CompanyPortal'
import { AdminPanel } from './components/AdminPanel'
import { parseProductRoute } from './lib/productUrl'

type View = 'buyer' | 'company' | 'admin'

const navItems: { id: View; label: string }[] = [
  { id: 'buyer', label: 'Comprador' },
  { id: 'company', label: 'Empresa' },
  { id: 'admin', label: 'Admin' },
]

export default function App() {
  const isQrPath = window.location.pathname.split('/').filter(Boolean)[0] === 'p'
  const route = useMemo(
    () => parseProductRoute(window.location.pathname, window.location.search),
    [],
  )
  const [view, setView] = useState<View>('buyer')

  return (
    <div className="min-h-screen bg-gray-100 text-gray-950">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold">Handoo OriginPass V2</h1>
            <p className="text-sm text-gray-500">QR publico, empresas verificadas y productos artesanales.</p>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!isQrPath && (
          <nav className="mb-6 grid grid-cols-3 rounded-lg border border-gray-200 bg-white p-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  view === item.id ? 'bg-gray-950 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {isQrPath || view === 'buyer' ? (
          <PublicProductView route={route} invalidRoute={isQrPath && !route} />
        ) : view === 'company' ? (
          <CompanyPortal />
        ) : (
          <AdminPanel />
        )}
      </main>
    </div>
  )
}
