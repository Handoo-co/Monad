# Onboarding — Handoo OriginPass

Setup completo para nuevos contribuidores. De cero a app corriendo en local en
menos de 10 minutos.

## 1. Prerrequisitos

| Herramienta | Versión mínima | Para qué |
| --- | --- | --- |
| Node.js | 20+ | Frontend (Vite + React) |
| npm | 10+ | Gestor de paquetes |
| git | 2.40+ | Clonado y branch management |
| MetaMask / Rainbow / WalletConnect | última | Firmar transacciones en Monad Testnet |

Opcionales (solo si trabajas en el contrato):

| Herramienta | Para qué |
| --- | --- |
| Foundry (`forge`, `cast`) | Tests del contrato, deploy reproducible |
| `solc 0.8.28` | Compilación local del contrato |

## 2. Clonar y entrar a la rama

```bash
git clone https://github.com/Handoo-co/Monad.git
cd Monad
git checkout Pacha
```

La rama `Pacha` contiene contrato + frontend integrados.

## 3. Instalar dependencias

```bash
npm install
```

> Si ves warnings de peer deps, son seguros. RainbowKit 2.2 exige wagmi 2.x;
> ya está pineado en `package.json`.

## 4. Variables de entorno

Copia el template al archivo local (que NO se commitea):

```bash
cp ./.env.example ./.env.local
```

Edita `./env.local` y rellena:

| Variable | Obligatoria | Cómo obtenerla |
| --- | --- | --- |
| `VITE_WALLETCONNECT_PROJECT_ID` | Sí (para WalletConnect) | https://cloud.walletconnect.com → crear proyecto → copiar Project ID |
| `VITE_MONAD_RPC_URL` | No (tiene default) | Default: `https://testnet-rpc.monad.xyz` |
| `VITE_PASAPORTE_ORIGEN_ADDRESS` | Solo cuando exista deploy real | Lo comparte Emmanuel tras el deploy |

> ⚠️ Nunca commitees el archivo local con variables. `.gitignore` ya lo cubre.

## 5. Conseguir MON de faucet (Monad Testnet)

Para firmar transacciones de prueba necesitas saldo de `MON` en una wallet de
**prueba** (no tu wallet principal).

1. Crea o usa una wallet vacía dedicada al hackathon.
2. Agrega Monad Testnet a la wallet:
   - Chain ID: `10143`
   - RPC: `https://testnet-rpc.monad.xyz`
   - Símbolo: `MON`
   - Explorer: `https://monad-testnet.socialscan.io`
3. Pide MON al faucet oficial del evento.
4. Confirma saldo antes de firmar cualquier tx.

## 6. Levantar la app

```bash
npm run dev
```

Abre `http://127.0.0.1:5173`. Deberías ver:

- Botón de conectar wallet (RainbowKit).
- Formularios de emitir / verificar producto.

> **Importante:** mientras no exista `VITE_PASAPORTE_ORIGEN_ADDRESS`, los hooks
> reales (`useIssue`, `useVerify`) van a fallar al ejecutar tx. Para iterar
> antes del deploy, usa los hooks `*.mock.ts` cambiando los imports en
> `src/components/IssueForm.tsx` y `src/components/VerifyForm.tsx`.

## 7. Validación rápida (smoke test)

```bash
npm run lint
npm run build
```

Ambos deben pasar sin errores. El warning de `@reown/appkit` sobre
`/*#__PURE__*/` es de una dependencia transitiva y se puede ignorar.

## 8. Estructura del repo

```
.
├── README.md                          # Entry point
├── contracts/
│   └── PasaporteOrigen.sol           # Contrato principal
├── test/
│   └── PasaporteOrigen.t.sol         # Tests Foundry
├── artifacts/
│   ├── PasaporteOrigen.abi.json      # ABI generada
│   └── frontend-config.example.json  # Plantilla de config
├── src/
│   ├── abi/originPass.ts             # Import del ABI real
│   ├── config/
│   │   ├── chains.ts                 # Definición monadTestnet
│   │   └── wagmi.ts                  # Config wagmi + connectors
│   ├── hooks/
│   │   ├── useIssue.ts               # Hook real → emitirProducto
│   │   ├── useIssue.mock.ts          # Hook mock para desarrollo sin deploy
│   │   ├── useVerify.ts              # Hook real → verificarPorSerial
│   │   └── useVerify.mock.ts
│   ├── components/                   # ConnectButton, IssueForm, VerifyForm, ProductCard
│   ├── types/index.ts                # Tipos alineados al contrato
│   └── main.tsx                      # Entry React
├── docs/                             # Toda la documentación
├── foundry.toml                      # Config Foundry (evm_version = prague)
├── package.json
└── vite.config.ts
```

## 9. Workflow de contribución

1. Toma una tarea de [`PROXIMOS_PASOS.md`](PROXIMOS_PASOS.md). Cambia su estado
   a 🔄 cuando empieces.
2. Crea una rama: `git checkout -b feat/descripcion-corta`.
3. Commit pequeños con mensajes claros (Conventional Commits: `feat:`, `fix:`,
   `docs:`, `chore:`).
4. Antes de PR: `npm run lint && npm run build`.
5. PR contra `Pacha`. Pide review a Emmanuel.
6. Al mergear, marca la tarea como ✅ en `PROXIMOS_PASOS.md`.

## 10. Troubleshooting

| Síntoma | Causa probable | Fix |
| --- | --- | --- |
| Wallet no conecta | Falta `VITE_WALLETCONNECT_PROJECT_ID` | Crea proyecto en cloud.walletconnect.com |
| `Wrong network` en UI | Wallet en red distinta a Monad Testnet | Cambia a Chain ID `10143` desde la wallet |
| `MarcaNoAutorizada` al emitir | No se ejecutó `registrarMarca` post-deploy | Emmanuel debe correr el paso 0 (ver `GUIA_DEPLOY_REMIX.md`) |
| `npm install` falla con peer deps | Cache corrupto | `rm -rf node_modules package-lock.json && npm install` |
| Build falla con error de tipo | TS strict | Revisa `tsconfig.app.json` y corre `npx tsc --noEmit` |
| Faltan saldos de MON | Wallet no fondeada | Pide faucet, usa solo wallets de prueba |

## 11. Para profundizar

- Estrategia y fases: [`PLAN_MAESTRO_PACHA.md`](PLAN_MAESTRO_PACHA.md).
- Deploy real: [`GUIA_DEPLOY_REMIX.md`](GUIA_DEPLOY_REMIX.md).
- Verificación empresarial: [`VERIFICACION_EMPRESARIAL.md`](VERIFICACION_EMPRESARIAL.md).
- Referencia para frontend: [`HANDOFF_FRONTEND_MONAD.md`](HANDOFF_FRONTEND_MONAD.md).
- Decisiones técnicas de monskills: [`USO_MONSKILLS.md`](USO_MONSKILLS.md).

## 12. Reglas de oro

- **Cero datos personales on-chain.** Solo hashes y metadata demo.
- **Cero certificados crudos on-chain.** La verificación empresarial se hace off-chain y solo se ancla como hash.
- **Cero wallets principales.** Solo wallets de prueba dedicadas al hackathon.
- **Cero secretos en el repo.** Variables locales nunca al git.
- **Cero address dummy en producción.** Hasta que Emmanuel comparta el address
  real, los hooks mock son la única forma de iterar sin romper la demo.
