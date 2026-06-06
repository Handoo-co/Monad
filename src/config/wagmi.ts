// src/config/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { monadTestnet } from './chains';

export const config = getDefaultConfig({
  appName: 'Handoo OriginPass',
  // Usamos este ID público de testing para desbloquear el modal de MetaMask de inmediato
  projectId: '3fcc6bba31a5050ce112299814243bcd', 
  chains: [monadTestnet],
  ssr: false, 
});