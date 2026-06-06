import React, { useState, useEffect } from "react";
import { useHandoo } from "../lib/handooProvider";
import { keccak256, toHex } from "viem";
import type { Product } from "../types";
import { Cpu, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface AdminPanelProps {
  activeProduct: Product | null;
  setActiveProduct: (p: Product) => void;
}

// Preset coords for easy mock registration representing famous global craft heritages
const HERITAGE_SITES = [
  { name: "Oaxaca, México (Cerámica Barro Negro)", lat: 16.9531, lng: -96.7118 },
  { name: "Cusco, Perú (Textilería Alpaca)", lat: -13.517, lng: -71.9785 },
  { name: "Kyoto, Japón (Bambú y Chasen)", lat: 35.0116, lng: 135.7681 },
  { name: "Isla Murano, Italia (Soplado de Vidrio)", lat: 45.4542, lng: 12.3564 },
  { name: "Jalisco, México (Destilación Ancestral)", lat: 20.6597, lng: -103.3496 },
  { name: "Kashmir, India (Pashmina Tejida)", lat: 34.0837, lng: 74.7973 },
  { name: "Limoges, Francia (Porcelana Fina)", lat: 45.8354, lng: 1.2618 },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ activeProduct, setActiveProduct }) => {
  const {
    products,
    transactions,
    mode,
    setMode,
    isGeneratingDescription,
    issueProduct,
    generateAIDescription,
    resetToDefaults,
  } = useHandoo();

  const { isConnected, address } = useAccount();

  const [activeTab, setActiveTab] = useState<"feed" | "mint">("feed");

  // Form states
  const [serial, setSerial] = useState<string>("");
  const [productLine, setProductLine] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [selectedSiteIndex, setSelectedSiteIndex] = useState<number>(0);
  const [customLat, setCustomLat] = useState<string>("");
  const [customLng, setCustomLng] = useState<string>("");
  const [customLocName, setCustomLocName] = useState<string>("");
  const [useCustomLoc, setUseCustomLoc] = useState<boolean>(false);
  const [briefNotes, setBriefNotes] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [mintStatus, setMintStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  // Cryptographic serial hashing on-the-fly using Viem
  const [liveSerialHash, setLiveSerialHash] = useState<string>("0x...");

  useEffect(() => {
    if (serial.trim()) {
      try {
        const hash = keccak256(toHex(serial.trim()));
        setLiveSerialHash(hash);
      } catch (e) {
        setLiveSerialHash("0x...");
      }
    } else {
      setLiveSerialHash("0x...");
    }
  }, [serial]);

  // Handle server-side Gemini backstory synthesis
  const handleAISynthesis = async () => {
    const locName = useCustomLoc
      ? customLocName || "Origen Ancestral"
      : HERITAGE_SITES[selectedSiteIndex].name.split(" ")[0];

    if (!productLine) {
      alert("Por favor, ingresa primero la línea del producto para guiar a la IA.");
      return;
    }

    const aiText = await generateAIDescription(productLine, locName, briefNotes);
    setDescription(aiText);
  };

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial || !productLine || !brand) {
      alert("Por favor completa los campos principales (Serial, Marca y Línea).");
      return;
    }

    const locName = useCustomLoc
      ? customLocName || "Ubicación Personalizada"
      : HERITAGE_SITES[selectedSiteIndex].name;
    const lat = useCustomLoc ? parseFloat(customLat) || 0 : HERITAGE_SITES[selectedSiteIndex].lat;
    const lng = useCustomLoc ? parseFloat(customLng) || 0 : HERITAGE_SITES[selectedSiteIndex].lng;

    setMintStatus("pending");

    try {
      const outcome = await issueProduct(
        serial,
        productLine,
        locName,
        lat,
        lng,
        brand,
        description || `${productLine} auténtico certificado on-chain.`
      );

      if (outcome) {
        setMintStatus("success");
        // reset form
        setSerial("");
        setProductLine("");
        setBrand("");
        setBriefNotes("");
        setDescription("");
      } else {
        setMintStatus("error");
      }
    } catch (err) {
      setMintStatus("error");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#12022b] border-r border-[#7135F2]/20">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#7135F2]/20 bg-[#160334]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#05C7F2]/10 rounded-sm border border-[#05C7F2]/30">
              <></>
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tighter text-[#F2F2F2] font-sans flex items-center gap-1.5">
                HANDOO
                <span className="text-[10px] font-mono text-[#05C7F2] opacity-80 uppercase">
                  // ORIGINPASS
                </span>
              </h1>
              <p className="text-[10px] text-[#9163F2]/80 uppercase tracking-widest font-mono">Monad Testnet • Node ID: 10143</p>
            </div>
          </div>
          <button
            onClick={resetToDefaults}
            title="Reset dataset to default heritage cases"
            className="p-1.5 bg-[#1C0340] hover:bg-[#250058] text-[#F2F2F2] rounded border border-[#7135F2]/40 transition-all text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[10px]">Reiniciar</span>
          </button>
        </div>

        {/* Network & Mode Selector */}
        <div className="mt-4 flex flex-col gap-2.5 bg-[#160334] p-3 rounded border border-[#7135F2]/40">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-gray-300">Modo de Operación:</span>
            <div className="inline-flex rounded p-0.5 bg-[#12022b]">
              <button
                type="button"
                onClick={() => setMode("Simulated")}
                className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all uppercase ${
                  mode === "Simulated"
                    ? "bg-[#05C7F2] text-black font-semibold shadow-[0_0_8px_#05C7F2]"
                    : "text-gray-400 hover:text-[#F2F2F2]"
                }`}
              >
                Sandbox
              </button>
              <button
                type="button"
                onClick={() => setMode("Live")}
                className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all uppercase ${
                  mode === "Live"
                    ? "bg-[#05C7F2] text-black font-semibold shadow-[0_0_8px_#05C7F2]"
                    : "text-gray-400 hover:text-[#F2F2F2]"
                }`}
              >
                Live Testnet
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] border-t border-[#7135F2]/30 pt-2 font-mono">
            <span className="text-gray-400">Dirección Testnet:</span>
            {isConnected && address ? (
              <span className="text-[#F2F2F2]">
                {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </span>
            ) : (
              <span className="text-[#05C7F2]/80 font-bold">Wallet No Conectada</span>
            )}
          </div>

          {/* Connect wallet widget */}
          <div className="mt-1 flex justify-center">
            <ConnectButton
              showBalance={false}
              chainStatus="icon"
              accountStatus="address"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#7135F2]/20 bg-[#160334] text-xs font-mono">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex-1 py-3 text-center transition-all border-b-2 font-bold uppercase ${
            activeTab === "feed"
              ? "border-[#7135F2] text-[#F2F2F2] bg-[#1C0340]"
              : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#7135F2]/10"
          }`}
        >
          Últimas Emisiones
        </button>
        <button
          onClick={() => setActiveTab("mint")}
          className={`flex-1 py-3 text-center transition-all border-b-2 font-bold uppercase flex items-center justify-center gap-1.5 ${
            activeTab === "mint"
              ? "border-[#7135F2] text-[#F2F2F2] bg-[#1C0340]"
              : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#7135F2]/10"
          }`}
        >
          <></>
          Emitir Certificado
        </button>
      </div>

      {/* Content wrapper with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#12022b] p-4">
        {activeTab === "feed" ? (
          <div className="space-y-4">
            {/* Quick Pitch Banner */}
            <div className="p-3 bg-[#160334] rounded border border-[#7135F2]/30 text-xs leading-relaxed text-[#F2F2F2]">
              <span className="font-bold text-[#05C7F2] uppercase">Handoo OriginPass</span> es un protocolo de pasaporte
              digital para marcas heratige. Cada producto lleva un hash criptográfico de origen registrado inmutablemente
              en Monad Testnet, protegiendo artesanos independientes contra imitaciones baratas.
            </div>

            {/* List Header */}
            <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-[#9163F2] px-1 border-b border-[#7135F2]/20 pb-1.5">
              <span>Transacciones On-Chain</span>
              <span>Monad Testnet</span>
            </div>

            {/* Live Feed Container */}
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500 font-mono">
                No hay transacciones registradas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {transactions.map((tx) => {
                  const correlatedProduct = products.find((p) => p.serialHash === tx.serialHash);
                  return (
                    <div
                      key={tx.id}
                      onClick={() => correlatedProduct && setActiveProduct(correlatedProduct)}
                      className={`group p-3 rounded border transition-all cursor-pointer flex flex-col gap-2 ${
                        activeProduct?.serialHash === tx.serialHash
                          ? "bg-[#1C0340] border-[#05C7F2]"
                          : "bg-[#160334] border-[#7135F2]/20 hover:bg-[#1C0340] hover:border-[#7135F2]/50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === "Pending"
                                ? "bg-yellow-400 animate-pulse shadow-[0_0_8px_rgb(250,204,21)]"
                                : tx.status === "Success"
                                ? "bg-[#05C7F2] shadow-[0_0_8px_#05C7F2]"
                                : "bg-red-500 shadow-[0_0_8px_rgb(239,68,68)]"
                            }`}
                          />
                          <span className="text-[10px] font-mono text-[#9163F2]/80">
                            {tx.type === "Issue"
                              ? "ISSUE_PRODUCT"
                              : tx.type === "Verify"
                              ? "VERIFY_BY_SERIAL"
                              : "STATUS_CHANGE"}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {new Date(tx.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#05C7F2] transition-colors">
                          {tx.productLine}
                        </h4>
                        {correlatedProduct && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <></>
                            {correlatedProduct.locationName}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono border-t border-[#7135F2]/20 pt-2 mt-1">
                        <span className="text-gray-400 truncate max-w-[130px]">
                          Tag: {tx.serialHash.substring(0, 14)}...
                        </span>
                        <a
                          href={`https://testnet.monadfinder.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#05C7F2] text-[9px] bg-[#05C7F2]/10 hover:bg-[#05C7F2]/20 px-2 py-0.5 rounded border border-[#05C7F2]/20 hover:border-[#05C7F2]/40"
                        >
                          Ver Explorer
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Issuance Form */
          <form onSubmit={handleMintSubmit} className="space-y-4 font-sans text-[#F2F2F2] pb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#05C7F2] font-mono border-b border-[#7135F2]/30 pb-1.5 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              MINTING PASSPORT DE ORIGEN
            </h2>

            {/* Simulated vs Live indicator */}
            {mode === "Live" && !isConnected && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-xs leading-normal text-amber-300">
                ⚠️ Estás en modo <strong>Live Testnet</strong> pero tu wallet no está conectada. Los envíos de datos fallarán. Te recomendamos activar el modo <strong>Sandbox</strong> en la cabecera para disfrutar del simulador inmediato, o conectar MetaMask arriba.
              </div>
            )}

            {/* Serial Number & Real-time Hash Output */}
            <div>
              <label className="block text-[10px] text-[#9163F2] uppercase tracking-wide mb-1">
                Serial del Producto (Tag Único)
              </label>
              <input
                type="text"
                required
                placeholder="Ej. SN-HANDOO-2024-X9"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                className="w-full bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs font-mono text-white focus:border-[#05C7F2] outline-none"
              />
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 bg-[#160334] p-2 rounded border border-[#7135F2]/30 text-[10px] font-mono">
                <span className="text-[#9163F2]/80">Keccak256 bytes32 (Viem):</span>
                <span className="text-[#05C7F2] break-all select-all font-mono">
                  {liveSerialHash}
                </span>
              </div>
            </div>

            {/* Product Line and Brand */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#9163F2] uppercase mb-1">
                  Línea de Producto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Barro Negro Jar"
                  value={productLine}
                  onChange={(e) => setProductLine(e.target.value)}
                  className="w-full bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs text-white focus:border-[#05C7F2] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#9163F2] uppercase mb-1">
                  Marca de Origen
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller Real Oaxaca"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs text-white focus:border-[#05C7F2] outline-none"
                />
              </div>
            </div>

            {/* Geographical Location Presets or Custom Inputs */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] text-[#9163F2] uppercase">
                  Ubicación de Origen
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomLoc(!useCustomLoc)}
                  className="text-[10px] text-[#05C7F2] hover:underline font-mono"
                >
                  {useCustomLoc ? "Usar Preajustes" : "Manual Coords"}
                </button>
              </div>

              {useCustomLoc ? (
                <div className="space-y-2 bg-[#12022b] p-3 rounded border border-[#7135F2]/30">
                  <input
                    type="text"
                    placeholder="Nombre del lugar (Ej. Jalisco, MX)"
                    value={customLocName}
                    onChange={(e) => setCustomLocName(e.target.value)}
                    className="w-full bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs text-white focus:border-[#05C7F2] outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitud"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs font-mono text-white focus:border-[#05C7F2] outline-none"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitud"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs font-mono text-white focus:border-[#05C7F2] outline-none"
                    />
                  </div>
                </div>
              ) : (
                <select
                  value={selectedSiteIndex}
                  onChange={(e) => setSelectedSiteIndex(parseInt(e.target.value))}
                  className="w-full bg-[#1C0340] border border-[#7135F2]/40 text-white px-3 py-2 text-xs outline-none focus:border-[#05C7F2]"
                >
                  {HERITAGE_SITES.map((site, index) => (
                    <option key={index} value={index}>
                      {site.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* AI Generator Notes and Button */}
            <div className="bg-[#160334] p-3 rounded border border-[#7135F2]/30 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#9163F2] flex items-center gap-1">
                  <></>
                  Copiloto Gemini AI para Pedigrí
                </span>
                <button
                  type="button"
                  onClick={handleAISynthesis}
                  disabled={isGeneratingDescription || !productLine}
                  className="text-[10px] bg-[#05C7F2]/10 hover:bg-[#05C7F2]/20 text-[#05C7F2] font-bold py-1 px-2.5 rounded border border-[#05C7F2]/30 disabled:opacity-50 transition-all flex items-center gap-1 font-mono uppercase"
                >
                  {isGeneratingDescription ? "Generando..." : "Sintetizar con AI"}
                </button>
              </div>
              <textarea
                placeholder="Notas breves de manufactura (Ej. Barro pulido a mano, hilos teñidos con cochinilla)"
                value={briefNotes}
                onChange={(e) => setBriefNotes(e.target.value)}
                className="w-full bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs text-white resize-none h-12 placeholder:text-gray-500 outline-none focus:border-[#05C7F2]"
              />
            </div>

            {/* Final Certificate Backstory (Extended Metadata) */}
            <div>
              <label className="block text-[10px] text-[#9163F2] uppercase mb-1">
                Biografía de Proveniencia Certificada (On-Chain)
              </label>
              <textarea
                required
                placeholder="El texto poético final o pedigrí del producto. Utiliza el botón del Copiloto AI de arriba para sintetizar un magnífico relato o escríbelo directamente."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1C0340] border border-[#7135F2]/40 px-3 py-2 text-xs text-white placeholder:text-gray-500 leading-relaxed h-28 outline-none focus:border-[#05C7F2]"
              />
            </div>

            {/* Form Submit State Alerts */}
            {mintStatus === "pending" && (
              <div className="p-3 bg-yellow-400/5 border border-yellow-500/20 text-yellow-300 rounded text-xs flex flex-col gap-1.5 font-mono">
                <div className="flex items-center gap-2 font-bold uppercase">
                  <span className="animate-spin text-xs">🌀</span>
                  <span>Ejecutando issueProduct en Monad...</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Esperando confirmación del bloque Monad. Latencia estimada 2s.
                </div>
              </div>
            )}

            {mintStatus === "success" && (
              <div className="p-3 bg-[#05C7F2]/10 border border-[#05C7F2]/30 text-[#05C7F2] rounded text-xs flex flex-col gap-1 font-mono">
                <div className="flex items-center gap-1.5 font-bold uppercase">
                  <></>
                  <span>Emisión Completada</span>
                </div>
                <p className="text-[10px] text-gray-300">
                  El OriginPass ha sido anexado al ledger del contrato OriginPass.sol con éxito. Ya puedes buscarlo en el mapa global.
                </p>
              </div>
            )}

            {mintStatus === "error" && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs flex flex-col gap-0.5 font-mono">
                <span className="font-bold uppercase">Fallo en la Emisión del Contrato</span>
                <span className="text-[10px] text-gray-400">
                  Revisa tu conexión en Monad Testnet o reconecta el simulador Sandbox.
                </span>
              </div>
            )}

            {/* Mint Submit Button */}
            <button
              type="submit"
              disabled={mintStatus === "pending"}
              className="w-full py-3 bg-[#F2F2F2] hover:bg-[#05C7F2] text-black font-bold text-xs uppercase hover:shadow-[0_0_15px_rgba(5,199,242,0.35)] transition-all outline-none cursor-pointer"
            >
              Generate On-Chain Passport
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
