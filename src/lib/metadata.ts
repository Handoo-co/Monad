import { keccak256, toHex } from 'viem'
import type { CompanyMetadata, Hex, ProductMetadata } from '../types'

export function hashMetadata(value: unknown): Hex {
  return keccak256(toHex(stableStringify(value)))
}

export function hashPrivateValue(value: string): Hex {
  return value.trim() ? keccak256(toHex(value.trim())) : '0x0000000000000000000000000000000000000000000000000000000000000000'
}

export async function fetchMetadata<T>(uri: string): Promise<T | null> {
  if (!uri) return null

  try {
    const response = await fetch(uri)
    if (!response.ok) return null
    return await response.json() as T
  } catch {
    return null
  }
}

export function buildCompanyMetadata(input: {
  name: string
  displayName: string
  location: string
  description: string
  verificationClaim: string
  website: string
}): CompanyMetadata {
  return {
    name: input.name.trim(),
    displayName: input.displayName.trim() || input.name.trim(),
    location: input.location.trim(),
    description: input.description.trim(),
    verificationClaim: input.verificationClaim.trim(),
    ...(input.website.trim() ? { website: input.website.trim() } : {}),
  }
}

export function buildProductMetadata(input: {
  name: string
  category: string
  origin: string
  description: string
  image: string
}): ProductMetadata {
  return {
    name: input.name.trim(),
    category: input.category.trim(),
    origin: input.origin.trim(),
    description: input.description.trim(),
    ...(input.image.trim() ? { image: input.image.trim() } : {}),
  }
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
    return `{${entries.map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`).join(',')}}`
  }
  return JSON.stringify(value)
}
