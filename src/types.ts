export interface Product {
  serial: string;
  serialHash: `0x${string}`;
  metadataHash: `0x${string}`;
  productLine: string;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: number;
  isSimulated: boolean;
  txHash: `0x${string}`;
  status: "Valid" | "Sold" | "Revoked";
  brand: string;
  description: string;
}

export interface TransactionEvent {
  id: string;
  type: "Issue" | "Verify" | "StatusChange";
  productLine: string;
  serialHash: string;
  txHash: string;
  timestamp: number;
  status: "Pending" | "Success" | "Error";
}
