import { isAddress, type Abi, type Address } from 'viem'
import registroEmpresasAbiJson from '../../artifacts/RegistroEmpresas.abi.json'
import pasaporteProductosAbiJson from '../../artifacts/PasaporteProductos.abi.json'

export const registroEmpresasAbi = registroEmpresasAbiJson as Abi
export const pasaporteProductosAbi = pasaporteProductosAbiJson as Abi

const REGISTRO_EMPRESAS_ADDRESS = import.meta.env.VITE_REGISTRO_EMPRESAS_ADDRESS as string | undefined
const PASAPORTE_PRODUCTOS_ADDRESS = import.meta.env.VITE_PASAPORTE_PRODUCTOS_ADDRESS as string | undefined

function requireAddress(value: string | undefined, envName: string): Address {
  if (!value || !isAddress(value)) {
    throw new Error(`Falta configurar ${envName} con el address real desplegado`)
  }

  return value
}

export function getRegistroEmpresasAddress(): Address {
  return requireAddress(REGISTRO_EMPRESAS_ADDRESS, 'VITE_REGISTRO_EMPRESAS_ADDRESS')
}

export function getPasaporteProductosAddress(): Address {
  return requireAddress(PASAPORTE_PRODUCTOS_ADDRESS, 'VITE_PASAPORTE_PRODUCTOS_ADDRESS')
}

export function hasV2Addresses(): boolean {
  return Boolean(
    REGISTRO_EMPRESAS_ADDRESS
      && PASAPORTE_PRODUCTOS_ADDRESS
      && isAddress(REGISTRO_EMPRESAS_ADDRESS)
      && isAddress(PASAPORTE_PRODUCTOS_ADDRESS),
  )
}
