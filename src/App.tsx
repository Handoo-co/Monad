import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from './components/ConnectButton'
import { ProductShowcase } from './components/ProductShowcase'
import { VerifyForm } from './components/VerifyForm'
import { IssueForm } from './components/IssueForm'
import { AdminView } from './components/AdminView'
import { BrandView } from './components/BrandView'

type View = 'public' | 'brand' | 'admin'

export default function App() {
  const { isConnected } = useAccount()
  const [pendingSerial, setPendingSerial] = useState<string | undefined>()
  const [view, setView] = useState<View>('public')

  const handleShowcaseVerify = (serial: string) => {
    setPendingSerial(serial)
    setTimeout(() => {
      document.getElementById('verify-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  // ── Admin view ───────────────────────────────────────────────────
  if (view === 'admin') return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <button onClick={() => setView('public')} className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
            ← Volver
          </button>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Admin</span>
        </div>
      </div>
      <AdminView />
    </div>
  )

  // ── Brand dashboard ──────────────────────────────────────────────
  if (view === 'brand') return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('public')} className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors">
              ← Inicio
            </button>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white text-xs font-bold">H</div>
              <span className="text-sm font-bold text-gray-900">Mi Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('admin')}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Admin
            </button>
            <ConnectButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Panel de marca</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona los pasaportes registrados bajo tu wallet.</p>
        </div>
        <BrandView />
      </main>
      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        Handoo OriginPass · MonadBlitz Medellín · Chain ID 10143
      </footer>
    </div>
  )

  // ── Public view ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white text-base font-bold">
              H
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">Handoo OriginPass</h1>
              <p className="text-[11px] text-gray-400 leading-tight">Pasaportes de autenticidad en Monad</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && (
              <button
                onClick={() => setView('brand')}
                className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Mi Panel
              </button>
            )}
            <button
              onClick={() => setView('admin')}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Admin
            </button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="rounded-2xl bg-gradient-to-br from-purple-700 to-purple-900 px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
            Powered by Monad Testnet · Chain 10143
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-snug max-w-xl">
            Cualquier empresa certifica cada producto<br />
            usando el serial que ya tiene.
          </h2>
          <p className="mt-3 text-sm text-purple-200 max-w-lg">
            El comprador escanea un QR y confirma que la unidad fue emitida por la marca y no fue revocada —
            sin confiar en el vendedor.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-xs text-purple-300">
            <span>⚡ 400ms block time</span>
            <span>10,000 TPS</span>
            <span>🔒 Pasaporte por unidad</span>
            <span>📦 Sin rediseñar fabricación</span>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ProductShowcase onVerify={handleShowcaseVerify} />
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <section id="verify-section" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-gray-900">Verificar autenticidad</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Ingresa o selecciona un serial para ver el sello.</p>
                </div>
                <VerifyForm
                  initialSerial={pendingSerial}
                  onSerialConsumed={() => setPendingSerial(undefined)}
                />
              </section>

              {isConnected ? (
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-gray-900">Emitir pasaporte</h2>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">Marca</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Solo wallets registradas como emisores.</p>
                  </div>
                  <IssueForm />
                  <button
                    onClick={() => setView('brand')}
                    className="mt-4 w-full rounded-xl border border-purple-100 py-2.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    Ver todos mis pasaportes →
                  </button>
                </section>
              ) : (
                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5 text-center">
                  <p className="text-sm font-semibold text-purple-900">¿Eres una marca?</p>
                  <p className="mt-1 text-xs text-purple-500">
                    Conecta tu wallet para emitir pasaportes de autenticidad.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <ConnectButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        Handoo OriginPass · MonadBlitz Medellín · Chain ID 10143
      </footer>
    </div>
  )
}
