import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ADMIN_PRODUCTS, ADMIN_BRANDS } from '../data/adminDemo'
import type { AdminProduct, AdminBrand } from '../data/adminDemo'

type RevokeState = {
  serial: string | null
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  error: string | null
}

type UseBrandPassportsReturn = {
  brand: AdminBrand | null
  products: AdminProduct[]
  revoke: (serial: string) => void
  revokeState: RevokeState
  resetRevoke: () => void
}

// En la demo, cualquier wallet conectada se mapea a Tejeduría Zenú
export function useBrandPassports(): UseBrandPassportsReturn {
  const { address } = useAccount()
  const [revokeState, setRevokeState] = useState<RevokeState>({
    serial: null,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    error: null,
  })

  // Demo: wallet conectada = primera marca registrada
  const brand = address ? ADMIN_BRANDS[0] : null
  const products = brand
    ? ADMIN_PRODUCTS.filter(p => p.brand === brand.name)
    : []

  const revoke = (serial: string) => {
    setRevokeState({ serial, isPending: true, isConfirming: false, isSuccess: false, error: null })
    setTimeout(() => {
      setRevokeState(s => ({ ...s, isPending: false, isConfirming: true }))
      setTimeout(() => {
        setRevokeState(s => ({ ...s, isConfirming: false, isSuccess: true }))
      }, 1500)
    }, 1000)
  }

  const resetRevoke = () => {
    setRevokeState({ serial: null, isPending: false, isConfirming: false, isSuccess: false, error: null })
  }

  return { brand, products, revoke, revokeState, resetRevoke }
}
