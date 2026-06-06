# Handoo OriginPass

**Product authenticity passports on Monad Testnet.**

Built for MonadBlitz Medellín — a system that lets any brand certify each physical product unit on-chain using its existing serial number. Buyers scan a QR and confirm authenticity in ~400ms without trusting the seller.

Live: **https://originpass.vercel.app**

---

## What it does

Each product gets a blockchain passport tied to its serial number. The passport is immutable, revocable, and publicly verifiable.

| Role | What they can do |
|------|-----------------|
| **Buyer** | Scan QR → dedicated product page showing authenticity status directly from Monad |
| **Brand** | Connect wallet → issue passports for each product unit → revoke if needed |
| **Admin** | View all registered companies and products on the platform |

### Key flows

- **QR scan** → `/?serial=HAT-001` → `ProductPage` shows full certification: status, brand, certifier, issue date, issuer wallet, explorer link
- **Brand portal** → switch between companies, filter by active/revoked, expand per-product QR codes
- **Verification** → manual serial lookup with instant on-chain result
- **Issue** → connected wallet emits a passport for any serial number
- **Revoke** → brand marks a unit as withdrawn from circulation

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Wallet | wagmi v3 + RainbowKit v2 + viem |
| Chain | Monad Testnet — Chain ID 10143, 400ms blocks, 10k TPS |
| Contracts | Solidity 0.8.28 — Foundry (`prague` EVM) |
| Deploy | Vercel (auto-deploy from `main`) |

### Contracts

| Contract | Purpose |
|----------|---------|
| `RegistroEmpresas.sol` | Company registration with approval / suspension flow |
| `PasaporteProductos.sol` | Product passport issuance and revocation |
| `PasaporteOrigen.sol` | Origin denomination certification |

RPC: `https://testnet-rpc.monad.xyz`  
Explorer: `https://testnet.monadexplorer.com`

---

## Architecture

```
src/
├── components/
│   ├── ProductPage.tsx      # Dedicated page rendered on QR scan (?serial=)
│   ├── BrandView.tsx        # Brand portal with company selector
│   ├── AdminView.tsx        # Platform-wide overview
│   ├── VerifyForm.tsx       # Manual serial verification
│   ├── IssueForm.tsx        # Passport issuance
│   ├── ProductShowcase.tsx  # Public demo product grid
│   ├── VerificationSeal.tsx # Verification result card
│   └── QRCodeLink.tsx       # QR generator (api.qrserver.com)
├── hooks/
│   ├── useVerify.mock.ts    # Swap for real contract hook on mainnet
│   ├── useBrandPassports.mock.ts
│   └── useIssue.mock.ts
├── data/
│   ├── adminDemo.ts         # 3 brands · 9 products demo dataset
│   └── demo.ts              # Public showcase serials
└── contracts/               # Solidity source + compiled ABIs
```

The app is **mock-first**: all contract interactions run against local demo data. Swapping to real on-chain calls is two import line changes per hook file.

---

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:5173`

To test the QR scan flow: `http://localhost:5173/?serial=HAT-001`

---

## Team

Built at **MonadBlitz Medellín** by the Handoo team.
