import { EXPLORER_URL } from '../config/chains'

export type AdminBrand = {
  id: string
  name: string
  certifier: string
  category: string
  wallet: `0x${string}`
  registeredAt: string
  status: 'active' | 'suspended'
  productCount: number
}

export type AdminProduct = {
  serial: string
  productLine: string
  brand: string
  brandWallet: `0x${string}`
  status: 'active' | 'revoked'
  issuedAt: string
  txHash: `0x${string}`
}

export const ADMIN_BRANDS: AdminBrand[] = [
  {
    id: 'zenu',
    name: 'Tejeduría Zenú',
    certifier: 'Artesanías de Colombia',
    category: 'Artesanías · Denominación de Origen',
    wallet: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    registeredAt: '2025-11-12',
    status: 'active',
    productCount: 3,
  },
  {
    id: 'casa-moda',
    name: 'Casa Moda Colombia',
    certifier: 'Cámara de Comercio de Bogotá',
    category: 'Moda · Confección',
    wallet: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    registeredAt: '2025-12-01',
    status: 'active',
    productCount: 4,
  },
  {
    id: 'pacífico',
    name: 'Artesanos del Pacífico',
    certifier: 'Artesanías de Colombia',
    category: 'Artesanías · Fibras Naturales',
    wallet: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
    registeredAt: '2025-12-10',
    status: 'suspended',
    productCount: 2,
  },
]

export const ADMIN_PRODUCTS: AdminProduct[] = [
  // Tejeduría Zenú
  {
    serial: 'HAT-001',
    productLine: 'Sombrero Vueltiao N°21',
    brand: 'Tejeduría Zenú',
    brandWallet: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    status: 'active',
    issuedAt: '2025-11-15',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000001',
  },
  {
    serial: 'HAT-002',
    productLine: 'Sombrero Vueltiao N°15',
    brand: 'Tejeduría Zenú',
    brandWallet: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    status: 'revoked',
    issuedAt: '2025-11-18',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000002',
  },
  {
    serial: 'HAT-003',
    productLine: 'Sombrero Vueltiao N°19',
    brand: 'Tejeduría Zenú',
    brandWallet: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    status: 'active',
    issuedAt: '2025-11-20',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000003',
  },
  // Casa Moda Colombia
  {
    serial: 'CMC-001',
    productLine: 'Vestido Bordado Wayuu',
    brand: 'Casa Moda Colombia',
    brandWallet: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    status: 'active',
    issuedAt: '2025-12-05',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000004',
  },
  {
    serial: 'CMC-002',
    productLine: 'Bolso Tejido Wayuu',
    brand: 'Casa Moda Colombia',
    brandWallet: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    status: 'active',
    issuedAt: '2025-12-06',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000005',
  },
  {
    serial: 'CMC-003',
    productLine: 'Ruana Antioqueña',
    brand: 'Casa Moda Colombia',
    brandWallet: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    status: 'active',
    issuedAt: '2025-12-08',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000006',
  },
  {
    serial: 'CMC-004',
    productLine: 'Camiseta Artesanal',
    brand: 'Casa Moda Colombia',
    brandWallet: '0xB2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0c1',
    status: 'revoked',
    issuedAt: '2025-12-09',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000007',
  },
  // Artesanos del Pacífico
  {
    serial: 'PAC-001',
    productLine: 'Cesta Iraca',
    brand: 'Artesanos del Pacífico',
    brandWallet: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
    status: 'active',
    issuedAt: '2025-12-12',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000008',
  },
  {
    serial: 'PAC-002',
    productLine: 'Tapiz Chocó',
    brand: 'Artesanos del Pacífico',
    brandWallet: '0xC3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1d2',
    status: 'active',
    issuedAt: '2025-12-14',
    txHash: '0xdead000000000000000000000000000000000000000000000000000000000009',
  },
]

export { EXPLORER_URL }
