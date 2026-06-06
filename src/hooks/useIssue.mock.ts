import { useState } from 'react'
import type { UseIssueReturn } from '../types'

export function useIssue(): UseIssueReturn {
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string | null>(null)

  const issue = (_serial: string, _productLine: string) => {
    reset()
    setIsPending(true)

    // Simula firma en wallet
    setTimeout(() => {
      setIsPending(false)
      setIsConfirming(true)

      // Simula confirmación on-chain
      setTimeout(() => {
        setIsConfirming(false)
        setIsSuccess(true)
        setTxHash('0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1' as `0x${string}`)
      }, 1500)
    }, 1000)
  }

  const reset = () => {
    setIsPending(false)
    setIsConfirming(false)
    setIsSuccess(false)
    setTxHash(undefined)
    setError(null)
  }

  return { issue, isPending, isConfirming, isSuccess, txHash, error, reset }
}
