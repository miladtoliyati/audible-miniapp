import { useEffect } from 'react';
import { coinbaseWalletLinkFromX402 } from '../lib/walletLinks';

export default function X402Modal({ uri, onClose }: { uri: string|null, onClose: () => void }) {
  useEffect(() => {
    if (!uri) return;
    // Attempt to open wallet handler
    try {
      window.location.href = uri;
    } catch {}
  }, [uri]);
  if (!uri) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-2">Approve x402 payment</h3>
        <p className="text-sm text-gray-600">If your wallet did not open automatically, copy the URI below into your wallet.</p>
        <textarea readOnly className="mt-3 w-full h-28 border rounded-md p-2 text-xs">{uri}</textarea>
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={()=>{ navigator.clipboard.writeText(uri || '') }}
            className="px-3 py-2 rounded-md border"
          >Copy URI</button>
          <a
            href={coinbaseWalletLinkFromX402(uri)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-md border"
          >Open in Coinbase Wallet</a>
        </div>
    
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Close</button>
        </div>
      </div>
    </div>
  );
}
