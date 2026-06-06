import { useCallback, useEffect, useState } from 'react'
import { useAccount, useConfig } from 'wagmi'
import { decodeEventLog, type Hex } from 'viem'
import { readContract, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { getPasaporteProductosAddress, getRegistroEmpresasAddress, hasV2Addresses, pasaporteProductosAbi, registroEmpresasAbi } from '../abi/handooV2'
import { buildCompanyMetadata, buildProductMetadata, hashMetadata, hashPrivateValue } from '../lib/metadata'
import { buildProductUrl } from '../lib/productUrl'
import { estadoEmpresaLabel, estadoProductoLabel, shortAddress, tipoEmpresaLabel, tipoProductoLabel } from '../lib/format'
import {
  ESTADO_EMPRESA,
  MODO_VERIFICACION,
  TIPO_EMPRESA,
  TIPO_PRODUCTO,
  type EmpresaV2,
  type ProductoV2,
  type TipoEmpresa,
  type TipoProducto,
} from '../types'
import { ConnectButton } from './ConnectButton'
import { QrCodePanel } from './QrCodePanel'
import { StatusPill } from './StatusPill'

type CreatedProduct = {
  id: bigint
  productHash: Hex
  url: string
}

export function CompanyPortal() {
  const { address, isConnected } = useAccount()
  const config = useConfig()
  const [company, setCompany] = useState<EmpresaV2 | null>(null)
  const [products, setProducts] = useState<ProductoV2[]>([])
  const [createdProduct, setCreatedProduct] = useState<CreatedProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCompany = useCallback(async () => {
    if (!address || !hasV2Addresses()) return

    try {
      setIsLoading(true)
      const [, loadedCompany] = await readContract(config, {
        address: getRegistroEmpresasAddress(),
        abi: registroEmpresasAbi,
        functionName: 'obtenerEmpresaPorCuenta',
        args: [address],
        blockTag: 'latest',
      }) as readonly [bigint, EmpresaV2]

      setCompany(loadedCompany)

      const total = await readContract(config, {
        address: getPasaporteProductosAddress(),
        abi: pasaporteProductosAbi,
        functionName: 'totalProductosEmpresa',
        args: [address],
        blockTag: 'latest',
      }) as bigint

      const nextProducts = await Promise.all(
        Array.from({ length: Number(total) }, async (_, index) => {
          const [, product] = await readContract(config, {
            address: getPasaporteProductosAddress(),
            abi: pasaporteProductosAbi,
            functionName: 'productoEmpresaPorIndice',
            args: [address, BigInt(index)],
            blockTag: 'latest',
          }) as readonly [bigint, ProductoV2]
          return product
        }),
      )
      setProducts(nextProducts)
    } catch {
      setCompany(null)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [address, config])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadCompany()
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [loadCompany])

  async function handleCompanySubmit(formData: FormData) {
    if (!address) return
    setError(null)
    setMessage(null)

    try {
      const tipoEmpresa = Number(formData.get('tipoEmpresa')) as TipoEmpresa
      const name = String(formData.get('name') ?? '')
      const displayName = String(formData.get('displayName') ?? '')
      const location = String(formData.get('location') ?? '')
      const description = String(formData.get('description') ?? '')
      const website = String(formData.get('website') ?? '')
      const metadataURI = String(formData.get('metadataURI') ?? '')
      const verificationCode = String(formData.get('verificationCode') ?? '')
      const modoVerificacion = tipoEmpresa === TIPO_EMPRESA.Artesanal
        ? MODO_VERIFICACION.RevisionArtesanalAdmin
        : Number(formData.get('modoVerificacion'))

      const metadata = buildCompanyMetadata({
        name,
        displayName,
        location,
        description,
        website,
        verificationClaim: tipoEmpresa === TIPO_EMPRESA.Artesanal
          ? 'Empresa artesanal pendiente de revision administrativa Handoo.'
          : 'Empresa pendiente de validacion contra registro oficial.',
      })

      const txHash = await writeContract(config, {
        address: getRegistroEmpresasAddress(),
        abi: registroEmpresasAbi,
        functionName: 'solicitarRegistroEmpresa',
        args: [
          name.trim(),
          tipoEmpresa,
          modoVerificacion,
          hashMetadata(metadata),
          metadataURI.trim(),
          tipoEmpresa === TIPO_EMPRESA.Artesanal ? hashPrivateValue('') : hashPrivateValue(verificationCode),
        ],
      })

      await waitForTransactionReceipt(config, { hash: txHash })
      setMessage('Solicitud enviada. Queda pendiente de revision admin.')
      await loadCompany()
    } catch (err) {
      setError(mapError(err, 'No se pudo enviar la solicitud.'))
    }
  }

  async function handleProductSubmit(formData: FormData) {
    if (!company) return
    setError(null)
    setMessage(null)
    setCreatedProduct(null)

    try {
      const productType = (company.tipoEmpresa === TIPO_EMPRESA.Artesanal
        ? TIPO_PRODUCTO.Artesanal
        : TIPO_PRODUCTO.ComercialOriginal) as TipoProducto
      const metadataURI = String(formData.get('metadataURI') ?? '')
      const metadata = buildProductMetadata({
        name: String(formData.get('name') ?? ''),
        category: String(formData.get('category') ?? ''),
        origin: String(formData.get('origin') ?? ''),
        description: String(formData.get('description') ?? ''),
        image: String(formData.get('image') ?? ''),
      })

      const txHash = await writeContract(config, {
        address: getPasaporteProductosAddress(),
        abi: pasaporteProductosAbi,
        functionName: 'registrarProducto',
        args: [productType, hashMetadata(metadata), metadataURI.trim()],
      })

      const receipt = await waitForTransactionReceipt(config, { hash: txHash })
      const created = extractCreatedProduct(receipt.logs)
      if (created) {
        setCreatedProduct({
          id: created.id,
          productHash: created.productHash,
          url: buildProductUrl(getPasaporteProductosAddress(), created.id, created.productHash),
        })
      }

      setMessage('Producto registrado en Monad.')
      await loadCompany()
    } catch (err) {
      setError(mapError(err, 'No se pudo registrar el producto.'))
    }
  }

  if (!hasV2Addresses()) {
    return (
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-950">Contratos V2 sin configurar</p>
        <p className="mt-2 text-sm text-amber-800">
          Configura `VITE_REGISTRO_EMPRESAS_ADDRESS` y `VITE_PASAPORTE_PRODUCTOS_ADDRESS`.
        </p>
      </section>
    )
  }

  if (!isConnected) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-gray-950">Portal de empresa</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Conecta la wallet que representara a la empresa emisora.
        </p>
        <div className="mt-5 flex justify-center">
          <ConnectButton />
        </div>
      </section>
    )
  }

  const canIssue = company?.estado === ESTADO_EMPRESA.Aprobada

  return (
    <section className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          className="rounded-lg border border-gray-200 bg-white p-5"
          action={formData => void handleCompanySubmit(formData)}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-950">Registro de empresa</h2>
              <p className="mt-1 text-sm text-gray-500">Wallet: {address ? shortAddress(address) : ''}</p>
            </div>
            {company && <StatusPill label={estadoEmpresaLabel(company.estado)} tone={canIssue ? 'success' : 'warning'} />}
          </div>

          <div className="mt-5 grid gap-3">
            <TextField name="name" label="Razon social o nombre legal" defaultValue={company?.nombre ?? ''} required />
            <TextField name="displayName" label="Nombre visible" defaultValue={company?.nombre ?? ''} required />
            <TextField name="location" label="Ubicacion de tienda/taller" defaultValue="Medellin, Antioquia" required />
            <TextField name="website" label="Sitio web o red social" />
            <TextField name="metadataURI" label="Metadata URI publica" defaultValue="/demo-metadata/company-commercial.json" required />
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-gray-700">Tipo de empresa</span>
              <select name="tipoEmpresa" className="rounded-md border border-gray-300 px-3 py-2">
                <option value={TIPO_EMPRESA.Comercial}>Comercial verificada</option>
                <option value={TIPO_EMPRESA.Artesanal}>Artesanal aprobada por Handoo</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-gray-700">Modo de verificacion comercial</span>
              <select name="modoVerificacion" className="rounded-md border border-gray-300 px-3 py-2">
                <option value={MODO_VERIFICACION.CamaraComercio}>Camara de Comercio</option>
                <option value={MODO_VERIFICACION.RegistroOficial}>Registro oficial equivalente</option>
              </select>
            </label>
            <TextField name="verificationCode" label="Codigo privado de verificacion comercial" />
            <label className="grid gap-1 text-sm">
              <span className="font-semibold text-gray-700">Descripcion publica</span>
              <textarea
                name="description"
                className="min-h-24 rounded-md border border-gray-300 px-3 py-2"
                defaultValue="Empresa emisora de productos originales registrados en Monad."
              />
            </label>
          </div>

          <button className="mt-5 w-full rounded-md bg-gray-950 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800">
            Enviar solicitud
          </button>
        </form>

        <div className="space-y-5">
          <form
            className="rounded-lg border border-gray-200 bg-white p-5"
            action={formData => void handleProductSubmit(formData)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-950">Registrar producto</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {company ? `Empresa ${tipoEmpresaLabel(company.tipoEmpresa).toLowerCase()}` : 'Solicita aprobacion primero'}
                </p>
              </div>
              <StatusPill label={canIssue ? 'Habilitado' : 'Bloqueado'} tone={canIssue ? 'success' : 'warning'} />
            </div>

            <fieldset disabled={!canIssue} className="mt-5 grid gap-3 disabled:opacity-55">
              <TextField name="name" label="Nombre del producto" defaultValue="Sombrero vueltiao demo" required />
              <TextField name="category" label="Categoria" defaultValue="Accesorio artesanal" required />
              <TextField name="origin" label="Lugar de origen" defaultValue="Medellin, Antioquia" required />
              <TextField name="metadataURI" label="Metadata URI publica" defaultValue="/demo-metadata/product-commercial.json" required />
              <TextField name="image" label="Imagen publica opcional" />
              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-gray-700">Descripcion publica</span>
                <textarea
                  name="description"
                  className="min-h-24 rounded-md border border-gray-300 px-3 py-2"
                  defaultValue="Producto con ficha publica y QR verificable en Monad."
                />
              </label>
              <button className="rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                Registrar y generar QR
              </button>
            </fieldset>
          </form>

          {createdProduct && <QrCodePanel url={createdProduct.url} />}
        </div>
      </div>

      {(message || error || isLoading) && (
        <div className={`rounded-lg border p-4 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          {error ?? message ?? 'Cargando informacion de empresa...'}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-gray-950">Productos de esta empresa</h2>
        <div className="mt-4 grid gap-3">
          {products.length === 0 ? (
            <p className="text-sm text-gray-500">Aun no hay productos registrados.</p>
          ) : (
            products.map(product => (
              <div key={product.id.toString()} className="rounded-md border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-950">Producto #{product.id.toString()}</p>
                    <p className="mt-1 text-xs text-gray-500">{shortAddress(product.productHash)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill label={tipoProductoLabel(product.tipoProducto)} tone="info" />
                    <StatusPill label={estadoProductoLabel(product.estado)} tone={product.estado === 0 ? 'success' : 'danger'} />
                  </div>
                </div>
                <div className="mt-3">
                  <QrCodePanel url={buildProductUrl(getPasaporteProductosAddress(), product.id, product.productHash)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function TextField(props: {
  name: string
  label: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-gray-700">{props.label}</span>
      <input
        name={props.name}
        defaultValue={props.defaultValue}
        required={props.required}
        className="rounded-md border border-gray-300 px-3 py-2"
      />
    </label>
  )
}

function extractCreatedProduct(logs: readonly { data: Hex; topics: readonly Hex[] }[]): CreatedProduct | null {
  for (const log of logs) {
    try {
      const decoded = decodeEventLog({
        abi: pasaporteProductosAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      })
      if (decoded.eventName !== 'ProductoRegistrado') continue
      const args = decoded.args as unknown as { id: bigint; productHash: Hex }
      return {
        id: args.id,
        productHash: args.productHash,
        url: buildProductUrl(getPasaporteProductosAddress(), args.id, args.productHash),
      }
    } catch {
      // Otro contrato emitio el log.
    }
  }
  return null
}

function mapError(err: unknown, fallback: string): string {
  const msg = err instanceof Error ? err.message : ''
  if (msg.includes('EmpresaNoEditable')) return 'La empresa ya esta aprobada o suspendida.'
  if (msg.includes('HashVerificacionInvalido')) return 'La empresa comercial necesita codigo/hash de verificacion.'
  if (msg.includes('ModoVerificacionInvalido')) return 'El modo de verificacion no corresponde al tipo de empresa.'
  if (msg.includes('EmpresaNoAprobada')) return 'La empresa aun no esta aprobada para emitir productos.'
  if (msg.includes('TipoProductoInvalido')) return 'El tipo de producto no corresponde al tipo de empresa.'
  if (msg.includes('VITE_')) return 'Faltan addresses reales de contratos V2 en variables de entorno.'
  return fallback
}
