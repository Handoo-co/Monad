import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAccount, useConfig } from 'wagmi'
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import type { Address } from 'viem'
import { getPasaporteProductosAddress, getRegistroEmpresasAddress, hasV2Addresses, pasaporteProductosAbi, registroEmpresasAbi } from '../abi/handooV2'
import { hashPrivateValue } from '../lib/metadata'
import { estadoEmpresaLabel, estadoProductoLabel, formatDate, modoVerificacionLabel, shortAddress, tipoEmpresaLabel, tipoProductoLabel } from '../lib/format'
import { ESTADO_EMPRESA, ESTADO_PRODUCTO, type EmpresaV2, type ProductoV2 } from '../types'
import { ConnectButton } from './ConnectButton'
import { StatusPill } from './StatusPill'

type CompanyRow = {
  id: bigint
  company: EmpresaV2
}

type ProductRow = {
  id: bigint
  product: ProductoV2
}

export function AdminPanel() {
  const { address, isConnected } = useAccount()
  const config = useConfig()
  const [adminAddress, setAdminAddress] = useState<Address | null>(null)
  const [companies, setCompanies] = useState<CompanyRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = Boolean(address && adminAddress && address.toLowerCase() === adminAddress.toLowerCase())

  const loadAdminData = useCallback(async () => {
    if (!hasV2Addresses()) return

    try {
      setIsLoading(true)
      setError(null)

      const [loadedAdmin, totalCompanies, totalProducts] = await Promise.all([
        readContract(config, {
          address: getRegistroEmpresasAddress(),
          abi: registroEmpresasAbi,
          functionName: 'administrador',
          blockTag: 'latest',
        }) as Promise<Address>,
        readContract(config, {
          address: getRegistroEmpresasAddress(),
          abi: registroEmpresasAbi,
          functionName: 'totalEmpresas',
          blockTag: 'latest',
        }) as Promise<bigint>,
        readContract(config, {
          address: getPasaporteProductosAddress(),
          abi: pasaporteProductosAbi,
          functionName: 'totalProductos',
          blockTag: 'latest',
        }) as Promise<bigint>,
      ])

      const loadedCompanies = await Promise.all(
        Array.from({ length: Number(totalCompanies) }, async (_, index) => {
          const [id, company] = await readContract(config, {
            address: getRegistroEmpresasAddress(),
            abi: registroEmpresasAbi,
            functionName: 'empresaPorIndice',
            args: [BigInt(index)],
            blockTag: 'latest',
          }) as readonly [bigint, EmpresaV2]
          return { id, company }
        }),
      )

      const loadedProducts = await Promise.all(
        Array.from({ length: Number(totalProducts) }, async (_, index) => {
          const [id, product] = await readContract(config, {
            address: getPasaporteProductosAddress(),
            abi: pasaporteProductosAbi,
            functionName: 'productoPorIndice',
            args: [BigInt(index)],
            blockTag: 'latest',
          }) as readonly [bigint, ProductoV2]
          return { id, product }
        }),
      )

      setAdminAddress(loadedAdmin)
      setCompanies(loadedCompanies)
      setProducts(loadedProducts)
    } catch {
      setError('No se pudo cargar la vista administrativa.')
    } finally {
      setIsLoading(false)
    }
  }, [config])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadAdminData()
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [loadAdminData])

  async function executeAdminAction(action: () => Promise<`0x${string}`>, success: string) {
    setError(null)
    setMessage(null)
    try {
      const txHash = await action()
      await waitForTransactionReceipt(config, { hash: txHash })
      setMessage(success)
      await loadAdminData()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('SoloAdministrador') ? 'Esta wallet no es administradora.' : 'La transaccion admin fallo.')
    }
  }

  if (!hasV2Addresses()) {
    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-950">Contratos V2 sin configurar</p>
        <p className="mt-2 text-sm text-amber-800">
          Configura los addresses V2 para habilitar el panel administrativo.
        </p>
      </section>
    )
  }

  if (!isConnected) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-gray-950">Administracion Handoo</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Conecta la wallet administradora para revisar empresas y productos.
        </p>
        <div className="mt-5 flex justify-center">
          <ConnectButton />
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Panel administrativo</h2>
            <p className="mt-1 text-sm text-gray-500">
              Admin: {adminAddress ? shortAddress(adminAddress) : 'Cargando'}
            </p>
          </div>
          <StatusPill label={isAdmin ? 'Wallet admin' : 'Solo lectura'} tone={isAdmin ? 'success' : 'warning'} />
        </div>
      </div>

      {(message || error || isLoading) && (
        <div className={`rounded-lg border p-4 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          {error ?? message ?? 'Cargando datos on-chain...'}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-gray-950">Empresas registradas</h3>
        <div className="mt-4 grid gap-3">
          {companies.length === 0 ? (
            <p className="text-sm text-gray-500">No hay empresas registradas.</p>
          ) : (
            companies.map(({ id, company }) => (
              <div key={id.toString()} className="rounded-md border border-gray-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-950">{company.nombre}</p>
                    <p className="mt-1 text-xs text-gray-500">{shortAddress(company.cuenta)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill label={estadoEmpresaLabel(company.estado)} tone={company.estado === ESTADO_EMPRESA.Aprobada ? 'success' : 'warning'} />
                    <StatusPill label={tipoEmpresaLabel(company.tipoEmpresa)} tone="info" />
                  </div>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <Info label="Modo" value={modoVerificacionLabel(company.modoVerificacion)} />
                  <Info label="Actualizada" value={formatDate(company.actualizadaEn)} />
                  <Info label="Hash verificacion" value={company.hashVerificacion === `0x${'0'.repeat(64)}` ? 'No aplica' : shortAddress(company.hashVerificacion)} />
                  <Info label="Metadata" value={company.metadataURI} />
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminButton disabled={!isAdmin} onClick={() => executeAdminAction(
                    () => writeContract(config, {
                      address: getRegistroEmpresasAddress(),
                      abi: registroEmpresasAbi,
                      functionName: 'aprobarEmpresa',
                      args: [id],
                    }),
                    'Empresa aprobada.',
                  )}>
                    Aprobar
                  </AdminButton>
                  <AdminButton disabled={!isAdmin} onClick={() => executeAdminAction(
                    () => writeContract(config, {
                      address: getRegistroEmpresasAddress(),
                      abi: registroEmpresasAbi,
                      functionName: 'rechazarEmpresa',
                      args: [id, hashPrivateValue(`rechazo:${id.toString()}`)],
                    }),
                    'Empresa rechazada.',
                  )}>
                    Rechazar
                  </AdminButton>
                  <AdminButton disabled={!isAdmin} onClick={() => executeAdminAction(
                    () => writeContract(config, {
                      address: getRegistroEmpresasAddress(),
                      abi: registroEmpresasAbi,
                      functionName: 'suspenderEmpresa',
                      args: [id, hashPrivateValue(`suspension:${id.toString()}`)],
                    }),
                    'Empresa suspendida.',
                  )}>
                    Suspender
                  </AdminButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-base font-bold text-gray-950">Productos registrados</h3>
        <div className="mt-4 grid gap-3">
          {products.length === 0 ? (
            <p className="text-sm text-gray-500">No hay productos registrados.</p>
          ) : (
            products.map(({ id, product }) => (
              <div key={id.toString()} className="rounded-md border border-gray-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-950">Producto #{id.toString()}</p>
                    <p className="mt-1 text-xs text-gray-500">{shortAddress(product.productHash)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill label={estadoProductoLabel(product.estado)} tone={product.estado === ESTADO_PRODUCTO.Activo ? 'success' : 'danger'} />
                    <StatusPill label={tipoProductoLabel(product.tipoProducto)} tone="info" />
                  </div>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <Info label="Empresa" value={shortAddress(product.empresa)} />
                  <Info label="Fecha" value={formatDate(product.registradoEn)} />
                  <Info label="Metadata" value={product.metadataURI} />
                </dl>
                <div className="mt-4">
                  <AdminButton disabled={!isAdmin || product.estado === ESTADO_PRODUCTO.Revocado} onClick={() => executeAdminAction(
                    () => writeContract(config, {
                      address: getPasaporteProductosAddress(),
                      abi: pasaporteProductosAbi,
                      functionName: 'revocarProducto',
                      args: [id, hashPrivateValue(`revocacion:${id.toString()}`)],
                    }),
                    'Producto revocado.',
                  )}>
                    Revocar producto
                  </AdminButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function AdminButton(props: {
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {props.children}
    </button>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-gray-400">{label}</dt>
      <dd className="mt-1 break-all text-gray-800">{value}</dd>
    </div>
  )
}
