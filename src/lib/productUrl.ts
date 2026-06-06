import type { Address, Hex } from '../types'
import { monadTestnet } from '../config/chains'

export type ProductRoute = {
  chainId: number
  contractAddress: Address
  productId: bigint
  productHash: Hex
}

export function buildProductUrl(contractAddress: Address, productId: bigint, productHash: Hex): string {
  const url = new URL(window.location.origin)
  url.pathname = `/p/${monadTestnet.id}/${contractAddress}/${productId.toString()}`
  url.searchParams.set('hash', productHash)
  return url.toString()
}

export function parseProductRoute(pathname: string, search: string): ProductRoute | null {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length !== 4 || parts[0] !== 'p') return null

  const chainId = Number(parts[1])
  const contractAddress = parts[2] as Address
  const productHash = new URLSearchParams(search).get('hash') as Hex | null

  if (!Number.isSafeInteger(chainId)) return null
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) return null
  if (!productHash || !/^0x[a-fA-F0-9]{64}$/.test(productHash)) return null

  let productId: bigint
  try {
    productId = BigInt(parts[3])
  } catch {
    return null
  }

  return { chainId, contractAddress, productId, productHash }
}
