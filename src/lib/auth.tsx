import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getSupabaseClient,
  isSupabaseConfigured,
  getSupabaseCredentials,
  User,
  Session,
} from './supabase'
import { OwnerProfile } from '../types'
import { INITIAL_OWNER } from '../data/initialData'
import { rowToProfile, profileToRow } from './supabaseSync'

const DEFAULT_CLEAN_PROFILE: OwnerProfile = {
  id: '',
  name: 'Pemilik Hewan',
  email: '',
  phone: '',
  city: 'Jakarta',
  address: '',
  bio: 'Penyayang hewan.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  profile: OwnerProfile | null
  isLoading: boolean
  isConfigured: boolean
  isOnline: boolean
  isDemoUser: boolean
  realtimeStatus: 'connected' | 'connecting' | 'disconnected' | 'demo'
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  loginAsDemo: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER_KEY = 'satwa_demo_session'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const demoActive = window.localStorage.getItem(DEMO_USER_KEY)
    if (demoActive === 'true') {
      const saved = window.localStorage.getItem('satwa_user_data')
      let email = 'nabila@sahabatsatwa.id'
      let name = 'Nabila Maulida'
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          email = parsed.email || email
          name = parsed.name || name
        } catch {}
      }
      return {
        id: 'user-' + email.replace(/[^a-zA-Z0-9]/g, '_'),
        email,
        user_metadata: { full_name: name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }
    }
    return null
  })
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem(DEMO_USER_KEY) !== 'true'
  })
  const [isConfigured, setIsConfigured] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(DEMO_USER_KEY) === 'true'
  })
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'demo'>('connecting')

  // Check online status
  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsOnline(window.navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkConfigAndInit = useCallback(async () => {
    setIsLoading(true)
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)

    if (configured) {
      const supabase = getSupabaseClient()
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.getSession()
          if (!error && data.session) {
            setSession(data.session)
            setUser(data.session.user)
            setIsDemoUser(false)
            setRealtimeStatus('connected')

            // Fetch profile
            const { data: profData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .maybeSingle()

            if (profData) {
              setProfile(rowToProfile(profData, data.session.user.email))
            } else {
              // Create initial profile row
              const newProf: OwnerProfile = {
                ...DEFAULT_CLEAN_PROFILE,
                id: data.session.user.id,
                email: data.session.user.email || '',
                name: (data.session.user.user_metadata?.full_name as string) || data.session.user.email?.split('@')[0] || 'Pemilik Hewan',
              }
              await supabase.from('profiles').insert(profileToRow(newProf, data.session.user.id))
              setProfile(newProf)
            }
          } else {
            // Check if demo user saved
            const demoActive = window.localStorage.getItem(DEMO_USER_KEY)
            if (demoActive === 'true') {
              initDemoUser()
            } else {
              setUser(null)
              setSession(null)
              setProfile(null)
              setIsDemoUser(false)
              setRealtimeStatus('disconnected')
            }
          }
        } catch (err) {
          console.error('Error fetching Supabase auth session:', err)
          setRealtimeStatus('disconnected')
        }
      }
    } else {
      // Supabase not configured: check if demo mode active
      const demoActive = typeof window !== 'undefined' ? window.localStorage.getItem(DEMO_USER_KEY) : null
      if (demoActive === 'true') {
        initDemoUser()
      } else {
        setUser(null)
        setSession(null)
        setProfile(null)
        setIsDemoUser(false)
        setRealtimeStatus('disconnected')
      }
    }
    setIsLoading(false)
  }, [])

  function initDemoUser(emailOverride?: string, nameOverride?: string) {
    setIsDemoUser(true)
    setRealtimeStatus('demo')

    let email = emailOverride
    let name = nameOverride

    if (typeof window !== 'undefined') {
      if (!email) {
        const saved = window.localStorage.getItem('satwa_user_data')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            email = parsed.email
            name = parsed.name
          } catch {}
        }
      }
    }

    email = email || 'nabila@sahabatsatwa.id'
    name = name || 'Nabila Maulida'

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('satwa_user_data', JSON.stringify({ email, name }))
      window.localStorage.setItem(DEMO_USER_KEY, 'true')
    }

    const mockUser: any = {
      id: 'user-' + email.replace(/[^a-zA-Z0-9]/g, '_'),
      email,
      user_metadata: { full_name: name },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    }
    setUser(mockUser)
    setSession({
      access_token: 'local_token',
      token_type: 'bearer',
      user: mockUser,
      expires_in: 3600,
      refresh_token: 'local_refresh',
    })
    setProfile({
      ...INITIAL_OWNER,
      name,
      email,
    })
  }

  // Setup auth listener
  useEffect(() => {
    checkConfigAndInit()

    const handleConfigChange = () => {
      checkConfigAndInit()
    }
    window.addEventListener('satwa_supabase_config_changed', handleConfigChange)

    const supabase = getSupabaseClient()
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          setIsDemoUser(false)
          setRealtimeStatus('connected')

          // Fetch or create profile
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .maybeSingle()

          if (profData) {
            setProfile(rowToProfile(profData, currentSession.user.email))
          } else {
            const newProf: OwnerProfile = {
              ...DEFAULT_CLEAN_PROFILE,
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: (currentSession.user.user_metadata?.full_name as string) || currentSession.user.email?.split('@')[0] || 'Pemilik Hewan',
            }
            await supabase.from('profiles').insert(profileToRow(newProf, currentSession.user.id))
            setProfile(newProf)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setSession(null)
          setProfile(null)
          setIsDemoUser(false)
          setRealtimeStatus('disconnected')
        }
      })

      return () => {
        subscription.unsubscribe()
        window.removeEventListener('satwa_supabase_config_changed', handleConfigChange)
      }
    }

    return () => {
      window.removeEventListener('satwa_supabase_config_changed', handleConfigChange)
    }
  }, [checkConfigAndInit])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    if (isDemoUser) {
      const email = user.email || INITIAL_OWNER.email
      const name = (user.user_metadata?.full_name as string) || INITIAL_OWNER.name
      setProfile({
        ...INITIAL_OWNER,
        email,
        name,
      })
      return
    }
    const supabase = getSupabaseClient()
    if (!supabase) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (data) {
      setProfile(rowToProfile(data, user.email))
    }
  }, [user, isDemoUser])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseClient()
    if (!supabase || !isConfigured) {
      // Offline / Local fallback
      if (email.trim().includes('@')) {
        initDemoUser(email.trim())
        return { success: true }
      }
      return { success: false, error: 'Format email tidak valid.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.session && data.user) {
        setSession(data.session)
        setUser(data.user)
        setIsDemoUser(false)
        setRealtimeStatus('connected')
        window.localStorage.removeItem(DEMO_USER_KEY)
        return { success: true }
      }

      return { success: false, error: 'Gagal masuk akun. Periksa kembali email dan kata sandi.' }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Terjadi kesalahan sistem saat masuk.' }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabaseClient()
    if (!supabase || !isConfigured) {
      if (email.trim().includes('@')) {
        initDemoUser(email.trim(), fullName.trim())
        return { success: true }
      }
      return {
        success: false,
        error: 'Format email tidak valid.',
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Create initial profile
        const newProf: OwnerProfile = {
          ...DEFAULT_CLEAN_PROFILE,
          id: data.user.id,
          name: fullName.trim() || 'Pemilik Hewan',
          email: data.user.email || email.trim(),
        }

        try {
          await supabase.from('profiles').insert(profileToRow(newProf, data.user.id))
        } catch {
          // Trigger may have handled it
        }

        if (data.session) {
          setSession(data.session)
          setUser(data.user)
          setProfile(newProf)
          setIsDemoUser(false)
          setRealtimeStatus('connected')
          window.localStorage.removeItem(DEMO_USER_KEY)
        }
        return { success: true }
      }

      return { success: false, error: 'Pendaftaran tidak mengembalikan data pengguna.' }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Terjadi kesalahan saat pendaftaran.' }
    }
  }

  const signOut = async () => {
    const supabase = getSupabaseClient()
    if (supabase && isConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.error('Error signing out of Supabase:', err)
      }
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DEMO_USER_KEY)
      window.localStorage.removeItem('satwa_user_data')
      window.localStorage.removeItem('sahabatsatwa_owner_v1')
      window.localStorage.removeItem('sahabatsatwa_pets_v1')
      window.localStorage.removeItem('sahabatsatwa_schedules_v1')
      window.localStorage.removeItem('sahabatsatwa_health_v1')
      window.localStorage.removeItem('sahabatsatwa_reminders_v1')
      window.localStorage.removeItem('sahabatsatwa_weight_v1')
      window.localStorage.removeItem('sahabatsatwa_feeding_v1')
      window.localStorage.removeItem('sahabatsatwa_notifications_v1')
      window.localStorage.removeItem('sahabatsatwa_read_notifs_v1')
      window.dispatchEvent(new CustomEvent('sahabatsatwa_update', { detail: { key: 'all' } }))
    }
    setUser(null)
    setSession(null)
    setProfile(null)
    setIsDemoUser(false)
    setRealtimeStatus('disconnected')
  }

  const loginAsDemo = () => {
    initDemoUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured,
        isOnline,
        isDemoUser,
        realtimeStatus,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
