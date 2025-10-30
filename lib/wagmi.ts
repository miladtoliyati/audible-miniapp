import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'

export const chains = [baseSepolia, base] as const

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://sepolia.base.org'),
    [base.id]: http('https://mainnet.base.org'),
  },
})
