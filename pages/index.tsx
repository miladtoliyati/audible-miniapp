import { useEffect, useState } from 'react';
import axios from 'axios';
import X402Modal from '../components/X402Modal';
import ConnectStatus from '../components/ConnectStatus';

type Book = { asin: string; title: string; author: string; durationMin: number; cover: string; priceHint?: string };

export default function Home() {
  const [q, setQ] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [x402Uri, setX402Uri] = useState<string|null>(null);
  const [addr, setAddr] = useState<string|null>(null);
  const [rewardId, setRewardId] = useState<string|null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => { search(''); }, []);

  async function search(query: string) {
    const res = await axios.get('/api/books', { params: { q: query } });
    setBooks(res.data.books);
  }

  async function buy(asin: string) {
    const res = await axios.post('/api/clicks', { asin });
    const { clickId, audibleUrl } = res.data;
    // navigate out to Audible
    window.location.href = audibleUrl;
    // After returning, user can click "Claim" button on detail page in a full app.
    // For demo, we immediately prepare reward request:
    const claim = await axios.post('/api/rewards/issue', { clickId, user: addr || '0x0000000000000000000000000000000000000000' });
    setX402Uri(claim.data.x402Uri);
    setRewardId(claim.data.rewardId);
    setStatus('Pending payment...')
  }


      async function simulateSuccess() {
        if (!rewardId) return;
        await axios.get('/api/x402/webhook', { params: { id: rewardId, status: 'confirmed' } });
        setStatus('Reward paid (demo)!');
      }
    
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Audible Discovery + x402 Rewards (Base)</h1>
      <p className="text-gray-600 mt-1">Discover titles. Buy on Audible. Claim on-chain rewards & add-ons.</p>

      <div className="mt-4"><ConnectStatus onAddress={setAddr} /></div>

      <div className="mt-6 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} className="border rounded-md px-3 py-2 flex-1" placeholder="Search books..." />
        <button onClick={()=>search(q)} className="px-4 py-2 rounded-md border">Search</button>
      </div>

      <div className="mt-6 grid gap-4">
        {books.map(b => (
          <div key={b.asin} className="border rounded-xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-md" />
            <div className="flex-1">
              <div className="font-semibold">{b.title}</div>
              <div className="text-sm text-gray-600">{b.author} • {Math.round(b.durationMin/60)}h</div>
              {b.priceHint && <div className="text-sm mt-1">Price: {b.priceHint}</div>}
            </div>
            <button onClick={()=>buy(b.asin)} className="px-4 py-2 rounded-md border">Buy on Audible</button>
          </div>
        ))}
      </div>

      <div className='mt-6'>
        <div className='text-sm text-gray-700'>{status}</div>
        {rewardId && (
          <button onClick={simulateSuccess} className='mt-2 px-3 py-2 rounded-md border'>Simulate x402 success (demo)</button>
        )}
      </div>

      <X402Modal uri={x402Uri} onClose={()=>setX402Uri(null)} />
    </main>
  );
}
