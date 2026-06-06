import { defineChain } from 'viem'

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
  blockExplorers: {
    default: { name: 'Monad Testnet Socialscan', url: 'https://monad-testnet.socialscan.io' },
  },
  testnet: true,
})

export const EXPLORER_URL = monadTestnet.blockExplorers.default.url
