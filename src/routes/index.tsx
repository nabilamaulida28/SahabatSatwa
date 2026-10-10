import React, { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { HeroPetIllustration } from '../components/illustrations/HeroPetIllustration'
import { ReminderCatIllustration } from '../components/illustrations/ReminderCatIllustration'
import { StatCard } from '../components/common/StatCard'
import { ScheduleModal } from '../components/schedules/ScheduleModal'
import { PetDetailModal } from '../components/pets/PetDetailModal'
import { PetModal } from '../components/pets/PetModal'
import { useToast } from '../components/common/Toast'
import { NoPetsNotice } from '../components/common/NoPetsNotice'
import { relativeLabel, formatDate, greeting } from '../lib/date'
import { CareSchedule, Pet } from '../types'
import {
  PawPrint,
  Calendar,
  Pill,
  Heart,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  Syringe,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  const {
    today,
    owner,
    pets,
    schedules,
    reminders,
    healthRecords,
    addSchedule,
    updateSchedule,
    toggleScheduleComplete,
    updatePet,
  } = useSatwaStore()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // State for modals
  const [isAddSchedOpen, setIsAddSchedOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null)

  // 1. Calculate Statistics dynamically
  const totalPets = pets.length
  const catCount = pets.filter((p) => p.type === 'Kucing').length
  const dogCount = pets.filter((p) => p.type === 'Anjing').length
  const otherCount = totalPets - (catCount + dogCount)

  const petSummaryParts: string[] = []
  if (catCount > 0) petSummaryParts.push(`${catCount} kucing`)
  if (dogCount > 0) petSummaryParts.push(`${dogCount} anjing`)
  if (otherCount > 0) petSummaryParts.push(`${otherCount} lainnya`)
  const petSummary = petSummaryParts.join(' · ') || 'Belum ada hewan terdaftar'

  // Today's schedules
  const todayStr = today
  const todaySchedules = schedules.filter((s) => s.date === todayStr)
  const todayVaksin = todaySchedules.filter((s) => s.category === 'Vaksin').length
  const todayGrooming = todaySchedules.filter((s) => s.category === 'Grooming').length
  const todayObat = todaySchedules.filter((s) => s.category === 'Obat').length
  const todayPeriksa = todaySchedules.filter((s) => s.category === 'Pemeriksaan').length

  const todaySummaryParts: string[] = []
  if (todayVaksin > 0) todaySummaryParts.push(`${todayVaksin} vaksin`)
  if (todayGrooming > 0) todaySummaryParts.push(`${todayGrooming} grooming`)
  if (todayObat > 0) todaySummaryParts.push(`${todayObat} obat`)
  if (todayPeriksa > 0) todaySummaryParts.push(`${todayPeriksa} periksa`)
  const todaySummary =
    todaySummaryParts.join(' · ') || (todaySchedules.length > 0 ? `${todaySchedules.length} kegiatan` : 'Tidak ada jadwal hari ini')

  // Active Reminders
  const activeReminders = reminders.filter((r) => !r.isCompleted)
  const todayReminders = reminders.filter((r) => r.status === 'Hari Ini' && !r.isCompleted)
  const reminderSummary =
    todayReminders.length > 0
      ? `${todayReminders[0].title}`
      : activeReminders.length > 0
      ? `${activeReminders.length} pengingat aktif`
      : 'Semua obat & vaksin tuntas'

  // Health records count
  const totalHealth = healthRecords.length
  const healthSummary = `${totalHealth} catatan tersimpan`

  // Upcoming schedules (sorted)
  const upcomingSchedules = schedules
    .filter((s) => s.status !== 'Selesai')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 4)

  // Item yang sudah lewat tanggalnya tapi belum selesai
  const overdueSchedules = schedules.filter((s) => s.status === 'Terlewat').length
  const overdueReminders = reminders.filter((r) => r.status === 'Terlambat').length

  // Active highlighted reminder for the right card
  const highlightReminder = todayReminders[0] || activeReminders[0] || null
  const highlightText = highlightReminder
    ? highlightReminder.notes ||
      `${highlightReminder.title} — ${highlightReminder.dosageOrInstruction}`
    : 'Semua pengingat sudah tuntas. Hewan kesayanganmu terawat dengan baik!'

  const handleCompleteSchedule = (item: CareSchedule) => {
    const next = toggleScheduleComplete(item.id)
    showToast(
      next
        ? `"${item.title}" selesai. Jadwal berikutnya dibuat untuk ${formatDate(next.date)}.`
        : `Jadwal "${item.title}" ditandai selesai!`
    )
  }

  const handleSaveSchedule = (newSched: CareSchedule) => {
    addSchedule(newSched)
    showToast('Jadwal perawatan berhasil ditambahkan!')
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF9EE] via-[#FAF6EF] to-[#E6F3E7]/50 rounded-3xl border border-[#E9E4DC] p-6 sm:p-8 lg:p-10 shadow-soft">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex-1 text-center md:text-left space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F3E7] text-[#21845F] text-xs font-bold border border-[#21845F]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sahabat Terbaik untuk Hewan Kesayanganmu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#24312C] tracking-tight leading-tight">
              {greeting()}, {owner.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm sm:text-base text-[#718078] leading-relaxed">
              Yuk, pastikan hewan kesayanganmu selalu sehat dan mendapatkan perawatan terbaik setiap hari!
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={() => setIsAddSchedOpen(true)}
                disabled={pets.length === 0}
                className="px-4 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-soft transition-all duration-150 flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Jadwal Baru</span>
              </button>
              <Link
                to="/hewan"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EF] text-[#24312C] text-xs sm:text-sm font-bold border border-[#E9E4DC] shadow-2xs transition-colors flex items-center gap-2"
              >
                <PawPrint className="w-4 h-4 text-[#21845F]" />
                <span>Kelola Data Hewan</span>
              </Link>
            </div>
          </div>

          <div className="shrink-0 flex justify-center">
            <HeroPetIllustration className="w-64 sm:w-80 md:w-84 lg:w-96 h-auto drop-shadow-sm" />
          </div>
        </div>
      </section>

      {pets.length === 0 && <NoPetsNotice action="membuat jadwal dan pengingat" />}

      {/* PERINGATAN ITEM TERLAMBAT */}
      {(overdueSchedules > 0 || overdueReminders > 0) && (
        <section
          role="alert"
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-[#FCE7E5] border border-[#E11D48]/25"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E11D48] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-sm text-[#24312C]">
              <span className="font-extrabold">Ada perawatan yang terlewat: </span>
              {[
                overdueSchedules > 0 ? `${overdueSchedules} jadwal` : null,
                overdueReminders > 0 ? `${overdueReminders} pengingat` : null,
              ]
                .filter(Boolean)
                .join(' dan ')}{' '}
              belum diselesaikan.
            </p>
          </div>
          <Link
            to={overdueReminders > 0 ? '/pengingat' : '/jadwal'}
            className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold text-center transition-colors"
          >
            Tangani Sekarang
          </Link>
        </section>
      )}

      {/* 4 STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Hewan"
          value={totalPets}
          summary={petSummary}
          icon={<PawPrint className="w-5 h-5 text-[#21845F]" />}
          bgColor="#E6F3E7"
          iconBgColor="#FFFFFF"
          onClick={() => navigate({ to: '/hewan' })}
        />
        <StatCard
          title="Jadwal Hari Ini"
          value={todaySchedules.length}
          summary={todaySummary}
          icon={<Calendar className="w-5 h-5 text-[#8B5CF6]" />}
          bgColor="#EEE6FA"
          iconBgColor="#FFFFFF"
          onClick={() => navigate({ to: '/jadwal' })}
        />
        <StatCard
          title="Pengingat Obat"
          value={activeReminders.length}
          summary={reminderSummary}
          icon={<Pill className="w-5 h-5 text-[#E11D48]" />}
          bgColor="#FCE7E5"
          iconBgColor="#FFFFFF"
          onClick={() => navigate({ to: '/pengingat' })}
        />
        <StatCard
          title="Riwayat Kesehatan"
          value={totalHealth}
          summary={healthSummary}
          icon={<Heart className="w-5 h-5 text-[#D97706]" />}
          bgColor="#FFF1CC"
          iconBgColor="#FFFFFF"
          onClick={() => navigate({ to: '/riwayat' })}
        />
      </section>

      {/* TWO COLUMN SECTION: UPCOMING SCHEDULES & REMINDER CARD */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Jadwal Mendatang (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E9E4DC] p-5 sm:p-7 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E4DC]">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#24312C] tracking-tight">
                Jadwal Mendatang
              </h2>
              <p className="text-xs text-[#718078] mt-0.5">
                Aktivitas perawatan penting untuk hewan peliharaanmu
              </p>
            </div>
            <Link
              to="/jadwal"
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF6EF] hover:bg-[#E6F3E7] text-xs font-bold text-[#21845F] border border-[#E9E4DC] transition-colors flex items-center gap-1.5"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Schedule list */}
          <div className="divide-y divide-[#E9E4DC]/60 mt-3">
            {upcomingSchedules.length === 0 ? (
              <div className="py-10 text-center text-[#718078] text-xs">
                Tidak ada jadwal yang menunggu. Klik &quot;Buat Jadwal Baru&quot; untuk menambah.
              </div>
            ) : (
              upcomingSchedules.map((item) => {
                const pet = pets.find((p) => p.id === item.petId)
                const relativeStatus = relativeLabel(item.date)
                const isOverdue = item.status === 'Terlewat'

                const categoryBadgeColor =
                  item.category === 'Vaksin'
                    ? 'bg-[#EEE6FA] text-[#8B5CF6]'
                    : item.category === 'Obat'
                    ? 'bg-[#FCE7E5] text-[#E11D48]'
                    : item.category === 'Grooming'
                    ? 'bg-[#E6F3E7] text-[#21845F]'
                    : 'bg-[#FFF1CC] text-[#D97706]'

                return (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#FAF6EF]/50 px-2 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Pet Avatar thumbnail */}
                      <img
                        src={
                          pet?.photo ||
                          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={pet?.name || 'Hewan'}
                        className="w-12 h-12 rounded-2xl object-cover border border-[#E9E4DC] shadow-2xs group-hover:scale-105 transition-transform"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-[#24312C] group-hover:text-[#21845F] transition-colors">
                            {item.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${categoryBadgeColor}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#718078]">
                          <span className="font-semibold text-[#24312C]">
                            {pet ? `${pet.name} (${pet.type})` : 'Semua Hewan'}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#21845F]" />
                            {formatDate(item.date)} pukul {item.time} WIB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                          relativeStatus === 'Hari ini' || isOverdue
                            ? 'bg-[#FCE7E5] text-[#E11D48]'
                            : 'bg-[#FAF6EF] text-[#21845F] border border-[#E9E4DC]'
                        }`}
                      >
                        {relativeStatus}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCompleteSchedule(item)}
                        className="w-8 h-8 rounded-xl bg-[#FAF6EF] hover:bg-[#21845F] text-[#718078] hover:text-white flex items-center justify-center transition-colors border border-[#E9E4DC] cursor-pointer"
                        aria-label={`Tandai ${item.title} selesai`}
                        title="Tandai selesai"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <Link
                        to="/jadwal"
                        className="w-8 h-8 rounded-xl bg-[#FAF6EF] hover:bg-[#E6F3E7] text-[#718078] hover:text-[#21845F] flex items-center justify-center transition-colors border border-[#E9E4DC]"
                        aria-label="Detail Jadwal"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Kartu Pengingat di Sisi Kanan (1 Column) */}
        <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FFF1CC]/30 rounded-3xl border border-[#E9E4DC] p-6 sm:p-7 shadow-soft flex flex-col items-center text-center relative overflow-hidden">
          {/* Top cute badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF1CC] text-[#D97706] text-xs font-bold mb-4">
            <Pill className="w-3.5 h-3.5" />
            <span>Pengingat Khusus</span>
          </div>

          {/* Cute Cat & Leaf Illustration */}
          <div className="my-2">
            <ReminderCatIllustration className="w-36 h-auto drop-shadow-xs" />
          </div>

          <h3 className="text-xl font-extrabold text-[#24312C] mt-2">
            Jangan lupa!
          </h3>
          <p className="text-xs sm:text-sm text-[#718078] mt-2 leading-relaxed max-w-xs">
            {highlightText}
          </p>

          <div className="mt-6 w-full">
            <Link
              to="/pengingat"
              className="w-full py-3 px-4 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm transition-all shadow-soft flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Pill className="w-4 h-4" />
              <span>Lihat Pengingat</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <ScheduleModal
        isOpen={isAddSchedOpen}
        onClose={() => setIsAddSchedOpen(false)}
        onSave={handleSaveSchedule}
        pets={pets}
      />

      <PetDetailModal
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
        pet={selectedPet}
        onEdit={(p) => setPetToEdit(p)}
      />

      <PetModal
        isOpen={!!petToEdit}
        onClose={() => setPetToEdit(null)}
        onSave={(updated) => {
          updatePet(updated)
          showToast(`Data ${updated.name} berhasil diperbarui!`)
        }}
        petToEdit={petToEdit}
      />
    </div>
  )
}
