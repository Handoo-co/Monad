import { keccak256, toHex } from 'viem'

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

export const DEMO_BRAND = {
  name: 'Tejeduría Zenú',
  certifier: 'Artesanías de Colombia',
  category: 'Artesanías · Denominación de Origen',
} as const

export const DEMO_PRODUCTS = [
  {
    label: 'Original',
    serial: DEMO_SERIALS.original,
    hash: DEMO_HASHES.original,
    name: 'Sombrero Vueltiao N°21',
    productLine: 'Sombrero Vueltiao',
    brand: DEMO_BRAND.name,
    certifier: DEMO_BRAND.certifier,
    category: DEMO_BRAND.category,
    description: 'Tejido 100% caña flecha con método tradicional zenú. Piezas únicas certificadas de origen.',
    icon: '🎩',
    scenario: 'active' as const,
  },
  {
    label: 'Revocado',
    serial: DEMO_SERIALS.revoked,
    hash: DEMO_HASHES.revoked,
    name: 'Sombrero Vueltiao N°15',
    productLine: 'Sombrero Vueltiao',
    brand: DEMO_BRAND.name,
    certifier: DEMO_BRAND.certifier,
    category: DEMO_BRAND.category,
    description: 'Pasaporte revocado por el emisor. Esta unidad fue retirada de circulación activa.',
    icon: '🎩',
    scenario: 'revoked' as const,
  },
  {
    label: 'Falso',
    serial: DEMO_SERIALS.fake,
    hash: DEMO_HASHES.fake,
    name: 'Sin registro en cadena',
    productLine: '',
    brand: null,
    certifier: null,
    category: 'Sin certificar',
    description: 'Este serial no tiene pasaporte en Monad. Posible producto falsificado o no registrado.',
    icon: '❓',
    scenario: 'notfound' as const,
  },
] as const
