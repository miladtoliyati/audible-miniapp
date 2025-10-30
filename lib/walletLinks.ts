export function coinbaseWalletLinkFromX402(x402Uri: string): string {
  // Many wallets can parse a plain URI if opened in-app.
  // This helper wraps the x402 URI in Coinbase Wallet's universal link.
  const base = 'https://wallet.coinbase.com/?uri='
  return base + encodeURIComponent(x402Uri)
}
