import { useState, useEffect, useCallback } from 'react'
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

const KEYS = {
  OWNER: 'sahabatsatwa_owner_v1',
  PETS: 'sahabatsatwa_pets_v1',
  SCHEDULES: 'sahabatsatwa_schedules_v1',
  HEALTH: 'sahabatsatwa_health_v1',
  REMINDERS: 'sahabatsatwa_reminders_v1',
  WEIGHT: 'sahabatsatwa_weight_v1',
  FEEDING: 'sahabatsatwa_feeding_v1',
  NOTIFICATIONS: 'sahabatsatwa_notifications_v1',
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
    window.dispatchEvent(new CustomEvent('sahabatsatwa_update', { detail: { key: 'all' } }))
  },
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
  const [notifications, setNotificationsState] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS)

  const reloadAll = useCallback(() => {
    setOwnerState(storage.getOwner())
    setPetsState(storage.getPets())
    setSchedulesState(storage.getSchedules())
    setHealthRecordsState(storage.getHealthRecords())
    setRemindersState(storage.getReminders())
    setWeightRecordsState(storage.getWeightRecords())
    setFeedingRecordsState(storage.getFeedingRecords())
    setNotificationsState(storage.getNotifications())
  }, [])

  useEffect(() => {
    setIsClient(true)
    reloadAll()

    const handleUpdate = () => {
      reloadAll()
    }

    window.addEventListener('sahabatsatwa_update', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('sahabatsatwa_update', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [reloadAll])

  // Mutation helpers
  const saveOwner = (newOwner: OwnerProfile) => {
    storage.setOwner(newOwner)
    setOwnerState(newOwner)
  }

  const addPet = (pet: Pet) => {
    const updated = [pet, ...pets]
    storage.setPets(updated)
    setPetsState(updated)

    // Automatically add initial weight record if provided
    if (pet.currentWeight > 0) {
      const weightRec: WeightRecord = {
        id: 'w-' + Date.now(),
        petId: pet.id,
        date: new Date().toISOString().split('T')[0],
        weight: pet.currentWeight,
        notes: 'Berat awal saat didaftarkan',
        createdAt: new Date().toISOString(),
      }
      const updatedWeight = [...weightRecords, weightRec]
      storage.setWeightRecords(updatedWeight)
      setWeightRecordsState(updatedWeight)
    }
  }

  const updatePet = (updatedPet: Pet) => {
    const updated = pets.map((p) => (p.id === updatedPet.id ? updatedPet : p))
    storage.setPets(updated)
    setPetsState(updated)
  }

  const deletePet = (petId: string) => {
    const updated = pets.filter((p) => p.id !== petId)
    storage.setPets(updated)
    setPetsState(updated)

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
  }

  const updateSchedule = (updatedSchedule: CareSchedule) => {
    const updated = schedules.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
    storage.setSchedules(updated)
    setSchedulesState(updated)
  }

  const toggleScheduleComplete = (scheduleId: string) => {
    const updated = schedules.map((s) => {
      if (s.id === scheduleId) {
        return {
          ...s,
          status: s.status === 'Selesai' ? ('Akan Datang' as const) : ('Selesai' as const),
        }
      }
      return s
    })
    storage.setSchedules(updated)
    setSchedulesState(updated)
  }

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter((s) => s.id !== id)
    storage.setSchedules(updated)
    setSchedulesState(updated)
  }

  const addHealthRecord = (record: HealthRecord) => {
    const updated = [record, ...healthRecords]
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)
  }

  const updateHealthRecord = (updatedRecord: HealthRecord) => {
    const updated = healthRecords.map((h) => (h.id === updatedRecord.id ? updatedRecord : h))
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)
  }

  const deleteHealthRecord = (id: string) => {
    const updated = healthRecords.filter((h) => h.id !== id)
    storage.setHealthRecords(updated)
    setHealthRecordsState(updated)
  }

  const addReminder = (reminder: Reminder) => {
    const updated = [reminder, ...reminders]
    storage.setReminders(updated)
    setRemindersState(updated)
  }

  const updateReminder = (updatedReminder: Reminder) => {
    const updated = reminders.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    storage.setReminders(updated)
    setRemindersState(updated)
  }

  const toggleReminderComplete = (reminderId: string) => {
    const updated = reminders.map((r) => {
      if (r.id === reminderId) {
        const nextCompleted = !r.isCompleted
        return {
          ...r,
          isCompleted: nextCompleted,
          status: nextCompleted ? ('Selesai' as const) : ('Hari Ini' as const),
        }
      }
      return r
    })
    storage.setReminders(updated)
    setRemindersState(updated)
  }

  const deleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id)
    storage.setReminders(updated)
    setRemindersState(updated)
  }

  const addWeightRecord = (record: WeightRecord) => {
    const updated = [...weightRecords, record].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    storage.setWeightRecords(updated)
    setWeightRecordsState(updated)

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
    const updated = weightRecords.filter((w) => w.id !== id)
    storage.setWeightRecords(updated)
    setWeightRecordsState(updated)
  }

  const addFeedingRecord = (record: FeedingRecord) => {
    const updated = [record, ...feedingRecords]
    storage.setFeedingRecords(updated)
    setFeedingRecordsState(updated)
  }

  const deleteFeedingRecord = (id: string) => {
    const updated = feedingRecords.filter((f) => f.id !== id)
    storage.setFeedingRecords(updated)
    setFeedingRecordsState(updated)
  }

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    storage.setNotifications(updated)
    setNotificationsState(updated)
  }

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    storage.setNotifications(updated)
    setNotificationsState(updated)
  }

  const resetAllData = () => {
    storage.resetToDefaults()
    reloadAll()
  }

  return {
    isClient,
    owner,
    pets,
    schedules,
    healthRecords,
    reminders,
    weightRecords,
    feedingRecords,
    notifications,
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
