export type User = { id: string; wallet?: string };
export type Book = { asin: string; title: string; author: string; durationMin: number; cover: string; priceHint?: string };
export type Click = { id: string; userId?: string; asin: string; affiliateUrl: string; refAddr?: string; createdAt: number; returnedAt?: number };
export type Reward = { id: string; clickId: string; userWallet: string; userAmount: number; refAddr?: string; refAmount?: number; status: 'pending'|'paid'|'expired'; txHash?: string };

const mem = {
  users: new Map<string, User>(),
  books: new Map<string, Book>(),
  clicks: new Map<string, Click>(),
  rewards: new Map<string, Reward>(),
};

// Seed a couple of books
(function seed() {
  const demo: Book[] = [
    { asin: 'B07ZZZ001', title: 'Atomic Habits', author: 'James Clear', durationMin: 320, cover: '/covers/atomic.jpg', priceHint: '$14.95' },
    { asin: 'B01H2E0J5M', title: 'Sapiens', author: 'Yuval Noah Harari', durationMin: 900, cover: '/covers/sapiens.jpg', priceHint: '$24.95' },
  ];
  demo.forEach(b => mem.books.set(b.asin, b));
})();

export const db = {
  findBooks(q?: string): Book[] {
    const all = Array.from(mem.books.values());
    if (!q) return all;
    const s = q.toLowerCase();
    return all.filter(b => (b.title + b.author).toLowerCase().includes(s));
  },
  createClick(asin: string, affiliateUrl: string, refAddr?: string): Click {
    const id = `clk_${Math.random().toString(36).slice(2)}`;
    const c: Click = { id, asin, affiliateUrl, refAddr, createdAt: Date.now() };
    mem.clicks.set(id, c);
    return c;
  },
  issueReward(clickId: string, userWallet: string, userAmount: number, refAddr?: string, refAmount?: number): Reward {
    const id = `rwd_${Math.random().toString(36).slice(2)}`;
    const r: Reward = { id, clickId, userWallet, userAmount, refAddr, refAmount, status: 'pending' };
    mem.rewards.set(id, r);
    return r;
  },
  markRewardPaid(id: string, txHash: string) {
    const r = mem.rewards.get(id);
    if (r) { r.status = 'paid'; r.txHash = txHash; }
  }
};
