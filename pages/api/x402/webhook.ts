import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const demo = process.env.DEMO_MODE === 'true';

  // Demo mode: allow simple GET to simulate x402 success
  if (demo && req.method === 'GET') {
    const { id, status } = req.query as { id?: string; status?: string };
    if (!id || !status) return res.status(400).json({ ok: false, error: 'missing id/status' });
    if (status === 'confirmed') {
      db.markRewardPaid(id, 'demo_tx_hash');
    }
    return res.json({ ok: true, demo: true });
  }

  // Normal mode: expect signed POST from x402
  if (req.method !== 'POST') return res.status(405).end();

  // TODO: verify signature with X402_WEBHOOK_SECRET
  const { id, status, txHash } = req.body as { id?: string; status?: string; txHash?: string };
  if (!id || !status) return res.status(400).json({ ok: false });

  if (status === 'confirmed') {
    db.markRewardPaid(id, txHash || 'demo_tx_hash');
  }

  res.json({ ok: true });
}
