import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Pet,
  CareSchedule,
  HealthRecord,
  Reminder,
  FeedingRecord,
  WeightRecord,
  OwnerProfile,
  AppNotification,
} from '../types'
import {
  INITIAL_OWNER,
  INITIAL_PETS,
  INITIAL_SCHEDULES,
  INITIAL_HEALTH_RECORDS,
  INITIAL_REMINDERS,
  INITIAL_WEIGHT_RECORDS,
  INITIAL_FEEDING_RECORDS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData'
import { todayStr, addDays, addMonths, daysBetween, relativeLabel } from './date'
import { getSupabaseClient, isSupabaseConfigured, User } from './supabase'
import { useAuth } from './auth'
import {
  rowToPet,
  petToRow,
  rowToSchedule,
  scheduleToRow,
  rowToHealth,
  healthToRow,
  rowToReminder,
  reminderToRow,
  rowToFeeding,
  feedingToRow,
  rowToWeight,
  weightToRow,
  rowToProfile,
  profileToRow,
  fetchAllUserData,
} from './supabaseSync'

export const DEMO_PET_IDS = ['pet-mochi', 'pet-luna', 'pet-oreo']
export const DEMO_SCHEDULE_IDS = ['sched-1', 'sched-2', 'sched-3', 'sched-4', 'sched-5', 'sched-6']
export const DEMO_HEALTH_IDS = ['health-1', 'health-2', 'health-3', 'health-4']
export const DEMO_REMINDER_IDS = ['rem-1', 'rem-2', 'rem-3', 'rem-4', 'rem-5']
export const DEMO_WEIGHT_IDS = ['weight-1', 'weight-2', 'weight-3', 'weight-4', 'weight-5', 'weight-6']
export const DEMO_FEEDING_IDS = ['feed-1', 'feed-2', 'feed-3', 'feed-4', 'feed-5', 'feed-6']

export function isDemoPet(pet: Pet | null | undefined): boolean {
  if (!pet) return false
  if (DEMO_PET_IDS.includes(pet.id)) return true
  if (pet.name === 'Mochi' && pet.breed === 'British Shorthair') return true
  if (pet.name === 'Luna' && pet.breed === 'Persia Medium') return true
  if (pet.name === 'Oreo' && pet.breed === 'Golden Retriever Mix') return true
  return false
}

export const DEFAULT_USER_PROFILE: OwnerProfile = {
  id: '',
  name: 'Pemilik Hewan',
  email: '',
  phone: '',
  city: 'Jakarta',
  address: '',
  bio: 'Penyayang hewan.',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
}

const KEYS = {
  OWNER: 'sahabatsatwa_owner_v1',
  PETS: 'sahabatsatwa_pets_v1',
  SCHEDULES: 'sahabatsatwa_schedules_v1',
  HEALTH: 'sahabatsatwa_health_v1',
  REMINDERS: 'sahabatsatwa_reminders_v1',
  WEIGHT: 'sahabatsatwa_weight_v1',
  FEEDING: 'sahabatsatwa_feeding_v1',
  NOTIFICATIONS: 'sahabatsatwa_notifications_v1',
  READ_NOTIFS: 'sahabatsatwa_read_notifs_v1',
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    if (!item) return fallback
    return JSON.parse(item) as T
  } catch (err) {
    console.error(`Failed to parse localStorage key ${key}:`, err)
    return fallback
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('sahabatsatwa_update', { detail: { key } }))
  } catch (err) {
    console.error(`Failed to save localStorage key ${key}:`, err)
  }
}

export const storage = {
  getOwner: () => safeGet<OwnerProfile>(KEYS.OWNER, DEFAULT_USER_PROFILE),
  setOwner: (owner: OwnerProfile) => safeSet(KEYS.OWNER, owner),

  getPets: () => safeGet<Pet[]>(KEYS.PETS, []),
  setPets: (pets: Pet[]) => safeSet(KEYS.PETS, pets),

  getSchedules: () => safeGet<CareSchedule[]>(KEYS.SCHEDULES, []),
  setSchedules: (schedules: CareSchedule[]) => safeSet(KEYS.SCHEDULES, schedules),

  getHealthRecords: () => safeGet<HealthRecord[]>(KEYS.HEALTH, []),
  setHealthRecords: (records: HealthRecord[]) => safeSet(KEYS.HEALTH, records),

  getReminders: () => safeGet<Reminder[]>(KEYS.REMINDERS, []),
  setReminders: (reminders: Reminder[]) => safeSet(KEYS.REMINDERS, reminders),

  getWeightRecords: () => safeGet<WeightRecord[]>(KEYS.WEIGHT, []),
  setWeightRecords: (records: WeightRecord[]) => safeSet(KEYS.WEIGHT, records),

  getFeedingRecords: () => safeGet<FeedingRecord[]>(KEYS.FEEDING, []),
  setFeedingRecords: (records: FeedingRecord[]) => safeSet(KEYS.FEEDING, records),

  getNotifications: () => safeGet<AppNotification[]>(KEYS.NOTIFICATIONS, []),
  setNotifications: (notifs: AppNotification[]) => safeSet(KEYS.NOTIFICATIONS, notifs),

  getReadNotifIds: () => safeGet<string[]>(KEYS.READ_NOTIFS, []),
  setReadNotifIds: (ids: string[]) => safeSet(KEYS.READ_NOTIFS, ids),

  resetToDefaults: () => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(KEYS.OWNER)
    window.localStorage.removeItem(KEYS.PETS)
    window.localStorage.removeItem(KEYS.SCHEDULES)
    window.localStorage.removeItem(KEYS.HEALTH)
    window.localStorage.removeItem(KEYS.REMINDERS)
    window.localStorage.removeItem(KEYS.WEIGHT)
    window.localStorage.removeItem(KEYS.FEEDING)
    window.localStorage.removeItem(KEYS.NOTIFICATIONS)
    window.localStorage.removeItem(KEYS.READ_NOTIFS)
    window.dispatchEvent(new CustomEvent('sahabatsatwa_update', { detail: { key: 'all' } }))
  },
}

/** Status jadwal dihitung dari tanggal, bukan disimpan statis. */
export function effectiveScheduleStatus(s: CareSchedule, today: string): CareSchedule['status'] {
  if (s.status === 'Selesai') return 'Selesai'
  return s.date < today ? 'Terlewat' : 'Akan Datang'
}

/** Status pengingat dihitung dari tanggal & flag selesai. */
export function effectiveReminderStatus(r: Reminder, today: string): Reminder['status'] {
  if (r.isCompleted) return 'Selesai'
  if (r.date < today) return 'Terlambat'
  if (r.date === today) return 'Hari Ini'
  return 'Mendatang'
}

function nextOccurrence(s: CareSchedule): string | null {
  switch (s.repeat) {
    case 'Setiap Minggu':
      return addDays(s.date, 7)
    case 'Setiap Bulan':
      return addMonths(s.date, 1)
    case 'Setiap Tahun':
      return addMonths(s.date, 12)
    default:
      return null
  }
}

export interface BackupFile {
  app: 'sahabatsatwa'
  version: 1
  exportedAt: string
  data: {
    owner: OwnerProfile
    pets: Pet[]
    schedules: CareSchedule[]
    healthRecords: HealthRecord[]
    reminders: Reminder[]
    weightRecords: WeightRecord[]
    feedingRecords: FeedingRecord[]
  }
}

export interface SatwaStoreContextType {
  isClient: boolean
  today: string
  owner: OwnerProfile
  pets: Pet[]
  schedules: CareSchedule[]
  healthRecords: HealthRecord[]
  reminders: Reminder[]
  weightRecords: WeightRecord[]
  feedingRecords: FeedingRecord[]
  notifications: AppNotification[]
  isRealtimeActive: boolean
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
  currentUser: User | null
  syncWithSupabase: () => Promise<void>
  exportData: () => BackupFile
  importData: (raw: unknown) => { ok: true } | { ok: false; error: string }
  saveOwner: (newOwner: OwnerProfile) => void
  addPet: (pet: Pet) => void
  updatePet: (pet: Pet) => void
  deletePet: (petId: string) => void
  addSchedule: (schedule: CareSchedule) => void
  updateSchedule: (schedule: CareSchedule) => void
  toggleScheduleComplete: (scheduleId: string) => CareSchedule | null
  deleteSchedule: (id: string) => void
  addHealthRecord: (record: HealthRecord) => void
  updateHealthRecord: (record: HealthRecord) => void
  deleteHealthRecord: (id: string) => void
  addReminder: (reminder: Reminder) => void
  updateReminder: (reminder: Reminder) => void
  toggleReminderComplete: (reminderId: string) => void
  deleteReminder: (id: string) => void
  addWeightRecord: (record: WeightRecord) => void
  deleteWeightRecord: (id: string) => void
  addFeedingRecord: (record: FeedingRecord) => void
  deleteFeedingRecord: (id: string) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  resetAllData: () => void
}

const SatwaStoreContext = createContext<SatwaStoreContextType | null>(null)

export const SatwaStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoUser, isConfigured } = useAuth()

  const [isClient, setIsClient] = useState(false)
  const [owner, setOwnerState] = useState<OwnerProfile>(() => {
    if (isDemoUser) return INITIAL_OWNER
    if (user) {
      const stored = storage.getOwner()
      if (stored && stored.id === user.id) return stored
      return {
        ...DEFAULT_USER_PROFILE,
        id: user.id,
        name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Pemilik Hewan',
        email: user.email || '',
      }
    }
    return storage.getOwner()
  })

  const [pets, setPetsState] = useState<Pet[]>(() => {
    if (isDemoUser) return INITIAL_PETS
    if (user) {
      return storage.getPets().filter((p) => !isDemoPet(p))
    }
    return []
  })

  const [schedules, setSchedulesState] = useState<CareSchedule[]>(() => {
    if (isDemoUser) return INITIAL_SCHEDULES
    if (user) {
      return storage.getSchedules().filter((s) => !DEMO_SCHEDULE_IDS.includes(s.id))
    }
    return []
  })

  const [healthRecords, setHealthRecordsState] = useState<HealthRecord[]>(() => {
    if (isDemoUser) return INITIAL_HEALTH_RECORDS
    if (user) {
      return storage.getHealthRecords().filter((h) => !DEMO_HEALTH_IDS.includes(h.id))
    }
    return []
  })

  const [reminders, setRemindersState] = useState<Reminder[]>(() => {
    if (isDemoUser) return INITIAL_REMINDERS
    if (user) {
      return storage.getReminders().filter((r) => !DEMO_REMINDER_IDS.includes(r.id))
    }
    return []
  })

  const [weightRecords, setWeightRecordsState] = useState<WeightRecord[]>(() => {
    if (isDemoUser) return INITIAL_WEIGHT_RECORDS
    if (user) {
      return storage.getWeightRecords().filter((w) => !DEMO_WEIGHT_IDS.includes(w.id))
    }
    return []
  })

  const [feedingRecords, setFeedingRecordsState] = useState<FeedingRecord[]>(() => {
    if (isDemoUser) return INITIAL_FEEDING_RECORDS
    if (user) {
      return storage.getFeedingRecords().filter((f) => !DEMO_FEEDING_IDS.includes(f.id))
    }
    return []
  })

  const [readNotifIds, setReadNotifIdsState] = useState<string[]>([])
  const [today, setToday] = useState<string>(todayStr())

  // Realtime & Supabase sync states
  const [isRealtimeActive, setIsRealtimeActive] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  const userRef = useRef<User | null>(user)
  userRef.current = user

  const reloadFromStorage = useCallback(() => {
    if (isDemoUser) {
      setOwnerState(INITIAL_OWNER)
      setPetsState(INITIAL_PETS)
      setSchedulesState(INITIAL_SCHEDULES)
      setHealthRecordsState(INITIAL_HEALTH_RECORDS)
      setRemindersState(INITIAL_REMINDERS)
      setWeightRecordsState(INITIAL_WEIGHT_RECORDS)
      setFeedingRecordsState(INITIAL_FEEDING_RECORDS)
      return
    }

    const currentOwner = storage.getOwner()
    const currentPets = storage.getPets().filter((p) => !isDemoPet(p))
    const currentSched = storage.getSchedules().filter((s) => !DEMO_SCHEDULE_IDS.includes(s.id))
    const currentHealth = storage.getHealthRecords().filter((h) => !DEMO_HEALTH_IDS.includes(h.id))
    const currentRem = storage.getReminders().filter((r) => !DEMO_REMINDER_IDS.includes(r.id))
    const currentWeight = storage.getWeightRecords().filter((w) => !DEMO_WEIGHT_IDS.includes(w.id))
    const currentFeed = storage.getFeedingRecords().filter((f) => !DEMO_FEEDING_IDS.includes(f.id))

    setOwnerState(currentOwner)
    setPetsState(currentPets)
    setSchedulesState(currentSched)
    setHealthRecordsState(currentHealth)
    setRemindersState(currentRem)
    setWeightRecordsState(currentWeight)
    setFeedingRecordsState(currentFeed)
    setReadNotifIdsState(storage.getReadNotifIds())
    setToday(todayStr())
  }, [isDemoUser])

  // Sync from Supabase for a given user
  const syncFromSupabase = useCallback(async (activeUser: User) => {
    setSyncStatus('syncing')
    try {
      const data = await fetchAllUserData(activeUser.id)
      if (data) {
        const supabase = getSupabaseClient()

        // 1. Profile sync
        if (data.profile) {
          let cleanProfile = data.profile
          if (cleanProfile.bio?.includes('Mochi, Luna, dan Oreo')) {
            cleanProfile = { ...cleanProfile, bio: 'Penyayang hewan.' }
            if (supabase) {
              void supabase.from('profiles').update({ bio: 'Penyayang hewan.' }).eq('id', activeUser.id)
            }
          }
          setOwnerState(cleanProfile)
          storage.setOwner(cleanProfile)
        } else {
          const initialProf: OwnerProfile = {
            ...DEFAULT_USER_PROFILE,
            id: activeUser.id,
            name: (activeUser.user_metadata?.full_name as string) || activeUser.email?.split('@')[0] || 'Pemilik Hewan',
            email: activeUser.email || '',
          }
          setOwnerState(initialProf)
          storage.setOwner(initialProf)
          if (supabase) {
            void supabase.from('profiles').upsert(profileToRow(initialProf, activeUser.id))
          }
        }

        // 2. Real user data filtering (Strictly remove any demo data)
        const realPets = (data.pets || []).filter((p) => !isDemoPet(p))
        const realSchedules = (data.schedules || []).filter((s) => !DEMO_SCHEDULE_IDS.includes(s.id))
        const realHealth = (data.healthRecords || []).filter((h) => !DEMO_HEALTH_IDS.includes(h.id))
        const realReminders = (data.reminders || []).filter((r) => !DEMO_REMINDER_IDS.includes(r.id))
        const realFeeding = (data.feedingRecords || []).filter((f) => !DEMO_FEEDING_IDS.includes(f.id))
        const realWeight = (data.weightRecords || []).filter((w) => !DEMO_WEIGHT_IDS.includes(w.id))

        // 3. Purge leaked demo rows from Supabase database if they were previously seeded
        const hasLeakedDemoPets = (data.pets || []).some(isDemoPet)
        const hasLeakedDemoSched = (data.schedules || []).some((s) => DEMO_SCHEDULE_IDS.includes(s.id))
        if (supabase && (hasLeakedDemoPets || hasLeakedDemoSched)) {
          void Promise.allSettled([
            supabase.from('pets').delete().in('id', DEMO_PET_IDS).eq('user_id', activeUser.id),
            supabase.from('care_schedules').delete().in('id', DEMO_SCHEDULE_IDS).eq('user_id', activeUser.id),
            supabase.from('health_records').delete().in('id', DEMO_HEALTH_IDS).eq('user_id', activeUser.id),
            supabase.from('reminders').delete().in('id', DEMO_REMINDER_IDS).eq('user_id', activeUser.id),
            supabase.from('feeding_records').delete().in('id', DEMO_FEEDING_IDS).eq('user_id', activeUser.id),
            supabase.from('weight_records').delete().in('id', DEMO_WEIGHT_IDS).eq('user_id', activeUser.id),
          ])
        }

        // 4. Update React state & localStorage with clean data
        setPetsState(realPets)
        storage.setPets(realPets)

        setSchedulesState(realSchedules)
        storage.setSchedules(realSchedules)

        setHealthRecordsState(realHealth)
        storage.setHealthRecords(realHealth)

        setRemindersState(realReminders)
        storage.setReminders(realReminders)

        setFeedingRecordsState(realFeeding)
        storage.setFeedingRecords(realFeeding)

        setWeightRecordsState(realWeight)
        storage.setWeightRecords(realWeight)

        setSyncStatus('synced')
      } else {
        setSyncStatus('idle')
      }
    } catch (err) {
      console.error('Supabase sync error:', err)
      setSyncStatus('error')
    }
  }, [])

  // Window listeners for storage and focus
  useEffect(() => {
    setIsClient(true)

    const handleUpdate = () => {
      reloadFromStorage()
    }

    window.addEventListener('sahabatsatwa_update', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    const handleFocus = () => setToday(todayStr())
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
      window.removeEventListener('sahabatsatwa_update', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [reloadFromStorage])

  // Setup ONE central Supabase Realtime Channel
  useEffect(() => {
    if (isDemoUser) {
      setOwnerState(INITIAL_OWNER)
      setPetsState(INITIAL_PETS)
      setSchedulesState(INITIAL_SCHEDULES)
      setHealthRecordsState(INITIAL_HEALTH_RECORDS)
      setRemindersState(INITIAL_REMINDERS)
      setWeightRecordsState(INITIAL_WEIGHT_RECORDS)
      setFeedingRecordsState(INITIAL_FEEDING_RECORDS)
      setIsRealtimeActive(false)
      setSyncStatus('idle')
      return
    }

    if (!user || !isConfigured) {
      setIsRealtimeActive(false)
      setSyncStatus('idle')
      return
    }

    const supabase = getSupabaseClient()
    if (!supabase) return

    // Immediately trigger initial sync
    syncFromSupabase(user)

    // Setup channel for authenticated user
    const channelName = `satwa-realtime-user-${user.id}`
    const channel = supabase
      .channel(channelName)
      // PETS Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pets', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPet = rowToPet(payload.new)
            if (!isDemoPet(newPet)) {
              setPetsState((prev) => {
                const next = [newPet, ...prev.filter((p) => p.id !== newPet.id)]
                storage.setPets(next)
                return next
              })
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = rowToPet(payload.new)
            setPetsState((prev) => {
              const next = prev.map((p) => (p.id === updated.id ? updated : p))
              storage.setPets(next)
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            setPetsState((prev) => {
              const next = prev.filter((p) => p.id !== payload.old.id)
              storage.setPets(next)
              return next
            })
          }
        }
      )
      // CARE SCHEDULES Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'care_schedules', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newSched = rowToSchedule(payload.new)
            setSchedulesState((prev) => {
              const next = [newSched, ...prev.filter((s) => s.id !== newSched.id)]
              storage.setSchedules(next)
              return next
            })
          } else if (payload.eventType === 'UPDATE') {
            const updated = rowToSchedule(payload.new)
            setSchedulesState((prev) => {
              const next = prev.map((s) => (s.id === updated.id ? updated : s))
              storage.setSchedules(next)
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            setSchedulesState((prev) => {
              const next = prev.filter((s) => s.id !== payload.old.id)
              storage.setSchedules(next)
              return next
            })
          }
        }
      )
      // HEALTH RECORDS Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'health_records', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRec = rowToHealth(payload.new)
            setHealthRecordsState((prev) => {
              const next = [newRec, ...prev.filter((h) => h.id !== newRec.id)]
              storage.setHealthRecords(next)
              return next
            })
          } else if (payload.eventType === 'UPDATE') {
            const updated = rowToHealth(payload.new)
            setHealthRecordsState((prev) => {
              const next = prev.map((h) => (h.id === updated.id ? updated : h))
              storage.setHealthRecords(next)
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            setHealthRecordsState((prev) => {
              const next = prev.filter((h) => h.id !== payload.old.id)
              storage.setHealthRecords(next)
              return next
            })
          }
        }
      )
      // REMINDERS Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reminders', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRem = rowToReminder(payload.new)
            setRemindersState((prev) => {
              const next = [newRem, ...prev.filter((r) => r.id !== newRem.id)]
              storage.setReminders(next)
              return next
            })
          } else if (payload.eventType === 'UPDATE') {
            const updated = rowToReminder(payload.new)
            setRemindersState((prev) => {
              const next = prev.map((r) => (r.id === updated.id ? updated : r))
              storage.setReminders(next)
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            setRemindersState((prev) => {
              const next = prev.filter((r) => r.id !== payload.old.id)
              storage.setReminders(next)
              return next
            })
          }
        }
      )
      // FEEDING RECORDS Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feeding_records', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newFeed = rowToFeeding(payload.new)
            setFeedingRecordsState((prev) => {
              const next = [newFeed, ...prev.filter((f) => f.id !== newFeed.id)]
              storage.setFeedingRecords(next)
              return next
            })
          } else if (payload.eventType === 'UPDATE') {
            const updated = rowToFeeding(payload.new)
            setFeedingRecordsState((prev) => {
              const next = prev.map((f) => (f.id === updated.id ? updated : f))
              storage.setFeedingRecords(next)
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            setFeedingRecordsState((prev) => {
              const next = prev.filter((f) => f.id !== payload.old.id)
              storage.setFeedingRecords(next)
              return next
            })
          }
        }
      )
      // WEIGHT RECORDS Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'weight_records', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newWeight = rowToWeight(payload.new)
            setWeightRecordsState((prev) => {
              const next = [newWeight, ...prev.filter((w) => w.id !== newWeight.id)]
              storage.setWeightRecords(next)
              return next
            })
          } else if (payload.eventType === 'UPDATE') {
            const updated = rowToWeight(payload.new)
            setWeightRecordsState((prev) => {
              const next = prev.map((w) => (w.id === updated.id ? updated : w))
              storage.setWeightRecords(next)
              return next
            })
          } else if (payload.eventType === 'DELETE') {
            setWeightRecordsState((prev) => {
              const next = prev.filter((w) => w.id !== payload.old.id)
              storage.setWeightRecords(next)
              return next
            })
          }
        }
      )
      // PROFILES Realtime
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const prof = rowToProfile(payload.new, user.email)
            setOwnerState(prof)
            storage.setOwner(prof)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeActive(true)
          setSyncStatus('synced')
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsRealtimeActive(false)
        }
      })

    return () => {
      supabase.removeChannel(channel)
      setIsRealtimeActive(false)
    }
  }, [user, isDemoUser, isConfigured, syncFromSupabase])

  // ========================================================
  // MUTATION HELPERS (Optimistic local + Supabase Realtime)
  // ========================================================

  const execCloud = (query: PromiseLike<any>) => {
    void Promise.resolve(query).catch((err) => {
      console.warn('Supabase sync error:', err)
    })
  }

  const saveOwner = (newOwner: OwnerProfile) => {
    storage.setOwner(newOwner)
    setOwnerState(newOwner)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('profiles').upsert(profileToRow(newOwner, u.id)))
    }
  }

  const addPet = (pet: Pet) => {
    const updated = [pet, ...pets.filter((p) => p.id !== pet.id)]
    storage.setPets(updated)
    setPetsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('pets').upsert(petToRow(pet, u.id)))
    }

    // Automatically add initial weight record if provided
    if (pet.currentWeight > 0) {
      const weightRec: WeightRecord = {
        id: 'w-' + Date.now(),
        petId: pet.id,
        date: todayStr(),
        weight: pet.currentWeight,
        notes: 'Berat awal saat didaftarkan',
        createdAt: new Date().toISOString(),
      }
      const updatedWeight = [...weightRecords, weightRec]
      storage.setWeightRecords(updatedWeight)
      setWeightRecordsState(updatedWeight)
      if (u && !isDemoUser && supabase && isConfigured) {
        execCloud(supabase.from('weight_records').upsert(weightToRow(weightRec, u.id)))
      }
    }
  }

  const updatePet = (updatedPet: Pet) => {
    const updated = pets.map((p) => (p.id === updatedPet.id ? updatedPet : p))
    storage.setPets(updated)
    setPetsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('pets').upsert(petToRow(updatedPet, u.id)))
    }
  }

  const deletePet = (petId: string) => {
    const updated = pets.filter((p) => p.id !== petId)
    storage.setPets(updated)
    setPetsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('pets').delete().eq('id', petId).eq('user_id', u.id))
      execCloud(supabase.from('care_schedules').delete().eq('pet_id', petId).eq('user_id', u.id))
      execCloud(supabase.from('health_records').delete().eq('pet_id', petId).eq('user_id', u.id))
      execCloud(supabase.from('reminders').delete().eq('pet_id', petId).eq('user_id', u.id))
      execCloud(supabase.from('weight_records').delete().eq('pet_id', petId).eq('user_id', u.id))
      execCloud(supabase.from('feeding_records').delete().eq('pet_id', petId).eq('user_id', u.id))
    }

    // Cascade delete related records locally
    const updatedSched = schedules.filter((s) => s.petId !== petId)
    storage.setSchedules(updatedSched)
    setSchedulesState(updatedSched)

    const updatedHealth = healthRecords.filter((h) => h.petId !== petId)
    storage.setHealthRecords(updatedHealth)
    setHealthRecordsState(updatedHealth)

    const updatedRem = reminders.filter((r) => r.petId !== petId)
    storage.setReminders(updatedRem)
    setRemindersState(updatedRem)

    const updatedWeight = weightRecords.filter((w) => w.petId !== petId)
    storage.setWeightRecords(updatedWeight)
    setWeightRecordsState(updatedWeight)

    const updatedFeed = feedingRecords.filter((f) => f.petId !== petId)
    storage.setFeedingRecords(updatedFeed)
    setFeedingRecordsState(updatedFeed)
  }

  const addSchedule = (schedule: CareSchedule) => {
    const updated = [schedule, ...schedules]
    storage.setSchedules(updated)
    setSchedulesState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('care_schedules').upsert(scheduleToRow(schedule, u.id)))
    }
  }

  const updateSchedule = (updatedSchedule: CareSchedule) => {
    const updated = schedules.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
    storage.setSchedules(updated)
    setSchedulesState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('care_schedules').upsert(scheduleToRow(updatedSchedule, u.id)))
    }
  }

  const toggleScheduleComplete = (scheduleId: string): CareSchedule | null => {
    const target = schedules.find((s) => s.id === scheduleId)
    if (!target) return null
    const completing = target.status !== 'Selesai'

    const todayDate = todayStr()
    let updated = schedules.map((s) =>
      s.id === scheduleId
        ? {
            ...s,
            status: completing
              ? ('Selesai' as const)
              : effectiveScheduleStatus({ ...s, status: 'Akan Datang' }, todayDate),
          }
        : s
    )

    let created: CareSchedule | null = null
    if (completing) {
      const nextDate = nextOccurrence(target)
      const exists =
        nextDate &&
        schedules.some(
          (s) => s.petId === target.petId && s.title === target.title && s.date === nextDate
        )
      if (nextDate && !exists) {
        created = {
          ...target,
          id: 'sched-' + Date.now(),
          date: nextDate,
          status: 'Akan Datang',
          createdAt: new Date().toISOString(),
        }
        updated = [created, ...updated]
      }
    }

    storage.setSchedules(updated)
    setSchedulesState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      const modified = updated.find((s) => s.id === scheduleId)
      if (modified) {
        execCloud(supabase.from('care_schedules').upsert(scheduleToRow(modified, u.id)))
      }
      if (created) {
        execCloud(supabase.from('care_schedules').upsert(scheduleToRow(created, u.id)))
      }
    }

    return created
  }

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter((s) => s.id !== id)
    storage.setSchedules(updated)
    setSchedulesState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('care_schedules').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const addHealthRecord = (record: HealthRecord) => {
    const updated = [record, ...healthRecords]
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('health_records').upsert(healthToRow(record, u.id)))
    }
  }

  const updateHealthRecord = (updatedRecord: HealthRecord) => {
    const updated = healthRecords.map((h) => (h.id === updatedRecord.id ? updatedRecord : h))
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('health_records').upsert(healthToRow(updatedRecord, u.id)))
    }
  }

  const deleteHealthRecord = (id: string) => {
    const updated = healthRecords.filter((h) => h.id !== id)
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('health_records').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const addReminder = (reminder: Reminder) => {
    const updated = [reminder, ...reminders]
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('reminders').upsert(reminderToRow(reminder, u.id)))
    }
  }

  const updateReminder = (updatedReminder: Reminder) => {
    const updated = reminders.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('reminders').upsert(reminderToRow(updatedReminder, u.id)))
    }
  }

  const toggleReminderComplete = (reminderId: string) => {
    let modifiedTarget: Reminder | null = null
    const todayDate = todayStr()
    const updated = reminders.map((r) => {
      if (r.id === reminderId) {
        const nextCompleted = !r.isCompleted
        const mod: Reminder = {
          ...r,
          isCompleted: nextCompleted,
          status: nextCompleted
            ? ('Selesai' as const)
            : effectiveReminderStatus({ ...r, isCompleted: false }, todayDate),
        }
        modifiedTarget = mod
        return mod
      }
      return r
    })
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured && modifiedTarget) {
      execCloud(supabase.from('reminders').upsert(reminderToRow(modifiedTarget, u.id)))
    }
  }

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id)
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('reminders').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const addWeightRecord = (record: WeightRecord) => {
    const updated = [...weightRecords, record].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    storage.setWeightRecords(updated)
    setWeightRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('weight_records').upsert(weightToRow(record, u.id)))
    }

    // Update pet current weight
    const targetPet = pets.find((p) => p.id === record.petId)
    if (targetPet) {
      updatePet({
        ...targetPet,
        currentWeight: record.weight,
      })
    }
  }

  const deleteWeightRecord = (id: string) => {
    const target = weightRecords.find((w) => w.id === id)
    const updated = weightRecords.filter((w) => w.id !== id)
    storage.setWeightRecords(updated)
    setWeightRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('weight_records').delete().eq('id', id).eq('user_id', u.id))
    }

    if (target) {
      const pet = pets.find((p) => p.id === target.petId)
      if (pet) {
        const remaining = updated
          .filter((w) => w.petId === pet.id)
          .sort((a, b) => a.date.localeCompare(b.date))
        const latest = remaining[remaining.length - 1]
        updatePet({ ...pet, currentWeight: latest ? latest.weight : pet.initialWeight })
      }
    }
  }

  const addFeedingRecord = (record: FeedingRecord) => {
    const updated = [record, ...feedingRecords]
    storage.setFeedingRecords(updated)
    setFeedingRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('feeding_records').upsert(feedingToRow(record, u.id)))
    }
  }

  const deleteFeedingRecord = (id: string) => {
    const updated = feedingRecords.filter((f) => f.id !== id)
    storage.setFeedingRecords(updated)
    setFeedingRecordsState(updated)

    const u = userRef.current
    const supabase = getSupabaseClient()
    if (u && !isDemoUser && supabase && isConfigured) {
      execCloud(supabase.from('feeding_records').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const markNotificationAsRead = (id: string) => {
    if (readNotifIds.includes(id)) return
    const updated = [...readNotifIds, id]
    storage.setReadNotifIds(updated)
    setReadNotifIdsState(updated)
  }

  const markAllNotificationsAsRead = () => {
    const updated = Array.from(new Set([...readNotifIds, ...notifications.map((n) => n.id)]))
    storage.setReadNotifIds(updated)
    setReadNotifIdsState(updated)
  }

  // Backup / Restore
  const exportData = (): BackupFile => ({
    app: 'sahabatsatwa',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { owner, pets, schedules, healthRecords, reminders, weightRecords, feedingRecords },
  })

  const importData = (raw: unknown): { ok: true } | { ok: false; error: string } => {
    try {
      const file = raw as BackupFile
      if (!file || file.app !== 'sahabatsatwa' || !file.data) {
        return { ok: false, error: 'File bukan backup SahabatSatwa yang valid.' }
      }
      const d = file.data
      const arrays = [d.pets, d.schedules, d.healthRecords, d.reminders, d.weightRecords, d.feedingRecords]
      if (!d.owner || arrays.some((a) => !Array.isArray(a))) {
        return { ok: false, error: 'Struktur data backup tidak lengkap.' }
      }
      storage.setOwner(d.owner)
      storage.setPets(d.pets)
      storage.setSchedules(d.schedules)
      storage.setHealthRecords(d.healthRecords)
      storage.setReminders(d.reminders)
      storage.setWeightRecords(d.weightRecords)
      storage.setFeedingRecords(d.feedingRecords)
      reloadFromStorage()
      return { ok: true }
    } catch {
      return { ok: false, error: 'Gagal membaca file backup.' }
    }
  }

  const resetAllData = () => {
    storage.resetToDefaults()
    reloadFromStorage()
  }

  const syncWithSupabase = async () => {
    const u = userRef.current
    if (u && !isDemoUser) {
      await syncFromSupabase(u)
    }
  }

  // Status jadwal & pengingat
  const derivedSchedules = useMemo(
    () => schedules.map((s) => ({ ...s, status: effectiveScheduleStatus(s, today) })),
    [schedules, today]
  )
  const derivedReminders = useMemo(
    () => reminders.map((r) => ({ ...r, status: effectiveReminderStatus(r, today) })),
    [reminders, today]
  )

  // Notifikasi dinamis
  const notifications: AppNotification[] = useMemo(() => {
    const list: AppNotification[] = []
    const petName = (id: string) => pets.find((p) => p.id === id)?.name ?? 'Hewan'

    for (const r of derivedReminders) {
      if (r.isCompleted) continue
      const diff = daysBetween(today, r.date)
      if (diff > 2) continue
      const id = `auto-rem-${r.id}-${r.date}`
      list.push({
        id,
        title: diff < 0 ? `Terlambat: ${r.title}` : `Pengingat: ${r.title}`,
        message: `${petName(r.petId)} · ${r.dosageOrInstruction} (${relativeLabel(r.date)}, ${r.time})`,
        date: relativeLabel(r.date),
        read: readNotifIds.includes(id),
        link: '/pengingat',
        type: 'reminder',
      })
    }
    for (const s of derivedSchedules) {
      if (s.status === 'Selesai') continue
      const diff = daysBetween(today, s.date)
      if (diff > 2) continue
      const id = `auto-sch-${s.id}-${s.date}`
      list.push({
        id,
        title: s.status === 'Terlewat' ? `Terlewat: ${s.title}` : s.title,
        message: `${petName(s.petId)} · ${s.category} (${relativeLabel(s.date)}, ${s.time})`,
        date: relativeLabel(s.date),
        read: readNotifIds.includes(id),
        link: '/jadwal',
        type: 'schedule',
      })
    }
    return list
  }, [derivedReminders, derivedSchedules, pets, readNotifIds, today])

  const contextValue: SatwaStoreContextType = {
    isClient,
    today,
    owner,
    pets,
    schedules: derivedSchedules,
    healthRecords,
    reminders: derivedReminders,
    weightRecords,
    feedingRecords,
    notifications,
    isRealtimeActive,
    syncStatus,
    currentUser: user,
    syncWithSupabase,
    exportData,
    importData,
    saveOwner,
    addPet,
    updatePet,
    deletePet,
    addSchedule,
    updateSchedule,
    toggleScheduleComplete,
    deleteSchedule,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addReminder,
    updateReminder,
    toggleReminderComplete,
    deleteReminder,
    addWeightRecord,
    deleteWeightRecord,
    addFeedingRecord,
    deleteFeedingRecord,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetAllData,
  }

  return React.createElement(SatwaStoreContext.Provider, { value: contextValue }, children)
}

export function useSatwaStore(): SatwaStoreContextType {
  const ctx = useContext(SatwaStoreContext)
  if (!ctx) {
    throw new Error('useSatwaStore must be used within a SatwaStoreProvider')
  }
  return ctx
}
