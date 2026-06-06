import { useAccount } from 'wagmi'
import { ConnectButton } from './components/ConnectButton'
import { VerifyForm } from './components/VerifyForm'
import { IssueForm } from './components/IssueForm'

export default function App() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Handoo OriginPass</h1>
            <p className="text-xs text-gray-400">Pasaporte de autenticidad en Monad</p>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Estado desconectado */}
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
          <div className="text-5xl">🔏</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verifica la autenticidad de tu producto
            </h2>
            <p className="mt-2 max-w-sm mx-auto text-sm text-gray-500">
              Conecta tu wallet para verificar o emitir pasaportes de autenticidad registrados en Monad.
            </p>
          </div>
          <ConnectButton />
        </div>
      ) : (
        <main className="mx-auto max-w-2xl space-y-10 px-4 py-8">
          {/* Verificación — pantalla principal del comprador */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Verificar producto</h2>
              <p className="text-sm text-gray-400">
                Ingresa el serial o usa los botones de demo.
              </p>
            </div>
            <VerifyForm />
          </section>

          <div className="border-t border-gray-200" />

          {/* Emisión — solo para la marca autorizada */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Emitir pasaporte</h2>
              <p className="text-sm text-gray-400">
                Solo wallets autorizadas como emisores pueden usar esta sección.
              </p>
            </div>
            <IssueForm />
          </section>
        </main>
      )}
    </div>
  )
}
