// src/App.tsx
import { useState, FormEvent } from 'react';
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { keccak256, toHex, toBytes } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Contract address – read from Vite env (prefix VITE_)
const ORIGINPASS_ADDRESS = import.meta.env.VITE_ORIGINPASS_ADDRESS as `0x${string}`;
import { originPassAbi } from './abi/originpass';

/** Convert an arbitrary string (e.g. “VUELTIAO‑001”) to a `bytes32` keccak256 hash */
function toBytes32(value: string): `0x${string}` {
  return keccak256(toBytes(value));
}

// Fake metadata hash – replace with real one when available
const FAKE_METADATA_HASH: `0x${string}` = '0x' + '00'.repeat(32);

/* -------------------------------------------------------------------------
   ISSUE PRODUCT – WRITE LOGIC
   ----------------------------------------------------------------------- */
function IssueProduct() {
  const [serialText, setSerialText] = useState('');
  const [productLine, setProductLine] = useState('');

  const { data: request, error: prepError } = useSimulateContract({
    address: ORIGINPASS_ADDRESS,
    abi: originPassAbi,
    functionName: 'issueProduct',
    args: [toBytes32(serialText), FAKE_METADATA_HASH, productLine],
    // Enable only when we have a non‑empty product line; otherwise the call will be rejected
    enabled: Boolean(serialText && productLine),
  });

  const {
    data: writeResult,
    error: writeError,
    isPending: isWalletPending,
    write,
  } = useWriteContract(request ?? {});

  const {
    data: receipt,
    isLoading: isTxProcessing,
    isSuccess: isTxSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: writeResult?.hash,
    confirmations: 1,
  });

  const handleIssue = (e: FormEvent) => {
    e.preventDefault();
    if (write) write();
  };

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Emitir producto</h2>
      <form onSubmit={handleIssue} style={{ display: 'grid', gap: '0.5rem' }}>
        <label>
          Serial físico
          <input
            type="text"
            value={serialText}
            onChange={(e) => setSerialText(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Línea de producto
          <input
            type="text"
            value={productLine}
            onChange={(e) => setProductLine(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </label>
        <button
          type="submit"
          disabled={isWalletPending || isTxProcessing || !write}
          style={{
            padding: '0.5rem 1rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isWalletPending
            ? 'Solicitando firma…'
            : isTxProcessing
            ? 'En cadena…'
            : 'Emitir'}
        </button>
      </form>
      {prepError && <p style={{ color: 'red' }}>{prepError.message}</p>}
      {writeError && <p style={{ color: 'red' }}>{writeError.message}</p>}
      {txError && <p style={{ color: 'red' }}>{txError.message}</p>}
      {isTxSuccess && receipt?.transactionHash && (
        <p style={{ color: 'green' }}>
          ✅ Tx confirmada:{' '}
          <a
            href={`https://testnet.monadexplorer.com/tx/${receipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            {receipt.transactionHash}
          </a>
        </p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------
   VERIFY PRODUCT – READ LOGIC
   ----------------------------------------------------------------------- */
type ProductInfo = {
  issuer: `0x${string}`;
  serialHash: `0x${string}`;
  metadataHash: `0x${string}`;
  productLine: string;
  owner: `0x${string}`;
  status: number;
  issuedAt: bigint;
};

function VerifyProduct() {
  const [serialText, setSerialText] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const serialHash = toBytes32(serialText);

  const { data, error, isFetching, refetch } = useReadContract({
    address: ORIGINPASS_ADDRESS,
    abi: originPassAbi,
    functionName: 'verifyBySerial',
    args: [serialHash] as const,
    query: { enabled: false },
  });

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);
    refetch();
  };

  const product: ProductInfo | undefined = data
    ? {
        issuer: data[0] as `0x${string}`,
        serialHash: data[1] as `0x${string}`,
        metadataHash: data[2] as `0x${string}`,
        productLine: data[3] as string,
        owner: data[4] as `0x${string}`,
        status: Number(data[5]),
        issuedAt: BigInt(data[6]),
      }
    : undefined;

  return (
    <section>
      <h2>Verificar producto</h2>
      <form onSubmit={handleVerify} style={{ display: 'grid', gap: '0.5rem' }}>
        <label>
          Serial físico
          <input
            type="text"
            value={serialText}
            onChange={(e) => setSerialText(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </label>
        <button
          type="submit"
          disabled={isFetching || !shouldFetch}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isFetching ? 'Consultando…' : 'Verificar'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{(error as Error).message}</p>}
      {product && product.status > 0 ? (
        <div style={{ marginTop: '1rem', lineHeight: '1.5' }}>
          <p>
            <strong>Línea de producto:</strong> {product.productLine}
          </p>
          <p>
            <strong>Emisor:</strong>{' '}
            <a
              href={`https://testnet.monadexplorer.com/address/${product.issuer}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              {product.issuer}
            </a>
          </p>
          <p>
            <strong>Fecha de emisión:</strong>{' '}
            {new Date(Number(product.issuedAt) * 1_000).toLocaleString()}
          </p>
        </div>
      ) : (
        shouldFetch &&
        !isFetching && (
          <p style={{ marginTop: '1rem', color: '#d97706' }}>
            No se encontró un producto con ese serial.
          </p>
        )
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------
   MAIN APP COMPONENT
   ----------------------------------------------------------------------- */
export default function App() {
  return (
    <main
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Handoo OriginPass</h1>
        <ConnectButton />
      </header>
      <IssueProduct />
      <hr />
      <VerifyProduct />
    </main>
  );
}
