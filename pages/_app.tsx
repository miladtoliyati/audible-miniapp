import type { AppProps } from 'next/app'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '../lib/wagmi'
import { useEffect } from 'react'

import '../styles.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(()=>{
    // simple viewport fix for Base app webview if needed
    document.documentElement.style.background = '#fff';
  },[]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiProvider>
  )
}
