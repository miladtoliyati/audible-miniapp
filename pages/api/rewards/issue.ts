import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/x402';
import { buildX402Uri } from '@lib/x402';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { clickId, user, ref } = req.body as { clickId: string; user: string; ref?: string };
  if (!clickId || !user) return res.status(400).json({ error: 'clickId and user required' });

  const reward = db.issueReward(clickId, user, 2.00, ref, ref ? 0.50 : 0);
  const expires = Math.floor(Date.now()/1000) + 15*60;

  const x402Uri = buildX402Uri({
    to: user,
    chain: 'base',
    asset: 'USDC',
    amount: reward.userAmount.toFixed(2),
    memo: `Cashback:${clickId}`,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/x402/webhook?id=${reward.id}`,
    expires_at: expires
  });

  res.json({ x402Uri, amount: reward.userAmount, expires_at: expires, rewardId: reward.id });
}
