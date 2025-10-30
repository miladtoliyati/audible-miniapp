import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@lib/db';   // ← change this line

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const demo = process.env.DEMO_MODE === 'true';
  if (req.method === 'GET' and demo) {
    const { id, status } = req.query as { id?: string, status?: string };
    if (!id || !status) return res.status(400).json({ ok: false, error: 'missing id/status' });
    if (status === 'confirmed') {
      db.markRewardPaid(id, 'demo_tx_hash');
    }
    return res.json({ ok: true, demo: true });
  }

  if (req.method !== 'POST') return res.status(405).end();

  // TODO: validate signature with X402_WEBHOOK_SECRET
  const { id, status, txHash } = req.body as { id?: string, status?: string, txHash?: string };
  if (!id || !status) return res.status(400).json({ ok: false });

  if (status === 'confirmed') {
    db.markRewardPaid(id, txHash || 'demo_tx_hash');
  }
  // If type=summary, run your summarizer here after confirmation.

  res.json({ ok: true });
}
