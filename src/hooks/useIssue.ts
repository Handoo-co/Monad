import { useCallback, useState } from 'react'
import { useAccount, useConfig } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { keccak256, toHex } from 'viem'
import { getOriginPassAddress, originPassAbi } from '../abi/originPass'
import type { UseIssueReturn } from '../types'

export function useIssue(): UseIssueReturn {
  const { address } = useAccount()
  const config = useConfig()
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setIsPending(false)
    setIsConfirming(false)
    setIsSuccess(false)
    setTxHash(undefined)
    setError(null)
  }, [])

  const issue = useCallback(async (serial: string, productLine: string) => {
    if (!address) return
    reset()

    try {
      setIsPending(true)

      const serialHash = keccak256(toHex(serial))
      const metadataHash = keccak256(toHex(`${serial}:${productLine}:metadata`))

      const hash = await writeContract(config, {
        address: getOriginPassAddress(),
        abi: originPassAbi,
        functionName: 'emitirProducto',
        args: [serialHash, metadataHash, productLine],
      })

      setIsPending(false)
      setIsConfirming(true)
      setTxHash(hash)

      await waitForTransactionReceipt(config, { hash })

      setIsConfirming(false)
      setIsSuccess(true)
    } catch (err) {
      setIsPending(false)
      setIsConfirming(false)
      const msg = err instanceof Error ? err.message : 'Transacción fallida'
      setError(msg.includes('SerialYaEmitido')
        ? 'Este serial ya tiene pasaporte registrado.'
        : msg.includes('MarcaNoAutorizada')
        ? 'Esta wallet no está autorizada como emisor.'
        : msg.includes('VITE_PASAPORTE_ORIGEN_ADDRESS')
        ? 'Falta configurar el address real del contrato desplegado.'
        : 'Error al emitir el pasaporte. Verifica que tengas MON suficiente.')
    }
  }, [address, config, reset])

  return { issue, isPending, isConfirming, isSuccess, txHash, error, reset }
}
