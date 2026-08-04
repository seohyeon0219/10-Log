import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useWebViewBridge() {
  useEffect(() => {
    if (!window.ReactNativeWebView) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        window.ReactNativeWebView!.postMessage(
          JSON.stringify({ type: 'TOKEN_REFRESHED', session })
        )
      } else if (event === 'SIGNED_OUT') {
        window.ReactNativeWebView!.postMessage(
          JSON.stringify({ type: 'SIGNED_OUT' })
        )
      }
    })

    return () => subscription.unsubscribe()
  }, [])
}
