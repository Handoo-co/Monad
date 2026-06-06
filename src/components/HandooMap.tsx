import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useHandoo } from "../lib/handooProvider";
import type { Product } from "../types";
import { ShieldCheck, ShoppingBag, ShieldAlert, Cpu } from "lucide-react";

// Inline helper to pan the map dynamically when active coordinate changes
interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [center, zoom, map]);
  return null;
};

export const HandooMap: React.FC<{ activeProduct: Product | null; setActiveProduct: (p: Product) => void }> = ({
  activeProduct,
  setActiveProduct,
}) => {
  const { products, changeProductStatus, mode } = useHandoo();
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState<number>(2);
  const [verifyingHash, setVerifyingHash] = useState<string | null>(null);

  // Triggered when active product from parent changes (e.g., from emissions feed)
  useEffect(() => {
    if (activeProduct) {
      setMapCenter([activeProduct.lat, activeProduct.lng]);
      setMapZoom(6);
    }
  }, [activeProduct]);

  // Leaflet custom interactive indicator markers
  const createCustomIcon = (status: "Valid" | "Sold" | "Revoked") => {
    let color = "#05C7F2"; // Vibrant Cyan
    let animationClass = "animate-ping opacity-75";

    if (status === "Sold") {
      color = "#60A5FA"; // Ice-blue
      animationClass = "opacity-0";
    } else if (status === "Revoked") {
      color = "#EF4444"; // Vivid red
      animationClass = "opacity-0";
    }

    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex h-full w-full rounded-full bg-[${color}] ${animationClass}"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-[${color}] border-2 border-[#1C0340] shadow-[0_0_12px_${color}]"></span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Simulate on-chain call "verifyBySerial" matching the smart contract
  const triggerOnChainVerification = (product: Product) => {
    setVerifyingHash(product.serialHash);
    
    // Simulate RPC lag or cryptographic resolution
    setTimeout(() => {
      setVerifyingHash(null);
    }, 1200);
  };

  return (
    <div id="handoo-map-container" className="relative flex-1 w-full h-full bg-[#1C0340] overflow-hidden flex flex-col font-sans">
      {/* Map Sub-Header with telemetry and quick explanation */}
      <div className="absolute top-4 left-4 right-4 z-40 flex flex-wrap items-center justify-between gap-3 bg-[#12022b]/95 border border-[#7135F2]/45 px-4 py-3 rounded shadow-2xl">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-[#05C7F2]" />
          <div>
            <h2 className="text-sm font-bold text-gray-100 uppercase tracking-tight">
              Mapa Global de Proveniencia Handoo
            </h2>
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
              Visualización geográfica de OriginPass emitidos on-chain en Monad ({mode})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#05C7F2] shadow-[0_0_6px_#05C7F2]" />
            <span className="text-gray-300 text-[10px] uppercase">Válido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] shadow-[0_0_6px_#60A5FA]" />
            <span className="text-gray-300 text-[10px] uppercase">Vendido</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]" />
            <span className="text-gray-300 text-[10px] uppercase">Revocado</span>
          </div>
        </div>
      </div>

      {/* Leaflet Main Interactive Window */}
      <div className="w-full h-full flex-1 relative z-10">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full"
          zoomControl={false} // Disable to place it cleanly or customize
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Custom Dark Tilelayer fitting the cyberpunk aesthetic */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Controller to handle panning */}
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Dynamically plot registered pass certificates */}
          {products.map((product) => (
            <Marker
              key={product.serialHash}
              position={[product.lat, product.lng]}
              icon={createCustomIcon(product.status)}
              eventHandlers={{
                click: () => {
                  setActiveProduct(product);
                  triggerOnChainVerification(product);
                },
              }}
            >
              <Popup
              >
                <div className="w-72 font-sans p-1 text-[#F2F2F2] flex flex-col gap-2.5 select-none">
                  <div className="flex items-center justify-between border-b border-[#7135F2]/30 pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#05C7F2] font-bold uppercase">
                      MONAD TESTNET ID: 10143
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {product.isSimulated ? "Sandbox Cache" : "On-chain Live"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{product.productLine}</h3>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{product.locationName}</p>
                  </div>

                  {/* Simulated ledger verification check */}
                  <div className="bg-[#1C0340] border border-[#7135F2]/30 p-3 rounded-sm overflow-hidden flex flex-col gap-1.5 font-mono">
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>Serial Hash:</span>
                      <span className="text-gray-300 font-mono text-[9px] truncate max-w-[130px]" title={product.serialHash}>
                        {product.serialHash}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-[#7135F2]/20 pt-1.5 mt-1.5">
                      <span>Metatada:</span>
                      <span className="text-gray-300 text-[9px] truncate max-w-[130px]">{product.metadataHash}</span>
                    </div>

                    {/* Verification Status Loader */}
                    <div className="mt-2.5 pt-2 border-t border-[#7135F2]/20 flex flex-col gap-1">
                      {verifyingHash === product.serialHash ? (
                        <div className="flex items-center justify-center gap-2 py-1 bg-yellow-400/5 text-yellow-300 border border-yellow-500/20 rounded text-[11px] font-semibold">
                          <span className="animate-spin text-xs">🌀</span>
                          <span>verifyBySerial(hash)...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 uppercase">Estado Contractual:</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                              product.status === "Valid"
                                ? "bg-[#05C7F2]/10 text-[#05C7F2] border border-[#05C7F2]/30"
                                : product.status === "Sold"
                                ? "bg-blue-400/10 text-blue-400 border border-blue-500/20"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {product.status === "Valid" && <ShieldCheck className="w-3 h-3 inline" />}
                            {product.status === "Sold" && <ShoppingBag className="w-3 h-3 inline" />}
                            {product.status === "Revoked" && <ShieldAlert className="w-3 h-3 inline" />}
                            {product.status === "Valid" ? "Válido" : product.status === "Sold" ? "Vendido" : "Revocado"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Story summary for context */}
                  <div className="text-[11px] text-gray-300 leading-relaxed italic bg-[#12022b] p-2 rounded border border-[#7135F2]/30">
                    "{product.description}"
                  </div>

                  {/* Interactive Status Modifiers (For Demo Purposes) */}
                  <div className="flex flex-col gap-1.5 border-t border-[#7135F2]/30 pt-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Panel de Control de Estado:</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => changeProductStatus(product.serialHash, "Valid")}
                        className={`text-[9px] py-1 font-mono uppercase tracking-tight rounded transition-all font-semibold ${
                          product.status === "Valid"
                            ? "bg-[#05C7F2] text-black font-semibold shadow-[0_0_8px_#05C7F2]"
                            : "bg-[#1C0340] text-gray-300 hover:bg-[#250058] hover:text-[#05C7F2] border border-[#7135F2]/20"
                        }`}
                      >
                        Válido
                      </button>
                      <button
                        onClick={() => changeProductStatus(product.serialHash, "Sold")}
                        className={`text-[9px] py-1 font-mono uppercase tracking-tight rounded transition-all font-semibold ${
                          product.status === "Sold"
                            ? "bg-blue-500 text-black font-semibold shadow-[0_0_8px_rgb(59,130,246)]"
                            : "bg-[#1C0340] text-gray-300 hover:bg-[#250058] hover:text-blue-400 border border-[#7135F2]/20"
                        }`}
                      >
                        Vendido
                      </button>
                      <button
                        onClick={() => changeProductStatus(product.serialHash, "Revoked")}
                        className={`text-[9px] py-1 font-mono uppercase tracking-tight rounded transition-all font-semibold ${
                          product.status === "Revoked"
                            ? "bg-red-500 text-white shadow-[0_0_8px_rgb(239,68,68)]"
                            : "bg-[#1C0340] text-gray-300 hover:bg-[#250058] hover:text-red-400 border border-[#7135F2]/20"
                        }`}
                      >
                        Revocar
                      </button>
                    </div>
                  </div>

                  <div className="text-[9px] text-center text-gray-500 font-mono flex items-center justify-center gap-1.5 border-t border-[#7135F2]/30 pt-1.5 mt-1">
                    <span>Emisión: {new Date(product.timestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <a
                      href={`https://testnet.monadfinder.com/tx/${product.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#05C7F2]/80 hover:underline hover:text-[#05C7F2] truncate max-w-[120px]"
                    >
                      Ver Tx
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
