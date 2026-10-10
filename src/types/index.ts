export type PetType = 'Kucing' | 'Anjing' | 'Kelinci' | 'Hamster' | 'Burung' | 'Lainnya'

export type PetGender = 'Jantan' | 'Betina'

export interface Pet {
  id: string
  name: string
  type: PetType
  breed: string
  gender: PetGender
  birthDate: string // YYYY-MM-DD
  ageString: string // e.g. "2 tahun"
  currentWeight: number // in kg
  initialWeight: number // in kg
  color: string
  photo: string
  notes?: string
  statusBadge: string // e.g. "Vaksin Lengkap", "Menunggu Booster", "Perawatan Rutin"
  createdAt: string
}

export type ScheduleCategory = 'Vaksin' | 'Obat' | 'Grooming' | 'Pemeriksaan'
export type ScheduleStatus = 'Akan Datang' | 'Selesai' | 'Terlewat'
export type RepeatInterval = 'Tidak berulang' | 'Setiap Minggu' | 'Setiap Bulan' | 'Setiap Tahun'

export interface CareSchedule {
  id: string
  petId: string
  title: string
  category: ScheduleCategory
  date: string // YYYY-MM-DD
  time: string // HH:mm
  notes?: string
  status: ScheduleStatus
  repeat: RepeatInterval
  createdAt: string
}

export interface HealthRecord {
  id: string
  petId: string
  date: string // YYYY-MM-DD
  title: string // Jenis pemeriksaan/tindakan
  symptoms: string // Kondisi / gejala
  diagnosis: string // Hasil pemeriksaan
  treatment: string // Tindakan / perawatan yang diberikan
  medication?: string // Obat yang diberikan
  vetOrClinic: string // Nama dokter hewan atau klinik
  notes?: string
  createdAt: string
}

export type ReminderCategory =
  | 'Obat Cacing'
  | 'Vaksin Rabies'
  | 'Vaksin DHP'
  | 'Obat Tetes Telinga'
  | 'Obat Rutin'
  | 'Pemeriksaan Kesehatan'
  | 'Lainnya'

export type ReminderStatus = 'Hari Ini' | 'Mendatang' | 'Terlambat' | 'Selesai'

export interface Reminder {
  id: string
  petId: string
  title: string
  category: ReminderCategory
  date: string // YYYY-MM-DD
  time: string // HH:mm
  dosageOrInstruction: string // Dosis atau aturan pemberian
  notes?: string
  status: ReminderStatus
  isCompleted: boolean
  createdAt: string
}

export type FoodType = 'Dry Food (Makanan Kering)' | 'Wet Food (Makanan Basah)' | 'Raw Food' | 'Snack & Camilan' | 'Lainnya'

export interface FeedingRecord {
  id: string
  petId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  foodType: FoodType
  portion: string // e.g. "50 gram", "1 sachet"
  notes?: string
  createdAt: string
}

export interface WeightRecord {
  id: string
  petId: string
  date: string // YYYY-MM-DD
  weight: number // in kg
  notes?: string
  createdAt: string
}

export interface OwnerProfile {
  id: string
  name: string
  email: string
  phone: string
  city: string
  address: string
  bio: string
  avatar: string
}

export interface AppNotification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  link: string
  type: 'schedule' | 'reminder' | 'system'
}
