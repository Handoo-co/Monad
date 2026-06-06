import { keccak256, toHex } from 'viem'

// Seriales de prueba para la demo en vivo
// Los hashes se calculan igual que en el contrato: keccak256(abi.encodePacked(serial))
export const DEMO_SERIALS = {
  original: 'HAT-001',
  revoked: 'HAT-002',
  fake: 'FAKE-999',
} as const

export const DEMO_HASHES = {
  original: keccak256(toHex(DEMO_SERIALS.original)),
  revoked: keccak256(toHex(DEMO_SERIALS.revoked)),
  fake: keccak256(toHex(DEMO_SERIALS.fake)),
} as const

export const DEMO_PRODUCTS = [
  {
    label: 'Original',
    serial: DEMO_SERIALS.original,
    hash: DEMO_HASHES.original,
    productLine: 'Sombrero Vueltiao',
    scenario: 'active' as const,
  },
  {
    label: 'Revocado',
    serial: DEMO_SERIALS.revoked,
    hash: DEMO_HASHES.revoked,
    productLine: 'Sombrero Vueltiao',
    scenario: 'revoked' as const,
  },
  {
    label: 'Falso',
    serial: DEMO_SERIALS.fake,
    hash: DEMO_HASHES.fake,
    productLine: '',
    scenario: 'notfound' as const,
  },
] as const
