import type {
  EstadoEmpresa,
  EstadoProducto,
  ModoVerificacion,
  TipoEmpresa,
  TipoProducto,
} from '../types'
import {
  ESTADO_EMPRESA,
  ESTADO_PRODUCTO,
  MODO_VERIFICACION,
  TIPO_EMPRESA,
  TIPO_PRODUCTO,
} from '../types'

export function shortAddress(value: string): string {
  if (value.length < 12) return value
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

export function formatDate(value: bigint): string {
  if (value === 0n) return 'Pendiente'
  return new Date(Number(value) * 1000).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function tipoEmpresaLabel(value: TipoEmpresa): string {
  return value === TIPO_EMPRESA.Artesanal ? 'Artesanal' : 'Comercial'
}

export function modoVerificacionLabel(value: ModoVerificacion): string {
  if (value === MODO_VERIFICACION.CamaraComercio) return 'Camara de Comercio'
  if (value === MODO_VERIFICACION.RegistroOficial) return 'Registro oficial'
  return 'Revision artesanal Handoo'
}

export function estadoEmpresaLabel(value: EstadoEmpresa): string {
  if (value === ESTADO_EMPRESA.Aprobada) return 'Aprobada'
  if (value === ESTADO_EMPRESA.Rechazada) return 'Rechazada'
  if (value === ESTADO_EMPRESA.Suspendida) return 'Suspendida'
  return 'Pendiente'
}

export function estadoProductoLabel(value: EstadoProducto): string {
  return value === ESTADO_PRODUCTO.Revocado ? 'Revocado' : 'Activo'
}

export function tipoProductoLabel(value: TipoProducto): string {
  return value === TIPO_PRODUCTO.Artesanal ? 'Producto artesanal' : 'Producto original'
}
