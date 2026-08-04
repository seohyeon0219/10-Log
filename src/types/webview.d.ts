import type { SupabaseClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    __supabase?: SupabaseClient
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }
  }
}
