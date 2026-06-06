# Handoff Frontend Monad - Handoo OriginPass

## Objetivo

Dejar a Thomas y frontend con una integracion clara para conectar wallet en
Monad Testnet y llamar `PasaporteOrigen` sin depender de nombres o datos
inventados.

## Insumos del contrato

- ABI: `artifacts/PasaporteOrigen.abi.json`.
- Config ejemplo: `artifacts/frontend-config.example.json`.
- Address real: pendiente de deploy. No usar address dummy en produccion ni demo.
- Red: Monad Testnet, Chain ID `10143` (`0x279f`), token `MON`.
- RPC base: `https://testnet-rpc.monad.xyz`.
- Implementacion actual: app Vite/React en `src/`, integrada desde la rama
  `Thomas` con RainbowKit/Wagmi.

Variables recomendadas para Vite:

```bash
VITE_PASAPORTE_ORIGEN_ADDRESS=0x...
VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

Variables recomendadas para Next.js:

```bash
NEXT_PUBLIC_PASAPORTE_ORIGEN_ADDRESS=0x...
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

No commitear `.env`, `.env.local` ni llaves privadas.

En este repo, `.env.local` queda ignorado por `.gitignore`.

## Config Wagmi/Viem

Si la version instalada trae `monadTestnet`, preferir el import oficial:

```ts
import { http, createConfig } from "wagmi";
import { monadTestnet } from "wagmi/chains";

const rpcUrl = import.meta.env.VITE_MONAD_RPC_URL ?? "https://testnet-rpc.monad.xyz";

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(rpcUrl),
  },
});
```

Fallback si el paquete no exporta `monadTestnet`:

```ts
import { http, createConfig } from "wagmi";

export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Testnet Socialscan",
      url: "https://monad-testnet.socialscan.io",
    },
  },
  testnet: true,
} as const;

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(import.meta.env.VITE_MONAD_RPC_URL),
  },
});
```

## Constantes del contrato

```ts
import { isAddress, type Address } from "viem";
import pasaporteOrigenAbi from "../artifacts/PasaporteOrigen.abi.json";

export const PASAPORTE_ORIGEN_ABI = pasaporteOrigenAbi;

export function getPasaporteOrigenAddress(): Address {
  const address = import.meta.env.VITE_PASAPORTE_ORIGEN_ADDRESS;

  if (!address || !isAddress(address)) {
    throw new Error("Configura VITE_PASAPORTE_ORIGEN_ADDRESS con el deploy real");
  }

  return address;
}

export function monadTestnetTxUrl(hash: string): string {
  return `https://monad-testnet.socialscan.io/tx/${hash}`;
}

export function monadTestnetAddressUrl(address: string): string {
  return `https://monad-testnet.socialscan.io/address/${address}`;
}
```

## Hooks base

```tsx
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { PASAPORTE_ORIGEN_ABI, getPasaporteOrigenAddress } from "./contract";

export function useMonadReady() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  return {
    address,
    isConnected,
    isWrongNetwork: isConnected && chainId !== monadTestnet.id,
    switchToMonad: () => switchChain({ chainId: monadTestnet.id }),
  };
}

export function useProducto(id?: bigint) {
  return useReadContract({
    address: getPasaporteOrigenAddress(),
    abi: PASAPORTE_ORIGEN_ABI,
    functionName: "obtenerProducto",
    args: id ? [id] : undefined,
    query: {
      enabled: Boolean(id),
    },
  });
}

export function usePasaporteWrites() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const contract = {
    address: getPasaporteOrigenAddress(),
    abi: PASAPORTE_ORIGEN_ABI,
  };

  return {
    hash,
    isPending,
    error,
    receipt,
    emitirProducto: (
      hashSerial: `0x${string}`,
      hashMetadatos: `0x${string}`,
      lineaProducto: string,
    ) =>
      writeContract({
        ...contract,
        functionName: "emitirProducto",
        args: [hashSerial, hashMetadatos, lineaProducto],
      }),
    transferirProducto: (id: bigint, duenoNuevo: `0x${string}`) =>
      writeContract({
        ...contract,
        functionName: "transferirProducto",
        args: [id, duenoNuevo],
      }),
    revocarProducto: (id: bigint, hashMotivo: `0x${string}`) =>
      writeContract({
        ...contract,
        functionName: "revocarProducto",
        args: [id, hashMotivo],
      }),
  };
}
```

## Errores custom para UI

Mapear estos nombres a textos humanos:

| Error | Mensaje sugerido |
| --- | --- |
| `MarcaNoAutorizada` | Esta wallet no esta autorizada para emitir pasaportes. |
| `SerialYaEmitido` | Ese serial ya tiene un pasaporte emitido. |
| `ProductoNoExiste` | No existe un pasaporte para ese id o serial. |
| `SoloEmisor` | Solo la marca emisora puede revocar este pasaporte. |
| `SoloDuenoActual` | Solo el dueno actual puede transferir este pasaporte. |
| `DuenoInvalido` | La direccion destino no es valida para transferir. |
| `ProductoYaRevocado` | Este pasaporte ya esta revocado. |

## Flujo demo con wallet que tiene MON

1. Thomas conecta la wallet en Monad Testnet.
2. Confirmar `chainId = 10143`.
3. Confirmar saldo de MON para gas.
4. Emmanuel despliega contrato y comparte address real.
5. Emmanuel ejecuta `registrarMarca(walletDeMarca, "Handoo Demo Brand", hashMarca, true)`.
6. Frontend ejecuta `emitirProducto` con hashes demo.
7. Frontend espera receipt y muestra link de explorer.
8. Frontend lee `verificarPorSerial(hashSerial)`.
9. Frontend ejecuta `transferirProducto(1, walletComprador)`.
10. Frontend lee `obtenerProducto(1)` y muestra `duenoActual`.
11. Wallet emisora ejecuta `revocarProducto(1, hashMotivo)`.
12. Frontend muestra estado `Revocado`.

## Cuidado Monad

- En Monad se cobra por `gas_limit`, no por gas usado. No inflar limites de gas.
- Para contratos, dejar que wallet/RPC estime o usar limites medidos. No copiar
  limites de Ethereum a ciegas.
- Para transferencias nativas de MON, el gas fijo es `21000`.
- Nuevas cuentas fondeadas pueden necesitar esperar alrededor de 1.2s antes de
  enviar su primera transaccion por la ejecucion asincrona.
- Para UX normal, mostrar pending/confirming/confirmed con receipt. Para estados
  de mayor seguridad, distinguir `latest`, `safe` y `finalized` si el frontend
  lo soporta.

## Si usan Para

No correr `para create`. Con el frontend existente:

```bash
cd web
para init
para doctor
```

Despues de `para init`, aplicar el wiring de Monad: `chains: [monadTestnet]` y
`transports: { [monadTestnet.id]: http(...) }` dentro de la configuracion EVM
del provider. No commitear secretos de Para; las llaves publicas deben usar el
prefijo del framework (`VITE_` o `NEXT_PUBLIC_`).
