// Utilitas tanggal berbasis zona waktu lokal perangkat (bukan UTC),
// supaya "hari ini" tidak meleset saat pengguna di WIB sebelum pukul 07.00.

const pad = (n: number) => String(n).padStart(2, '0')

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayStr(): string {
  return toDateStr(new Date())
}

export function parseDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date()
  const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.trim()
  const parts = clean.split('-').map(Number)
  const y = parts[0] || new Date().getFullYear()
  const m = parts[1] || 1
  const d = parts[2] || 1
  return new Date(y, m - 1, d)
}

export function daysBetween(fromStr: string, toStr: string): number {
  if (!fromStr || !toStr) return 0
  const ms = parseDate(toStr).getTime() - parseDate(fromStr).getTime()
  if (isNaN(ms)) return 0
  return Math.round(ms / 86_400_000)
}

export function addDays(dateStr: string, days: number): string {
  if (!dateStr) return todayStr()
  const d = parseDate(dateStr)
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

export function addMonths(dateStr: string, months: number): string {
  if (!dateStr) return todayStr()
  const d = parseDate(dateStr)
  const day = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() + months)
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, lastDay))
  return toDateStr(d)
}

const MONTHS_LONG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export const monthName = (monthIndex: number) => MONTHS_LONG[monthIndex]

/** 2026-10-10 -> "10 Okt 2026" */
export function formatDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return ''
  const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean)) return dateStr
  const d = parseDate(clean)
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

/** "Hari ini", "Besok", "3 hari lagi", "2 hari lalu", atau tanggal bila jauh. */
export function relativeLabel(dateStr: string): string {
  if (!dateStr) return ''
  const diff = daysBetween(todayStr(), dateStr)
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Besok'
  if (diff === -1) return 'Kemarin'
  if (diff > 1 && diff <= 14) return `${diff} hari lagi`
  if (diff < -1 && diff >= -14) return `${Math.abs(diff)} hari lalu`
  return formatDate(dateStr)
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

/** Hitung umur dari tanggal lahir -> "2 tahun 3 bulan", "5 bulan", "12 hari". */
export function ageFromBirthDate(birthDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return ''
  const b = parseDate(birthDate)
  const now = new Date()
  if (b.getTime() > now.getTime()) return 'Belum lahir'
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth())
  if (now.getDate() < b.getDate()) months -= 1
  if (months < 1) {
    const days = Math.max(0, daysBetween(birthDate, todayStr()))
    return `${days} hari`
  }
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (years === 0) return `${rest} bulan`
  return rest === 0 ? `${years} tahun` : `${years} tahun ${rest} bulan`
}
