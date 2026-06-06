// src/abi/originPass.ts

// Dirección temporal (Emmanuel te dará la real en el almuerzo)
export const ORIGINPASS_ADDRESS = '0x25192BE4f4eC194D8e00488E4D25D418aC98a78a';

// ABI base del contrato para poder interactuar con las funciones esenciales
export const originPassAbi = [
  {
    inputs: [{ internalType: 'bytes32', name: 'serialHash', type: 'bytes32' }],
    name: 'verifyBySerial',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'issuer', type: 'address' },
          { internalType: 'bytes32', name: 'serialHash', type: 'bytes32' },
          { internalType: 'bytes32', name: 'metadataHash', type: 'bytes32' },
          { internalType: 'string', name: 'productLine', type: 'string' },
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'enum OriginPass.Status', name: 'status', type: 'uint8' },
          { internalType: 'uint256', name: 'issuedAt', type: 'uint256' }
        ],
        internalType: 'struct OriginPass.Product',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'serialHash', type: 'bytes32' },
      { internalType: 'bytes32', name: 'metadataHash', type: 'bytes32' },
      { internalType: 'string', name: 'productLine', type: 'string' }
    ],
    name: 'issueProduct',
    outputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    stateMutability: 'external',
    type: 'function'
  }
] as const;