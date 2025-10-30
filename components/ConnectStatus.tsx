import { useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function ConnectStatus({ onAddress }: { onAddress: (addr: string|null)=>void }){
  const { address, status } = useAccount()
  useEffect(()=>{
    onAddress(address ?? null)
  }, [address, onAddress])

  return (
    <div className="text-sm text-gray-700">
      {status === 'connected' && address ? `Connected: ${address.slice(0,6)}…${address.slice(-4)}` : 'Not connected (Base app will auto-inject wallet)'}
    </div>
  )
}
