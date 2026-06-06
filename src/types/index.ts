export type Hex = `0x${string}`
export type Address = `0x${string}`

export const TIPO_EMPRESA = {
  Comercial: 0,
  Artesanal: 1,
} as const

export const MODO_VERIFICACION = {
  CamaraComercio: 0,
  RegistroOficial: 1,
  RevisionArtesanalAdmin: 2,
} as const

export const ESTADO_EMPRESA = {
  Pendiente: 0,
  Aprobada: 1,
  Rechazada: 2,
  Suspendida: 3,
} as const

export const TIPO_PRODUCTO = {
  ComercialOriginal: 0,
  Artesanal: 1,
} as const

export const ESTADO_PRODUCTO = {
  Activo: 0,
  Revocado: 1,
} as const

export type TipoEmpresa = typeof TIPO_EMPRESA[keyof typeof TIPO_EMPRESA]
export type ModoVerificacion = typeof MODO_VERIFICACION[keyof typeof MODO_VERIFICACION]
export type EstadoEmpresa = typeof ESTADO_EMPRESA[keyof typeof ESTADO_EMPRESA]
export type TipoProducto = typeof TIPO_PRODUCTO[keyof typeof TIPO_PRODUCTO]
export type EstadoProducto = typeof ESTADO_PRODUCTO[keyof typeof ESTADO_PRODUCTO]

export type EmpresaV2 = {
  cuenta: Address
  nombre: string
  tipoEmpresa: TipoEmpresa
  modoVerificacion: ModoVerificacion
  estado: EstadoEmpresa
  metadataHash: Hex
  metadataURI: string
  hashVerificacion: Hex
  solicitadaEn: bigint
  actualizadaEn: bigint
}

export type ProductoV2 = {
  id: bigint
  empresa: Address
  tipoProducto: TipoProducto
  estado: EstadoProducto
  metadataHash: Hex
  metadataURI: string
  productHash: Hex
  registradoEn: bigint
  actualizadoEn: bigint
}

export type CompanyMetadata = {
  name: string
  displayName: string
  location: string
  description: string
  verificationClaim: string
  website?: string
}

export type ProductMetadata = {
  name: string
  category: string
  origin: string
  description: string
  image?: string
}
