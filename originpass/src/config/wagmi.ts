// src/config/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { monadTestnet } from './chains';

export const config = getDefaultConfig({
  appName: 'Handoo OriginPass',
  projectId: '94e2e69b0db641d7bc18ad58e179e67f', // ID público de desarrollo genérico para el hackathon
  chains: [monadTestnet],
  ssr: false, // Desactivado ya que estamos usando Vite SPA puro
});