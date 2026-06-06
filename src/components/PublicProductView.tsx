import { useEffect, useMemo, useState } from 'react'
import { readContract } from 'wagmi/actions'
import type { Address } from 'viem'
import { pasaporteProductosAbi, registroEmpresasAbi } from '../abi/handooV2'
import { monadTestnet } from '../config/chains'
import {
  DEMO_CHAIN_COMPANY,
  DEMO_CHAIN_PRODUCT,
  DEMO_COMPANY_METADATA,
  DEMO_PRODUCT_CONTRACT,
  DEMO_PRODUCT_HASH,
  DEMO_PRODUCT_METADATA,
} from '../data/demo'
import { fetchMetadata } from '../lib/metadata'
import { buildProductUrl, type ProductRoute } from '../lib/productUrl'
import { estadoEmpresaLabel, estadoProductoLabel, formatDate, shortAddress, tipoEmpresaLabel, tipoProductoLabel } from '../lib/format'
import { ESTADO_EMPRESA, ESTADO_PRODUCTO, TIPO_PRODUCTO } from '../types'
import type { CompanyMetadata, EmpresaV2, ProductMetadata, ProductoV2 } from '../types'
import { StatusPill } from './StatusPill'
import { QrCodePanel } from './QrCodePanel'
import { useConfig } from 'wagmi'

type PublicProductViewProps = {
  route: ProductRoute | null
  invalidRoute?: boolean
}

type LoadedProduct = {
  product: ProductoV2
  company: EmpresaV2
  productMetadata: ProductMetadata
  companyMetadata: CompanyMetadata
}

export function PublicProductView({ route, invalidRoute = false }: PublicProductViewProps) {
  const config = useConfig()
  const [loaded, setLoaded] = useState<LoadedProduct | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(route))
  const [error, setError] = useState<string | null>(null)

  const demoUrl = useMemo(
    () => buildProductUrl(DEMO_PRODUCT_CONTRACT, DEMO_CHAIN_PRODUCT.id, DEMO_PRODUCT_HASH),
    [],
  )

  useEffect(() => {
    let active = true

    async function loadRoute() {
      if (invalidRoute) {
        setLoaded(null)
        setError('La URL QR no tiene un formato valido.')
        setIsLoading(false)
        return
      }

      const isDemoRoute = Boolean(
        route
        && route.chainId === monadTestnet.id
        && route.productId === DEMO_CHAIN_PRODUCT.id
        && route.contractAddress.toLowerCase() === DEMO_PRODUCT_CONTRACT.toLowerCase()
        && route.productHash.toLowerCase() === DEMO_PRODUCT_HASH.toLowerCase(),
      )

      if (!route || isDemoRoute) {
        setLoaded({
          product: DEMO_CHAIN_PRODUCT,
          company: DEMO_CHAIN_COMPANY,
          productMetadata: DEMO_PRODUCT_METADATA,
          companyMetadata: DEMO_COMPANY_METADATA,
        })
        setIsLoading(false)
        setError(null)
        return
      }

      if (route.chainId !== monadTestnet.id) {
        setError('El QR no apunta a Monad Testnet.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const product = await readContract(config, {
          address: route.contractAddress,
          abi: pasaporteProductosAbi,
          functionName: 'verificarProducto',
          args: [route.productId, route.productHash],
          blockTag: 'latest',
        }) as ProductoV2

        const registryAddress = await readContract(config, {
          address: route.contractAddress,
          abi: pasaporteProductosAbi,
          functionName: 'registroEmpresas',
          blockTag: 'latest',
        }) as Address

        const [, company] = await readContract(config, {
          address: registryAddress,
          abi: registroEmpresasAbi,
          functionName: 'obtenerEmpresaPorCuenta',
          args: [product.empresa],
          blockTag: 'latest',
        }) as readonly [bigint, EmpresaV2]

        const [productMetadata, companyMetadata] = await Promise.all([
          fetchMetadata<ProductMetadata>(product.metadataURI),
          fetchMetadata<CompanyMetadata>(company.metadataURI),
        ])

        if (!active) return
        setLoaded({
          product,
          company,
          productMetadata: productMetadata ?? {
            name: 'Producto registrado',
            category: tipoProductoLabel(product.tipoProducto),
            origin: 'Origen declarado por empresa emisora',
            description: 'La metadata publica no esta disponible.',
          },
          companyMetadata: companyMetadata ?? {
            name: company.nombre,
            displayName: company.nombre,
            location: 'Ubicacion no disponible',
            description: 'La metadata publica de la empresa no esta disponible.',
            verificationClaim: 'Empresa registrada en Handoo OriginPass.',
          },
        })
      } catch {
        if (active) setError('No se pudo verificar este QR en el contrato de Monad.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadRoute()
    return () => {
      active = false
    }
  }, [config, invalidRoute, route])

  if (isLoading) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm font-semibold text-gray-900">Verificando producto en Monad</p>
        <p className="mt-2 text-sm text-gray-500">Consultando contrato y metadata publica.</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-lg border border-rose-200 bg-rose-50 p-6">
        <p className="text-sm font-semibold text-rose-900">QR no verificable</p>
        <p className="mt-2 text-sm text-rose-700">{error}</p>
      </section>
    )
  }

  if (!loaded) return null

  const { product, company, productMetadata, companyMetadata } = loaded
  const isArtisan = product.tipoProducto === TIPO_PRODUCTO.Artesanal
  const productTone = product.estado === ESTADO_PRODUCTO.Activo ? 'success' : 'danger'
  const companyTone = company.estado === ESTADO_EMPRESA.Aprobada ? 'success' : 'warning'

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill label={estadoProductoLabel(product.estado)} tone={productTone} />
          <StatusPill label={tipoProductoLabel(product.tipoProducto)} tone={isArtisan ? 'info' : 'success'} />
          <StatusPill label={estadoEmpresaLabel(company.estado)} tone={companyTone} />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-gray-500">Producto</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">{productMetadata.name}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">{productMetadata.description}</p>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Categoria" value={productMetadata.category} />
              <Info label="Origen" value={productMetadata.origin} />
              <Info label="Registro" value={`#${product.id.toString()}`} />
              <Info label="Fecha" value={formatDate(product.registradoEn)} />
            </dl>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold uppercase text-gray-500">Empresa emisora</p>
            <h3 className="mt-1 text-lg font-bold text-gray-950">{companyMetadata.displayName}</h3>
            <p className="mt-2 text-sm text-gray-600">{companyMetadata.description}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <Info label="Tipo" value={tipoEmpresaLabel(company.tipoEmpresa)} />
              <Info label="Ubicacion" value={companyMetadata.location} />
              <Info label="Wallet" value={shortAddress(company.cuenta)} />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Declaracion verificable</p>
          <p className="mt-1 text-sm leading-6 text-gray-600">{companyMetadata.verificationClaim}</p>
        </div>
      </div>

      {!route && <QrCodePanel url={demoUrl} />}
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-gray-400">{label}</dt>
      <dd className="mt-1 text-gray-800">{value}</dd>
    </div>
  )
}
