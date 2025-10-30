export type X402Request = {
  to: string;
  chain: 'base';
  asset: 'USDC';
  amount: string; // e.g., '2.00'
  memo?: string;
  callback_url?: string;
  expires_at?: number; // epoch seconds
};

export function buildX402Uri(req: X402Request): string {
  const params = new URLSearchParams({
    to: req.to,
    chain: req.chain,
    asset: req.asset,
    amount: req.amount,
  });
  if (req.memo) params.set('memo', req.memo);
  if (req.callback_url) params.set('callback_url', req.callback_url);
  if (req.expires_at) params.set('expires_at', String(req.expires_at));
  return `x402:pay?${params.toString()}`;
}
