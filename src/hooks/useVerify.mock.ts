import { useState } from 'react'
import type { UseVerifyReturn, Product } from '../types'
import { DEMO_SERIALS } from '../data/demo'

// Simula los tres escenarios de la demo sin necesitar el contrato
const MOCK_PRODUCTS: Record<string, Product | 'notfound'> = {
  [DEMO_SERIALS.original]: {
    emisor: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    hashSerial: '0x0000000000000000000000000000000000000000000000000000000000000001',
    hashMetadatos: '0x0000000000000000000000000000000000000000000000000000000000000002',
    lineaProducto: 'Sombrero Vueltiao',
    duenoActual: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    estado: 0,
    emitidoEn: BigInt(1717689600),
  },
  [DEMO_SERIALS.revoked]: {
    emisor: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    hashSerial: '0x0000000000000000000000000000000000000000000000000000000000000003',
    hashMetadatos: '0x0000000000000000000000000000000000000000000000000000000000000004',
    lineaProducto: 'Sombrero Vueltiao',
    duenoActual: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    estado: 1,
    emitidoEn: BigInt(1717689600),
  },
  [DEMO_SERIALS.fake]: 'notfound',
}

export function useVerify(): UseVerifyReturn {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const verify = (serial: string) => {
    setIsLoading(true)
    setProduct(null)
    setNotFound(false)

    // Simula latencia de red
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
