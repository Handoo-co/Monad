export type ProductStatus = "Valid" | "Sold" | "Revoked" // status strings

export type Product = {
  issuer: `0x${string}`
  serialHash: `0x${string}`
  metadataHash: `0x${string}`
  productLine: string
  owner: `0x${string}`
  status: ProductStatus
  lat?: number
  lng?: number
  isSimulated?: boolean
  description?: string
  brand?: string
  locationName?: string
  issuedAt: bigint
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
