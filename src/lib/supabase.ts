import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null
let currentUrl: string | null = null
let currentKey: string | null = null

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string | undefined) : undefined
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) : undefined

  return {
    url: (envUrl || '').trim(),
    anonKey: (envKey || '').trim(),
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials()
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10)
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials()
  if (!url || !anonKey || !url.startsWith('http')) {
    return null
  }

  // Reuse client if credentials haven't changed
  if (cachedClient && currentUrl === url && currentKey === anonKey) {
    return cachedClient
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
    currentUrl = url
    currentKey = anonKey
    return cachedClient
  } catch (err) {
    console.error('Gagal menginisialisasi Supabase client:', err)
    return null
  }
}

export type { User, Session }
