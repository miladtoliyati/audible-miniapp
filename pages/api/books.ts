import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  const books = db.findBooks(typeof q === 'string' ? q : undefined);
  res.json({ books });
}
