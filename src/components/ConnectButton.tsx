import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'

export function ConnectButton() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isWrongNetwork = isConnected && chainId !== 10143

  return (
    <div className="flex flex-col items-center gap-2">
      <RKConnectButton />
      {isWrongNetwork && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
          <span>Red incorrecta.</span>
          <button
            onClick={() => switchChain({ chainId: 10143 })}
            className="font-semibold underline"
          >
            Cambiar a Monad Testnet
          </button>
        </div>
      )}
    </div>
  )
}
