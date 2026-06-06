import { useCallback, useState } from 'react'
import { useAccount, useConfig } from 'wagmi'
import { sendTransaction, waitForTransactionReceipt } from 'wagmi/actions'
import { encodeFunctionData, keccak256, toHex } from 'viem'
import { originPassAbi, ORIGINPASS_ADDRESS } from '../abi/originPass'
import type { UseIssueReturn } from '../types'

// Gas explícito: Monad cobra gas_limit * precio, no gas_used.
// issueProduct toca 2 cold SSTORE + overhead → 150_000 es un límite seguro y ajustado.
const ISSUE_GAS_LIMIT = 150_000n

export function useIssue(): UseIssueReturn {
  const { address } = useAccount()
  const config = useConfig()
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string | null>(null)

  const issue = useCallback(async (serial: string, productLine: string) => {
    if (!address) return
    reset()

    try {
      setIsPending(true)

      const serialHash = keccak256(toHex(serial))
      // metadataHash vacío para el MVP — se puede extender con IPFS hash
      const metadataHash = keccak256(toHex(`${serial}-metadata`))

      const data = encodeFunctionData({
        abi: originPassAbi,
        functionName: 'issueProduct',
        args: [serialHash, metadataHash, productLine],
      })

      // Monad soporta eth_sendRawTransactionSync: firma + receipt en una sola llamada
      const hash = await sendTransaction(config, {
        to: ORIGINPASS_ADDRESS,
        data,
        gas: ISSUE_GAS_LIMIT,
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
      // Extraer el mensaje del revert si viene del contrato
      setError(msg.includes('serial ya emitido')
        ? 'Este serial ya tiene pasaporte registrado.'
        : msg.includes('no autorizado')
        ? 'Esta wallet no está autorizada como emisor.'
        : 'Error al emitir el pasaporte. Verifica que tengas MON suficiente.')
    }
  }, [address, config])

  const reset = () => {
    setIsPending(false)
    setIsConfirming(false)
    setIsSuccess(false)
    setTxHash(undefined)
    setError(null)
  }

  return { issue, isPending, isConfirming, isSuccess, txHash, error, reset }
}
