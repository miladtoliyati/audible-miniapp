import type { NextApiRequest, NextApiResponse } from 'next';
import { buildX402Uri } from '@lib/x402';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { asin, type, user } = req.body as { asin: string; type: 'summary'|'notes', user: string };
  if (!asin || !type || !user) return res.status(400).json({ error: 'asin, type, user required' });
  const price = type === 'summary' ? 0.50 : 0.30;
  const expires = Math.floor(Date.now()/1000) + 10*60;

  const x402Uri = buildX402Uri({
    to: user,
    chain: 'base',
    asset: 'USDC',
    amount: price.toFixed(2),
    memo: `${type}:${asin}`,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/x402/webhook?type=${type}&asin=${asin}`,
    expires_at: expires
  });

  res.json({ x402Uri, price, expires_at: expires });
}
