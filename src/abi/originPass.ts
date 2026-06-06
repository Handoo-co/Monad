import { isAddress, type Abi, type Address } from 'viem'
import pasaporteOrigenAbi from '../../artifacts/PasaporteOrigen.abi.json'

export const originPassAbi = pasaporteOrigenAbi as Abi

export function getOriginPassAddress(): Address {
  const address = import.meta.env.VITE_PASAPORTE_ORIGEN_ADDRESS

  if (!address || !isAddress(address)) {
    throw new Error('Falta VITE_PASAPORTE_ORIGEN_ADDRESS con el address real del contrato')
  }

  return address
}
