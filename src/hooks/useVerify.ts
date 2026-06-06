import { useCallback, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { keccak256, toHex } from 'viem'
import { originPassAbi, ORIGINPASS_ADDRESS } from '../abi/originPass'
import type { UseVerifyReturn, Product } from '../types'

export function useVerify(): UseVerifyReturn {
  const publicClient = usePublicClient()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const verify = useCallback(async (serial: string) => {
    if (!publicClient) return
    setIsLoading(true)
    setProduct(null)
    setNotFound(false)

    try {
      const serialHash = keccak256(toHex(serial))

      // blockTag: 'latest' = estado "proposed" en Monad — el más rápido disponible.
      // Nota: tras un issueProduct exitoso esperar ~1.2s antes de verificar (async execution).
      const result = await publicClient.readContract({
        address: ORIGINPASS_ADDRESS,
        abi: originPassAbi,
        functionName: 'verifyBySerial',
        args: [serialHash],
        blockTag: 'latest',
      })

      setProduct(result as Product)
    } catch (err) {
      // El contrato hace revert con "no encontrado" si el serial no existe
      setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }, [publicClient])

  const reset = () => {
    setProduct(null)
    setNotFound(false)
  }

  return { verify, product, isLoading, notFound, reset }
}
