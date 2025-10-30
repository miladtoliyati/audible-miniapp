import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/db';

const base = process.env.AUDIBLE_BASE_URL || 'https://www.audible.com';
const tag = process.env.AUDIBLE_AFFILIATE_TAG || 'yourtag-20';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { asin, ref } = req.body as { asin: string; ref?: string };
  if (!asin) return res.status(400).json({ error: 'asin required' });
  const audibleUrl = `${base}/pd/${asin}?tag=${encodeURIComponent(tag)}`;
  const click = db.createClick(asin, audibleUrl, ref);
  res.json({ clickId: click.id, audibleUrl });
}
