import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
  getOwner: () => safeGet<OwnerProfile>(KEYS.OWNER, INITIAL_OWNER),
  setOwner: (owner: OwnerProfile) => safeSet(KEYS.OWNER, owner),

  getPets: () => safeGet<Pet[]>(KEYS.PETS, INITIAL_PETS),
  setPets: (pets: Pet[]) => safeSet(KEYS.PETS, pets),

  getSchedules: () => safeGet<CareSchedule[]>(KEYS.SCHEDULES, INITIAL_SCHEDULES),
  setSchedules: (schedules: CareSchedule[]) => safeSet(KEYS.SCHEDULES, schedules),

  getHealthRecords: () => safeGet<HealthRecord[]>(KEYS.HEALTH, INITIAL_HEALTH_RECORDS),
  setHealthRecords: (records: HealthRecord[]) => safeSet(KEYS.HEALTH, records),

  getReminders: () => safeGet<Reminder[]>(KEYS.REMINDERS, INITIAL_REMINDERS),
  setReminders: (reminders: Reminder[]) => safeSet(KEYS.REMINDERS, reminders),

  getWeightRecords: () => safeGet<WeightRecord[]>(KEYS.WEIGHT, INITIAL_WEIGHT_RECORDS),
  setWeightRecords: (records: WeightRecord[]) => safeSet(KEYS.WEIGHT, records),

  getFeedingRecords: () => safeGet<FeedingRecord[]>(KEYS.FEEDING, INITIAL_FEEDING_RECORDS),
  setFeedingRecords: (records: FeedingRecord[]) => safeSet(KEYS.FEEDING, records),

  getNotifications: () => safeGet<AppNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
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

export function useSatwaStore() {
  const [isClient, setIsClient] = useState(false)
  const [owner, setOwnerState] = useState<OwnerProfile>(INITIAL_OWNER)
  const [pets, setPetsState] = useState<Pet[]>(INITIAL_PETS)
  const [schedules, setSchedulesState] = useState<CareSchedule[]>(INITIAL_SCHEDULES)
  const [healthRecords, setHealthRecordsState] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS)
  const [reminders, setRemindersState] = useState<Reminder[]>(INITIAL_REMINDERS)
  const [weightRecords, setWeightRecordsState] = useState<WeightRecord[]>(INITIAL_WEIGHT_RECORDS)
  const [feedingRecords, setFeedingRecordsState] = useState<FeedingRecord[]>(INITIAL_FEEDING_RECORDS)
  const [, setNotificationsState] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)
  const [readNotifIds, setReadNotifIdsState] = useState<string[]>([])
  const [today, setToday] = useState<string>(todayStr())

  // Realtime & Supabase sync states
  const [isRealtimeActive, setIsRealtimeActive] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const currentUserRef = useRef<User | null>(null)

  const reloadAll = useCallback(() => {
    setOwnerState(storage.getOwner())
    setPetsState(storage.getPets())
    setSchedulesState(storage.getSchedules())
    setHealthRecordsState(storage.getHealthRecords())
    setRemindersState(storage.getReminders())
    setWeightRecordsState(storage.getWeightRecords())
    setFeedingRecordsState(storage.getFeedingRecords())
    setNotificationsState(storage.getNotifications())
    setReadNotifIdsState(storage.getReadNotifIds())
    setToday(todayStr())
  }, [])

  // Sync from Supabase for a given user
  const syncFromSupabase = useCallback(async (user: User) => {
    setSyncStatus('syncing')
    try {
      const data = await fetchAllUserData(user.id)
      if (data) {
        if (data.profile) {
          setOwnerState(data.profile)
          storage.setOwner(data.profile)
        }

        // If user already has pets in Supabase, load them
        if (data.pets.length > 0) {
          setPetsState(data.pets)
          storage.setPets(data.pets)

          setSchedulesState(data.schedules)
          storage.setSchedules(data.schedules)

          setHealthRecordsState(data.healthRecords)
          storage.setHealthRecords(data.healthRecords)

          setRemindersState(data.reminders)
          storage.setReminders(data.reminders)

          setFeedingRecordsState(data.feedingRecords)
          storage.setFeedingRecords(data.feedingRecords)

          setWeightRecordsState(data.weightRecords)
          storage.setWeightRecords(data.weightRecords)
        } else {
          // Brand new user: offer initial sample data
          // Seed local data to Supabase so they have a great initial experience
          const supabase = getSupabaseClient()
          if (supabase) {
            try {
              const seedPets = INITIAL_PETS.map((p) => petToRow(p, user.id))
              const seedSchedules = INITIAL_SCHEDULES.map((s) => scheduleToRow(s, user.id))
              const seedHealth = INITIAL_HEALTH_RECORDS.map((h) => healthToRow(h, user.id))
              const seedRem = INITIAL_REMINDERS.map((r) => reminderToRow(r, user.id))
              const seedFeed = INITIAL_FEEDING_RECORDS.map((f) => feedingToRow(f, user.id))
              const seedWeight = INITIAL_WEIGHT_RECORDS.map((w) => weightToRow(w, user.id))

              await Promise.allSettled([
                supabase.from('pets').insert(seedPets),
                supabase.from('care_schedules').insert(seedSchedules),
                supabase.from('health_records').insert(seedHealth),
                supabase.from('reminders').insert(seedRem),
                supabase.from('feeding_records').insert(seedFeed),
                supabase.from('weight_records').insert(seedWeight),
              ])
            } catch (err) {
              console.warn('Initial seeding skipped:', err)
            }
          }
        }
        setSyncStatus('synced')
      } else {
        setSyncStatus('idle')
      }
    } catch (err) {
      console.error('Supabase sync error:', err)
      setSyncStatus('error')
    }
  }, [])

  // Initial load & listeners
  useEffect(() => {
    setIsClient(true)
    reloadAll()

    const handleUpdate = () => {
      reloadAll()
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
  }, [reloadAll])

  // Setup Supabase Realtime Channel & Auth Observer
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsRealtimeActive(false)
      return
    }

    const supabase = getSupabaseClient()
    if (!supabase) return

    let channel: any = null

    // Check session
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user || null
      setCurrentUser(u)
      currentUserRef.current = u
      if (u) {
        syncFromSupabase(u)
        setupRealtime(u)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null
      setCurrentUser(u)
      currentUserRef.current = u
      if (u) {
        syncFromSupabase(u)
        setupRealtime(u)
      } else {
        if (channel) {
          supabase.removeChannel(channel)
          channel = null
        }
        setIsRealtimeActive(false)
        reloadAll()
      }
    })

    function setupRealtime(user: User) {
      if (!supabase) return
      if (channel) {
        supabase.removeChannel(channel)
      }

      channel = supabase
        .channel(`satwa-realtime-channel-${user.id}`)
        // PETS Realtime
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'pets', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newPet = rowToPet(payload.new)
              setPetsState((prev) => [newPet, ...prev.filter((p) => p.id !== newPet.id)])
            } else if (payload.eventType === 'UPDATE') {
              const updated = rowToPet(payload.new)
              setPetsState((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            } else if (payload.eventType === 'DELETE') {
              setPetsState((prev) => prev.filter((p) => p.id !== payload.old.id))
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
              setSchedulesState((prev) => [newSched, ...prev.filter((s) => s.id !== newSched.id)])
            } else if (payload.eventType === 'UPDATE') {
              const updated = rowToSchedule(payload.new)
              setSchedulesState((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
            } else if (payload.eventType === 'DELETE') {
              setSchedulesState((prev) => prev.filter((s) => s.id !== payload.old.id))
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
              setHealthRecordsState((prev) => [newRec, ...prev.filter((h) => h.id !== newRec.id)])
            } else if (payload.eventType === 'UPDATE') {
              const updated = rowToHealth(payload.new)
              setHealthRecordsState((prev) => prev.map((h) => (h.id === updated.id ? updated : h)))
            } else if (payload.eventType === 'DELETE') {
              setHealthRecordsState((prev) => prev.filter((h) => h.id !== payload.old.id))
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
              setRemindersState((prev) => [newRem, ...prev.filter((r) => r.id !== newRem.id)])
            } else if (payload.eventType === 'UPDATE') {
              const updated = rowToReminder(payload.new)
              setRemindersState((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
            } else if (payload.eventType === 'DELETE') {
              setRemindersState((prev) => prev.filter((r) => r.id !== payload.old.id))
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
              setFeedingRecordsState((prev) => [newFeed, ...prev.filter((f) => f.id !== newFeed.id)])
            } else if (payload.eventType === 'UPDATE') {
              const updated = rowToFeeding(payload.new)
              setFeedingRecordsState((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
            } else if (payload.eventType === 'DELETE') {
              setFeedingRecordsState((prev) => prev.filter((f) => f.id !== payload.old.id))
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
              setWeightRecordsState((prev) => [newWeight, ...prev.filter((w) => w.id !== newWeight.id)])
            } else if (payload.eventType === 'UPDATE') {
              const updated = rowToWeight(payload.new)
              setWeightRecordsState((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
            } else if (payload.eventType === 'DELETE') {
              setWeightRecordsState((prev) => prev.filter((w) => w.id !== payload.old.id))
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
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsRealtimeActive(false)
          }
        })
    }

    return () => {
      subscription.unsubscribe()
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [syncFromSupabase, reloadAll])

  // ========================================================
  // MUTATION HELPERS (Optimistic local + Supabase online)
  // ========================================================

  const execCloud = (query: PromiseLike<any>) => {
    void Promise.resolve(query).catch((err) => {
      console.warn('Supabase sync error:', err)
    })
  }

  const saveOwner = (newOwner: OwnerProfile) => {
    storage.setOwner(newOwner)
    setOwnerState(newOwner)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('profiles').upsert(profileToRow(newOwner, u.id)))
    }
  }

  const addPet = (pet: Pet) => {
    const updated = [pet, ...pets]
    storage.setPets(updated)
    setPetsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
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
      if (u && supabase) {
        execCloud(supabase.from('weight_records').upsert(weightToRow(weightRec, u.id)))
      }
    }
  }

  const updatePet = (updatedPet: Pet) => {
    const updated = pets.map((p) => (p.id === updatedPet.id ? updatedPet : p))
    storage.setPets(updated)
    setPetsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('pets').upsert(petToRow(updatedPet, u.id)))
    }
  }

  const deletePet = (petId: string) => {
    const updated = pets.filter((p) => p.id !== petId)
    storage.setPets(updated)
    setPetsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('pets').delete().eq('id', petId).eq('user_id', u.id))
    }

    // Cascade delete related records
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

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('care_schedules').upsert(scheduleToRow(schedule, u.id)))
    }
  }

  const updateSchedule = (updatedSchedule: CareSchedule) => {
    const updated = schedules.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
    storage.setSchedules(updated)
    setSchedulesState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('care_schedules').upsert(scheduleToRow(updatedSchedule, u.id)))
    }
  }

  /** Mengembalikan jadwal berikutnya bila jadwal berulang baru saja diselesaikan. */
  const toggleScheduleComplete = (scheduleId: string): CareSchedule | null => {
    const target = schedules.find((s) => s.id === scheduleId)
    if (!target) return null
    const completing = target.status !== 'Selesai'

    let updated = schedules.map((s) =>
      s.id === scheduleId
        ? { ...s, status: completing ? ('Selesai' as const) : ('Akan Datang' as const) }
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

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
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

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('care_schedules').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const addHealthRecord = (record: HealthRecord) => {
    const updated = [record, ...healthRecords]
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('health_records').upsert(healthToRow(record, u.id)))
    }
  }

  const updateHealthRecord = (updatedRecord: HealthRecord) => {
    const updated = healthRecords.map((h) => (h.id === updatedRecord.id ? updatedRecord : h))
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('health_records').upsert(healthToRow(updatedRecord, u.id)))
    }
  }

  const deleteHealthRecord = (id: string) => {
    const updated = healthRecords.filter((h) => h.id !== id)
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('health_records').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const addReminder = (reminder: Reminder) => {
    const updated = [reminder, ...reminders]
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('reminders').upsert(reminderToRow(reminder, u.id)))
    }
  }

  const updateReminder = (updatedReminder: Reminder) => {
    const updated = reminders.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('reminders').upsert(reminderToRow(updatedReminder, u.id)))
    }
  }

  const toggleReminderComplete = (reminderId: string) => {
    let modifiedTarget: Reminder | null = null
    const updated = reminders.map((r) => {
      if (r.id === reminderId) {
        const nextCompleted = !r.isCompleted
        const mod: Reminder = {
          ...r,
          isCompleted: nextCompleted,
          status: nextCompleted ? ('Selesai' as const) : ('Hari Ini' as const),
        }
        modifiedTarget = mod
        return mod
      }
      return r
    })
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase && modifiedTarget) {
      execCloud(supabase.from('reminders').upsert(reminderToRow(modifiedTarget, u.id)))
    }
  }

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id)
    storage.setReminders(updated)
    setRemindersState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('reminders').delete().eq('id', id).eq('user_id', u.id))
    }
  }

  const addWeightRecord = (record: WeightRecord) => {
    const updated = [...weightRecords, record].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    storage.setWeightRecords(updated)
    setWeightRecordsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
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

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('weight_records').delete().eq('id', id).eq('user_id', u.id))
    }

    // Sinkronkan berat terkini hewan dengan catatan terbaru yang tersisa
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

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
      execCloud(supabase.from('feeding_records').upsert(feedingToRow(record, u.id)))
    }
  }

  const deleteFeedingRecord = (id: string) => {
    const updated = feedingRecords.filter((f) => f.id !== id)
    storage.setFeedingRecords(updated)
    setFeedingRecordsState(updated)

    const u = currentUserRef.current
    const supabase = getSupabaseClient()
    if (u && supabase) {
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

  // ---- Backup / restore ----
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
      reloadAll()
      return { ok: true }
    } catch {
      return { ok: false, error: 'Gagal membaca file backup.' }
    }
  }

  const resetAllData = () => {
    storage.resetToDefaults()
    reloadAll()
  }

  // Manual trigger sync with Supabase
  const syncWithSupabase = async () => {
    const u = currentUserRef.current
    if (u) {
      await syncFromSupabase(u)
    }
  }

  // Status jadwal & pengingat selalu dihitung ulang dari tanggal hari ini
  const derivedSchedules = useMemo(
    () => schedules.map((s) => ({ ...s, status: effectiveScheduleStatus(s, today) })),
    [schedules, today]
  )
  const derivedReminders = useMemo(
    () => reminders.map((r) => ({ ...r, status: effectiveReminderStatus(r, today) })),
    [reminders, today]
  )

  // Notifikasi dibangkitkan dari data nyata (bukan teks statis)
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

  return {
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
    currentUser,
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
}
