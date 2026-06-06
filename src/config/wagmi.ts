import { createConfig, http } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { monadTestnet } from './chains'

const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string
const MONAD_RPC_URL = import.meta.env.VITE_MONAD_RPC_URL as string | undefined
const connectors = WALLETCONNECT_PROJECT_ID
  ? [injected(), walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })]
  : [injected()]

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors,
  transports: {
    [monadTestnet.id]: http(MONAD_RPC_URL ?? monadTestnet.rpcUrls.default.http[0]),
  },
})
