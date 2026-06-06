export type ProductStatus = 0 | 1 // 0 = Active, 1 = Revoked

export type Product = {
  id?: bigint
  emisor: `0x${string}`
  hashSerial: `0x${string}`
  hashMetadatos: `0x${string}`
  lineaProducto: string
  duenoActual: `0x${string}`
  estado: ProductStatus
  emitidoEn: bigint
}

export type UseVerifyReturn = {
  verify: (serial: string) => void
  product: Product | null
  isLoading: boolean
  notFound: boolean
  reset: () => void
}

export type UseIssueReturn = {
  issue: (serial: string, productLine: string) => void
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  txHash: `0x${string}` | undefined
  error: string | null
  reset: () => void
}
