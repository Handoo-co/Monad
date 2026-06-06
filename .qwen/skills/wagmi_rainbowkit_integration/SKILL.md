---
name: wagmi_rainbowkit_integration
description: Guide for integrating Wagmi v2 with RainbowKit v2 in a Vite React+TS dApp, handling import errors and hook updates.
source: auto-skill
extracted_at: '2026-06-06T18:05:00.000Z'
---

## Overview
This skill captures the step‑by‑step approach we used to get a React + TypeScript + Vite dApp working with **Wagmi v2** and **RainbowKit v2** on the Monad Testnet (Chain 10143).

### Why it matters
- RainbowKit v2 requires Wagmi v2; a mismatch caused peer‑dependency errors and missing hook exports (`usePrepareContractWrite`).
- The original import path for the contract ABI (`./abi/originPass`) was case‑sensitive and didn’t match the actual file name (`originpass.ts`).
- Wagmi v2 renamed several hooks (`usePrepareContractWrite → useSimulateContract`, `useContractWrite → useWriteContract`, `useWaitForTransaction → useWaitForTransactionReceipt`).
- We also needed to expose the contract address via a Vite environment variable.

## Step‑by‑step procedure
1. **Downgrade Wagmi**
   ```bash
   npm uninstall wagmi
   npm install wagmi@^2.19.5   # matches RainbowKit v2 peer dependency
   ```
   Commit the change in `package.json`.

2. **Fix import case‑sensitivity**
   ```tsx
   // Before
   import { originPassAbi } from './abi/originPass';
   // After
   import { originPassAbi } from './abi/originpass';
   ```
   Ensure the file `src/abi/originpass.ts` exists (it does).

3. **Expose contract address via Vite env**
   - Create a `.env` file in the project root:
     ```env
     VITE_ORIGINPASS_ADDRESS=0x25192BE4f4eC194D8e00488E4D25D418aC98a78a
     ```
   - In `src/App.tsx` read it with:
     ```ts
     const ORIGINPASS_ADDRESS = import.meta.env.VITE_ORIGINPASS_ADDRESS as `0x${string}`;
     ```

4. **Update Wagmi hook imports**
   ```tsx
   import {
     useSimulateContract,
     useWriteContract,
     useWaitForTransactionReceipt,
     useReadContract,
   } from 'wagmi';
   ```
   - `useSimulateContract` replaces `usePrepareContractWrite` for preparing the transaction.
   - `useWriteContract` replaces `useContractWrite` to actually send the tx.
   - `useWaitForTransactionReceipt` replaces `useWaitForTransaction` to track confirmations.

5. **Adapt the issue‑product flow**
   ```tsx
   const { data: request, error: prepError } = useSimulateContract({
     address: ORIGINPASS_ADDRESS,
     abi: originPassAbi,
     functionName: 'issueProduct',
     args: [toBytes32(serialText), FAKE_METADATA_HASH, productLine],
     enabled: Boolean(serialText && productLine),
   });
   const { data: writeResult, error: writeError, isPending: isWalletPending, write } =
     useWriteContract(request ?? {});
   const { data: receipt, isLoading: isTxProcessing, isSuccess: isTxSuccess, error: txError } =
     useWaitForTransactionReceipt({ hash: writeResult?.hash, confirmations: 1 });
   ```
   UI logic stays the same; only variable names change.

6. **Add a ConnectButton**
   ```tsx
   import { ConnectButton } from '@rainbow-me/rainbowkit';
   // Render inside a header for easy access
   <header …>
     <h1>Handoo OriginPass</h1>
     <ConnectButton />
   </header>
   ```

7. **Verify the read‑product flow**
   The `useReadContract` hook remains unchanged; just ensure the ABI import path matches the file name.

8. **Run the app**
   ```bash
   npm install   # after the wagmi downgrade
   npm run dev
   ```
   The Vite dev server should start without import errors, and the UI will show the Connect button, issue form, and verification form.

## TL;DR checklist
- [x] `wagmi` version `^2.19.5` in `package.json`
- [x] Correct ABI import case (`originpass`)
- [x] `.env` with `VITE_ORIGINPASS_ADDRESS`
- [x] Replace old hooks with `useSimulateContract`, `useWriteContract`, `useWaitForTransactionReceipt`
- [x] Add `ConnectButton` to header
- [x] Verify app runs (`npm run dev`)

---

This skill can be reused for any new Vite‑based dApp that needs to align Wagmi v2 with RainbowKit v2, especially when dealing with case‑sensitive imports and the newer hook API.
