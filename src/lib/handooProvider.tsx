import React, { createContext, useContext, useState, useEffect } from "react";
import { keccak256, toHex } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import type { Product, TransactionEvent } from "../types";
import { ORIGIN_PASS_ABI, CONTRACT_ADDRESS } from "../config/abi";

interface HandooContextType {
  products: Product[];
  transactions: TransactionEvent[];
  mode: "Live" | "Simulated";
  setMode: (mode: "Live" | "Simulated") => void;
  isGeneratingDescription: boolean;
  issueProduct: (
    serial: string,
    productLine: string,
    locationName: string,
    lat: number,
    lng: number,
    brand: string,
    description: string
  ) => Promise<boolean>;
  generateAIDescription: (productLine: string, location: string, briefNotes: string) => Promise<string>;
  changeProductStatus: (serialHash: string, newStatus: "Valid" | "Sold" | "Revoked") => void;
  verifyBySerialHash: (serialHash: string) => Promise<Product | null>;
  activeTxHash: string | null;
  resetToDefaults: () => void;
}

const HandooContext = createContext<HandooContextType | undefined>(undefined);

const PRE_POPULATED_PRODUCTS: Product[] = [
  {
    serial: "HD-OAX-BLACK-401",
    serialHash: keccak256(toHex("HD-OAX-BLACK-401")),
    metadataHash: keccak256(toHex("San Bartolo Coyotepec Ceramics Metadata")),
    productLine: "Barro Negro Traditional Amphora",
    locationName: "San Bartolo Coyotepec, Oaxaca, Mex",
    lat: 16.9531,
    lng: -96.7118,
    timestamp: Date.now() - 3600000 * 24 * 3, // 3 days ago
    isSimulated: true,
    txHash: "0x8fae89cf1293fe2847c1ab901d8bc0ca1892fe88241b3e81190bc1f9b37c091f",
    status: "Valid",
    brand: "Guelaguetza Ancestral S.C.",
    description: "Auténtico porrón de barro negro tradicional, moldeado y pulido de forma manual con cristales de cuarzo por artesanos oaxaqueños de tercera generación. Cocido en horno subterráneo de baja atmósfera que le otorga su lustre plateado distintivo."
  },
  {
    serial: "HD-CUS-ALP-520",
    serialHash: keccak256(toHex("HD-CUS-ALP-520")),
    metadataHash: keccak256(toHex("Chinchero Textile Association Metadata")),
    productLine: "Awaq Fine Baby Alpaca Poncho",
    locationName: "Chinchero, Cusco, Peru",
    lat: -13.3912,
    lng: -72.0489,
    timestamp: Date.now() - 3600000 * 12, // 12 hours ago
    isSimulated: true,
    txHash: "0xcf57eed8a120bf94d2da601ad89284cf18bc06ea32f173167ebbd0cc2db922bb",
    status: "Valid",
    brand: "Awaq Runa Cooperativa",
    description: "Fibra súper fina de baby alpaca tejida a mano usando telar de cintura prehispánico. Teñida exclusivamente con plantas endémicas (cochinilla, chilca) e hilos de herencia georreferenciados en pastos altoandinos a 3800msnm."
  },
  {
    serial: "HD-VEN-MUR-889",
    serialHash: keccak256(toHex("HD-VEN-MUR-889")),
    metadataHash: keccak256(toHex("Venetian Art Glass Metadata")),
    productLine: "Filigree Oro Murano Varnish",
    locationName: "Murano Island, Venice, Italy",
    lat: 45.4542,
    lng: 12.3564,
    timestamp: Date.now() - 3600000 * 48, // 2 days ago
    isSimulated: true,
    txHash: "0x56a1b2c3d4e5f6e7d8c9b0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a91cba",
    status: "Valid",
    brand: "Vetreria Seguso d'Arte",
    description: "Cáliz de vidrio soplado artesanal a 1400°C con filigrana dorada de oro real de 24 quilates. Cada pieza incluye un certificado firmado digitalmente en el Smart Contract de Monad para descartar réplicas artificiales provenientes de fábricas masivas."
  },
  {
    serial: "HD-KYO-BAM-012",
    serialHash: keccak256(toHex("HD-KYO-BAM-012")),
    metadataHash: keccak256(toHex("Takayama Tea Whisks Metadata")),
    productLine: "Ebony Seasoned Bamboo Tea Whisk",
    locationName: "Takayama, Kyoto, Japan",
    lat: 34.7212,
    lng: 135.7275,
    timestamp: Date.now() - 3600000 * 5, // 5 hours ago
    isSimulated: true,
    txHash: "0x123c56a1b2e3d4c5f6e7d8c9b0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7ffff",
    status: "Valid",
    brand: "Nara Takayama Chasen",
    description: "Herramienta chasen tradicional de 80 varillas finas, tallada a mano de una única pieza de bambú negro curado durante tres inviernos. Cuenta con firma biométrica del maestro grabada criptográficamente para validación del coleccionista."
  }
];

const PRE_POPULATED_TXS: TransactionEvent[] = [
  {
    id: "tx-initial-1",
    type: "Issue",
    productLine: "Barro Negro Traditional Amphora",
    serialHash: keccak256(toHex("HD-OAX-BLACK-401")),
    txHash: "0x8fae89cf1293fe2847c1ab901d8bc0ca1892fe88241b3e81190bc1f9b37c091f",
    timestamp: Date.now() - 3600000 * 24 * 3,
    status: "Success"
  },
  {
    id: "tx-initial-2",
    type: "Issue",
    productLine: "Awaq Fine Baby Alpaca Poncho",
    serialHash: keccak256(toHex("HD-CUS-ALP-520")),
    txHash: "0xcf57eed8a120bf94d2da601ad89284cf18bc06ea32f173167ebbd0cc2db922bb",
    timestamp: Date.now() - 3600000 * 12,
    status: "Success"
  },
  {
    id: "tx-initial-3",
    type: "Issue",
    productLine: "Filigree Oro Murano Varnish",
    serialHash: keccak256(toHex("HD-VEN-MUR-889")),
    txHash: "0x56a1b2c3d4e5f6e7d8c9b0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a91cba",
    timestamp: Date.now() - 3600000 * 48,
    status: "Success"
  },
  {
    id: "tx-initial-4",
    type: "Issue",
    productLine: "Ebony Seasoned Bamboo Tea Whisk",
    serialHash: keccak256(toHex("HD-KYO-BAM-012")),
    txHash: "0x123c56a1b2e3d4c5f6e7d8c9b0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7ffff",
    timestamp: Date.now() - 3600000 * 5,
    status: "Success"
  }
];

export const HandooProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useAccount();
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<TransactionEvent[]>([]);
  const [mode, setMode] = useState<"Live" | "Simulated">("Simulated");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<boolean>(false);
  const [activeTxHash, setActiveTxHash] = useState<string | null>(null);

  // Load from local storage or set defaults
  useEffect(() => {
    const cachedProducts = localStorage.getItem("handoo_products");
    const cachedTxs = localStorage.getItem("handoo_txs");
    const cachedMode = localStorage.getItem("handoo_mode");

    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    } else {
      setProducts(PRE_POPULATED_PRODUCTS);
      localStorage.setItem("handoo_products", JSON.stringify(PRE_POPULATED_PRODUCTS));
    }

    if (cachedTxs) {
      setTransactions(JSON.parse(cachedTxs));
    } else {
      setTransactions(PRE_POPULATED_TXS);
      localStorage.setItem("handoo_txs", JSON.stringify(PRE_POPULATED_TXS));
    }

    if (cachedMode) {
      setMode(cachedMode as "Live" | "Simulated");
    }
  }, []);

  // Save updates to local storage
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("handoo_products", JSON.stringify(updatedProducts));
  };

  const saveTransactions = (updatedTxs: TransactionEvent[]) => {
    setTransactions(updatedTxs);
    localStorage.setItem("handoo_txs", JSON.stringify(updatedTxs));
  };

  const handleModeChange = (newMode: "Live" | "Simulated") => {
    setMode(newMode);
    localStorage.setItem("handoo_mode", newMode);
  };

  const resetToDefaults = () => {
    saveProducts(PRE_POPULATED_PRODUCTS);
    saveTransactions(PRE_POPULATED_TXS);
  };

  // Wagmi Write Hook
  const { writeContractAsync } = useWriteContract();

  // Issue product method (handles Live or Simulated)
  const issueProduct = async (
    serial: string,
    productLine: string,
    locationName: string,
    lat: number,
    lng: number,
    brand: string,
    description: string
  ): Promise<boolean> => {
    const cleanSerial = serial.trim();
    if (!cleanSerial || !productLine) return false;

    // Convert keys using Viem's cryptographic hashing
    const sHash = keccak256(toHex(cleanSerial));
    const mHash = keccak256(toHex(`${productLine}-${description}-${locationName}`));
    const tempTxId = `tx-${Date.now()}`;

    // Add pending transaction to feed
    const pendingTx: TransactionEvent = {
      id: tempTxId,
      type: "Issue",
      productLine,
      serialHash: sHash,
      txHash: "0x" + "f".repeat(64), // placeholder hash until response
      timestamp: Date.now(),
      status: "Pending"
    };

    saveTransactions([pendingTx, ...transactions]);

    if (mode === "Live" && isConnected) {
      try {
        pendingTx.txHash = `0x` + "e".repeat(64); // processing hex
        saveTransactions([pendingTx, ...transactions]);

        // Smart contract call to Monad OriginPass
        const tx = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: ORIGIN_PASS_ABI,
          functionName: "issueProduct",
          args: [sHash, mHash, productLine],
        } as any);

        // Track live transaction hash
        setActiveTxHash(tx);
        pendingTx.txHash = tx;
        pendingTx.status = "Success";

        // Add real product to dataset
        const newProduct: Product = {
          serial: cleanSerial,
          serialHash: sHash,
          metadataHash: mHash,
          productLine,
          locationName,
          lat,
          lng,
          timestamp: Date.now(),
          isSimulated: false,
          txHash: tx,
          status: "Valid",
          brand,
          description
        };

        saveProducts([newProduct, ...products]);
        saveTransactions(
          transactions.map((t) => (t.id === tempTxId ? pendingTx : t))
        );
        setActiveTxHash(null);
        return true;
      } catch (err) {
        console.error("Wagmi contract emission failed:", err);
        // Fail state for tx list
        const failedTx: TransactionEvent = {
          ...pendingTx,
          status: "Error",
          txHash: "0x0"
        };
        saveTransactions(
          transactions.map((t) => (t.id === tempTxId ? failedTx : t))
        );
        return false;
      }
    } else {
      // MODE: Simulated / Sandbox (extremely gorgeous and smooth)
      return new Promise<boolean>((resolve) => {
        // Mock chain mining latency
        setTimeout(() => {
          const fakeTxHash = `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("")}` as `0x${string}`;

          const resolvedTx: TransactionEvent = {
            ...pendingTx,
            txHash: fakeTxHash,
            status: "Success"
          };

          const newProduct: Product = {
            serial: cleanSerial,
            serialHash: sHash,
            metadataHash: mHash,
            productLine,
            locationName,
            lat,
            lng,
            timestamp: Date.now(),
            isSimulated: true,
            txHash: fakeTxHash,
            status: "Valid",
            brand,
            description
          };

          // Update lists & localStorage
          setProducts((prev) => {
            const updated = [newProduct, ...prev];
            localStorage.setItem("handoo_products", JSON.stringify(updated));
            return updated;
          });

          setTransactions((prev) => {
            const index = prev.findIndex((t) => t.id === tempTxId);
            const updated = [...prev];
            if (index !== -1) {
              updated[index] = resolvedTx;
            } else {
              updated.unshift(resolvedTx);
            }
            localStorage.setItem("handoo_txs", JSON.stringify(updated));
            return updated;
          });

          resolve(true);
        }, 2200); // quick simulated block validation
      });
    }
  };

  // Call Gemini AI on Express server API to write expanded craft pedigree
  const generateAIDescription = async (
    productLine: string,
    location: string,
    briefNotes: string
  ): Promise<string> => {
    setIsGeneratingDescription(true);
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productLine, location, briefNotes }),
      });
      const data = await response.json();
      if (data.story) {
        return data.story;
      }
      return `Pedigrí de origen certificado Handoo para ${productLine} producido meticulosamente en ${location}. Certificación 100% libre de falsificaciones sustentada en la red Monad.`;
    } catch (err) {
      console.error("Gemini description synthesis failed, falling back:", err);
      return `Pedigrí de origen certificado Handoo para ${productLine} producido meticulosamente en ${location}. Certificación 100% libre de falsificaciones sustentada en la red Monad. ${briefNotes}`;
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Action to mark product as Sold or Revoke (allows live demo interactive verification modifications!)
  const changeProductStatus = (serialHash: string, newStatus: "Valid" | "Sold" | "Revoked") => {
    const updated = products.map((p) => {
      if (p.serialHash === serialHash) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    saveProducts(updated);

    // Create a matching verification log
    const statusTx: TransactionEvent = {
      id: `tx-${Date.now()}`,
      type: "StatusChange",
      productLine: products.find((p) => p.serialHash === serialHash)?.productLine || "OriginPass",
      serialHash,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      timestamp: Date.now(),
      status: "Success"
    };
    saveTransactions([statusTx, ...transactions]);
  };

  // Verify function by serial hash
  const verifyBySerialHash = async (serialHash: string): Promise<Product | null> => {
    // Check locally cached dataset (works as indexing cache or simulation backup)
    const matched = products.find((p) => p.serialHash === serialHash);
    return matched || null;
  };

  return (
    <HandooContext.Provider
      value={{
        products,
        transactions,
        mode,
        setMode: handleModeChange,
        isGeneratingDescription,
        issueProduct,
        generateAIDescription,
        changeProductStatus,
        verifyBySerialHash,
        activeTxHash,
        resetToDefaults
      }}
    >
      {children}
    </HandooContext.Provider>
  );
};

export const useHandoo = () => {
  const context = useContext(HandooContext);
  if (!context) {
    throw new Error("useHandoo must be used within HandooProvider");
  }
  return context;
};
