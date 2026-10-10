import {
  Pet,
  CareSchedule,
  HealthRecord,
  Reminder,
  FeedingRecord,
  WeightRecord,
  OwnerProfile,
} from '../types'
import { getSupabaseClient } from './supabase'

// ==========================================
// MAPPERS: Local Types <-> Database Rows
// ==========================================

export function rowToPet(row: any): Pet {
  return {
    id: row.id,
    name: row.name || 'Hewan',
    type: row.type || 'Kucing',
    breed: row.breed || '',
    gender: row.gender || 'Jantan',
    birthDate: row.birth_date || '',
    ageString: row.age_string || '',
    currentWeight: Number(row.current_weight) || 0,
    initialWeight: Number(row.initial_weight) || 0,
    color: row.color || '',
    photo: row.photo || '',
    notes: row.notes || '',
    statusBadge: row.status_badge || 'Perawatan Rutin',
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function petToRow(pet: Pet, userId: string) {
  return {
    id: pet.id,
    user_id: userId,
    name: pet.name,
    type: pet.type,
    breed: pet.breed || '',
    gender: pet.gender || 'Jantan',
    birth_date: pet.birthDate || '',
    age_string: pet.ageString || '',
    current_weight: pet.currentWeight || 0,
    initial_weight: pet.initialWeight || 0,
    color: pet.color || '',
    photo: pet.photo || '',
    notes: pet.notes || '',
    status_badge: pet.statusBadge || 'Perawatan Rutin',
  }
}

export function rowToSchedule(row: any): CareSchedule {
  return {
    id: row.id,
    petId: row.pet_id,
    title: row.title,
    category: row.category,
    date: row.date,
    time: row.time || '09:00',
    notes: row.notes || '',
    status: row.status || 'Akan Datang',
    repeat: row.repeat || 'Tidak berulang',
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function scheduleToRow(sched: CareSchedule, userId: string) {
  return {
    id: sched.id,
    user_id: userId,
    pet_id: sched.petId,
    title: sched.title,
    category: sched.category,
    date: sched.date,
    time: sched.time,
    notes: sched.notes || '',
    status: sched.status,
    repeat: sched.repeat,
  }
}

export function rowToHealth(row: any): HealthRecord {
  return {
    id: row.id,
    petId: row.pet_id,
    date: row.date,
    title: row.title,
    symptoms: row.symptoms || '',
    diagnosis: row.diagnosis || '',
    treatment: row.treatment || '',
    medication: row.medication || '',
    vetOrClinic: row.vet_or_clinic || '',
    notes: row.notes || '',
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function healthToRow(rec: HealthRecord, userId: string) {
  return {
    id: rec.id,
    user_id: userId,
    pet_id: rec.petId,
    date: rec.date,
    title: rec.title,
    symptoms: rec.symptoms || '',
    diagnosis: rec.diagnosis || '',
    treatment: rec.treatment || '',
    medication: rec.medication || '',
    vet_or_clinic: rec.vetOrClinic || '',
    notes: rec.notes || '',
  }
}

export function rowToReminder(row: any): Reminder {
  return {
    id: row.id,
    petId: row.pet_id,
    title: row.title,
    category: row.category,
    date: row.date,
    time: row.time || '08:00',
    dosageOrInstruction: row.dosage_or_instruction || '',
    notes: row.notes || '',
    status: row.status || 'Mendatang',
    isCompleted: Boolean(row.is_completed),
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function reminderToRow(rem: Reminder, userId: string) {
  return {
    id: rem.id,
    user_id: userId,
    pet_id: rem.petId,
    title: rem.title,
    category: rem.category,
    date: rem.date,
    time: rem.time,
    dosage_or_instruction: rem.dosageOrInstruction || '',
    notes: rem.notes || '',
    status: rem.status,
    is_completed: rem.isCompleted,
  }
}

export function rowToFeeding(row: any): FeedingRecord {
  return {
    id: row.id,
    petId: row.pet_id,
    date: row.date,
    time: row.time,
    foodType: row.food_type,
    portion: row.portion,
    notes: row.notes || '',
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function feedingToRow(feed: FeedingRecord, userId: string) {
  return {
    id: feed.id,
    user_id: userId,
    pet_id: feed.petId,
    date: feed.date,
    time: feed.time,
    food_type: feed.foodType,
    portion: feed.portion,
    notes: feed.notes || '',
  }
}

export function rowToWeight(row: any): WeightRecord {
  return {
    id: row.id,
    petId: row.pet_id,
    date: row.date,
    weight: Number(row.weight) || 0,
    notes: row.notes || '',
    createdAt: row.created_at || new Date().toISOString(),
  }
}

export function weightToRow(w: WeightRecord, userId: string) {
  return {
    id: w.id,
    user_id: userId,
    pet_id: w.petId,
    date: w.date,
    weight: w.weight,
    notes: w.notes || '',
  }
}

export function rowToProfile(row: any, fallbackEmail?: string): OwnerProfile {
  return {
    id: row.id,
    name: row.name || 'Pemilik Hewan',
    email: row.email || fallbackEmail || '',
    phone: row.phone || '',
    city: row.city || 'Jakarta',
    address: row.address || '',
    bio: row.bio || '',
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  }
}

export function profileToRow(prof: OwnerProfile, userId: string) {
  return {
    id: userId,
    name: prof.name,
    email: prof.email,
    phone: prof.phone,
    city: prof.city,
    address: prof.address,
    bio: prof.bio,
    avatar: prof.avatar,
    updated_at: new Date().toISOString(),
  }
}

// ==========================================
// SUPABASE DATABASE OPERATIONS
// ==========================================

export async function fetchAllUserData(userId: string) {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  try {
    const [
      profileRes,
      petsRes,
      schedulesRes,
      healthRes,
      remindersRes,
      feedingRes,
      weightRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('pets').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('care_schedules').select('*').eq('user_id', userId).order('date', { ascending: true }),
      supabase.from('health_records').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('reminders').select('*').eq('user_id', userId).order('date', { ascending: true }),
      supabase.from('feeding_records').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('weight_records').select('*').eq('user_id', userId).order('date', { ascending: false }),
    ])

    return {
      profile: profileRes.data ? rowToProfile(profileRes.data) : null,
      pets: (petsRes.data || []).map(rowToPet),
      schedules: (schedulesRes.data || []).map(rowToSchedule),
      healthRecords: (healthRes.data || []).map(rowToHealth),
      reminders: (remindersRes.data || []).map(rowToReminder),
      feedingRecords: (feedingRes.data || []).map(rowToFeeding),
      weightRecords: (weightRes.data || []).map(rowToWeight),
    }
  } catch (err) {
    console.error('Error fetching Supabase user data:', err)
    return null
  }
}
