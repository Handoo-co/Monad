import { useState } from 'react'
import type { UseVerifyReturn, Product } from '../types'
import { ADMIN_PRODUCTS } from '../data/adminDemo'

const MOCK_PRODUCTS: Record<string, Product | 'notfound'> = (() => {
  const map: Record<string, Product | 'notfound'> = {}
  for (const p of ADMIN_PRODUCTS) {
    map[p.serial] = {
      issuer: p.brandWallet,
      serialHash: p.txHash,
      metadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      productLine: p.productLine,
      owner: p.brandWallet,
      status: p.status === 'active' ? 0 : 1,
      issuedAt: BigInt(Math.floor(new Date(p.issuedAt).getTime() / 1000)),
    }
  }
  return map
})()

export function useVerify(): UseVerifyReturn {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const verify = (serial: string) => {
    setIsLoading(true)
    setProduct(null)
    setNotFound(false)

    setTimeout(() => {
      const result = MOCK_PRODUCTS[serial]
      if (!result || result === 'notfound') {
        setNotFound(true)
      } else {
        setProduct(result)
      }
      setIsLoading(false)
    }, 800)
  }

  const reset = () => {
    setProduct(null)
    setNotFound(false)
  }

  return { verify, product, isLoading, notFound, reset }
}
