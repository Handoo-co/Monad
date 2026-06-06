export const ORIGIN_PASS_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "serialHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "metadataHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "productLine",
        "type": "string"
      }
    ],
    "name": "issueProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "serialHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyBySerial",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "serialHash",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "metadataHash",
            "type": "bytes32"
          },
          {
            "internalType": "string",
            "name": "productLine",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "locationName",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "issuer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct OriginPass.ProductInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "serialHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "productLine",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "ProductIssued",
    "type": "event"
  }
] as const;

export const CONTRACT_ADDRESS = "0xc9031c63E3fBA35b4F4031d2794c4897C8f6B42b";
