import { hashMetadata } from '../lib/metadata'
import type { Address, CompanyMetadata, Hex, ProductMetadata } from '../types'
import { ESTADO_EMPRESA, ESTADO_PRODUCTO, MODO_VERIFICACION, TIPO_EMPRESA, TIPO_PRODUCTO } from '../types'

export const DEMO_COMPANY_ADDRESS = '0x0000000000000000000000000000000000001001' as Address
export const DEMO_ARTISAN_ADDRESS = '0x0000000000000000000000000000000000002002' as Address
export const DEMO_PRODUCT_CONTRACT = '0x0000000000000000000000000000000000009009' as Address
export const DEMO_PRODUCT_HASH =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Hex

export const DEMO_COMPANY_METADATA: CompanyMetadata = {
  name: 'Handoo Demo Brand S.A.S.',
  displayName: 'Handoo Demo Store',
  location: 'Medellin, Antioquia, Colombia',
  description: 'Tienda comercial con verificacion legal de empresa y ubicacion para emitir pasaportes de origen.',
  verificationClaim: 'Empresa verificada por certificado de Camara de Comercio. Producto atestado por la empresa emisora.',
  website: 'https://handoo.co',
}

export const DEMO_ARTISAN_METADATA: CompanyMetadata = {
  name: 'Taller Artesanal La Montana',
  displayName: 'La Montana Artesanal',
  location: 'Santa Elena, Antioquia, Colombia',
  description: 'Taller artesanal aprobado por revision administrativa de Handoo.',
  verificationClaim: 'Empresa artesanal aprobada por Handoo. No requiere Camara de Comercio para este modo.',
}

export const DEMO_PRODUCT_METADATA: ProductMetadata = {
  name: 'Sombrero vueltiao demo',
  category: 'Accesorio artesanal',
  origin: 'Medellin, Antioquia',
  description: 'Producto registrado en Monad con ficha publica verificable por QR.',
}

export const DEMO_CHAIN_COMPANY = {
  cuenta: DEMO_COMPANY_ADDRESS,
  nombre: DEMO_COMPANY_METADATA.name,
  tipoEmpresa: TIPO_EMPRESA.Comercial,
  modoVerificacion: MODO_VERIFICACION.CamaraComercio,
  estado: ESTADO_EMPRESA.Aprobada,
  metadataHash: hashMetadata(DEMO_COMPANY_METADATA),
  metadataURI: '/demo-metadata/company-commercial.json',
  hashVerificacion: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as Hex,
  solicitadaEn: 1780704000n,
  actualizadaEn: 1780704000n,
}

export const DEMO_CHAIN_PRODUCT = {
  id: 1n,
  empresa: DEMO_COMPANY_ADDRESS,
  tipoProducto: TIPO_PRODUCTO.ComercialOriginal,
  estado: ESTADO_PRODUCTO.Activo,
  metadataHash: hashMetadata(DEMO_PRODUCT_METADATA),
  metadataURI: '/demo-metadata/product-commercial.json',
  productHash: DEMO_PRODUCT_HASH,
  registradoEn: 1780704000n,
  actualizadoEn: 1780704000n,
}
