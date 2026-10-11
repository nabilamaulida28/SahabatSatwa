import React, { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { ReminderItem } from '../components/reminders/ReminderItem'
import { ReminderModal } from '../components/reminders/ReminderModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useToast } from '../components/common/Toast'
import { NoPetsNotice } from '../components/common/NoPetsNotice'
import { Reminder } from '../types'
import { Bell, Plus, Search, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { EmptyStateIllustration } from '../components/illustrations/EmptyStateIllustration'

export const Route = createFileRoute('/pengingat')({
  component: PengingatPage,
})

function PengingatPage() {
  const {
    reminders,
    pets,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderComplete,
  } = useSatwaStore()
  const { showToast } = useToast()

  // State filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null)
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null)

  const CATEGORIES = [
    'Semua',
    'Obat Cacing',
    'Vaksin Rabies',
    'Vaksin DHP',
    'Obat Tetes Telinga',
    'Obat Rutin',
    'Pemeriksaan Kesehatan',
  ]

  const filteredReminders = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim()
    return (reminders || []).filter((rem) => {
      if (!rem) return false
      const matchCat =
        selectedCategory === 'Semua' || rem.category === selectedCategory
      const matchSearch =
        !q ||
        (rem.title || '').toLowerCase().includes(q) ||
        (rem.dosageOrInstruction || '').toLowerCase().includes(q) ||
        (rem.notes ? rem.notes.toLowerCase().includes(q) : false)
      return matchCat && matchSearch
    })
  }, [reminders, selectedCategory, searchQuery])

  // Split into:
  // 1. Perlu Dilakukan Segera (Hari Ini / Terlambat & belum selesai)
  // 2. Mendatang (belum selesai)
  // 3. Selesai
  const urgentReminders = filteredReminders.filter(
    (r) => !r.isCompleted && (r.status === 'Hari Ini' || r.status === 'Terlambat')
  )
  const upcomingReminders = filteredReminders.filter(
    (r) => !r.isCompleted && r.status === 'Mendatang'
  )
  const completedReminders = filteredReminders.filter((r) => r.isCompleted)

  const handleSave = (rem: Reminder) => {
    if (reminderToEdit) {
      updateReminder(rem)
      showToast(`Pengingat "${rem.title}" berhasil diperbarui!`)
    } else {
      addReminder(rem)
      showToast(`Pengingat "${rem.title}" berhasil ditambahkan!`)
    }
  }

  const handleConfirmDelete = () => {
    if (reminderToDelete) {
      deleteReminder(reminderToDelete.id)
      showToast(`Pengingat "${reminderToDelete.title}" telah dihapus!`, 'error')
      setReminderToDelete(null)
    }
  }

  const handleToggle = (id: string) => {
    const target = reminders.find((r) => r.id === id)
    toggleReminderComplete(id)
    if (target) {
      const stateText = target.isCompleted ? 'diaktifkan kembali' : 'ditandai Selesai'
      showToast(`Pengingat "${target.title}" ${stateText}!`)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FCE7E5] text-[#E11D48] text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Alarm & Dosis Obat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
            Pengingat Vaksin & Obat
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-0.5">
            Jangan sampai melewatkan perawatan penting untuk hewan peliharaanmu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setReminderToEdit(null)
            setIsModalOpen(true)
          }}
          disabled={pets.length === 0}
          className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengingat</span>
        </button>
      </div>

      {pets.length === 0 && <NoPetsNotice action="membuat pengingat" />}

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E4DC] shadow-soft">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#21845F] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-[#718078] hover:text-[#24312C] hover:bg-[#E9E4DC]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari obat atau dosis..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] placeholder-[#718078] focus:outline-none focus:ring-1 focus:ring-[#21845F]"
          />
        </div>
      </div>

      {/* SECTION 1: PERLU DILAKUKAN SEGERA / HARI INI */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-ping" />
          <h2 className="text-base font-extrabold text-[#24312C] tracking-tight">
            Perlu Dilakukan Segera ({urgentReminders.length})
          </h2>
        </div>

        {urgentReminders.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#E6F3E7]/60 border border-[#21845F]/20 text-xs text-[#21845F] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Bagus sekali! Tidak ada pengingat mendesak yang tertunda hari ini.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentReminders.map((rem) => (
              <ReminderItem
                key={rem.id}
                reminder={rem}
                pet={(pets || []).find((p) => p && p.id === rem.petId)}
                onToggleComplete={handleToggle}
                onEdit={(r) => {
                  setReminderToEdit(r)
                  setIsModalOpen(true)
                }}
                onDelete={(r) => setReminderToDelete(r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: PENGINGAT MENDATANG */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="text-base font-extrabold text-[#24312C] tracking-tight">
            Jadwal Pengingat Mendatang ({upcomingReminders.length})
          </h2>
        </div>

        {upcomingReminders.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white border border-[#E9E4DC] text-xs text-[#718078]">
            Tidak ada pengingat masa depan yang dijadwalkan saat ini.
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingReminders.map((rem) => (
              <ReminderItem
                key={rem.id}
                reminder={rem}
                pet={(pets || []).find((p) => p && p.id === rem.petId)}
                onToggleComplete={handleToggle}
                onEdit={(r) => {
                  setReminderToEdit(r)
                  setIsModalOpen(true)
                }}
                onDelete={(r) => setReminderToDelete(r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: RIWAYAT PENGINGAT SELESAI */}
      {completedReminders.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#21845F]" />
            <h2 className="text-base font-extrabold text-[#718078] tracking-tight">
              Riwayat Selesai Diberikan ({completedReminders.length})
            </h2>
          </div>

          <div className="space-y-3">
            {completedReminders.map((rem) => (
              <ReminderItem
                key={rem.id}
                reminder={rem}
                pet={(pets || []).find((p) => p && p.id === rem.petId)}
                onToggleComplete={handleToggle}
                onEdit={(r) => {
                  setReminderToEdit(r)
                  setIsModalOpen(true)
                }}
                onDelete={(r) => setReminderToDelete(r)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modal Add & Edit */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setReminderToEdit(null)
        }}
        onSave={handleSave}
        pets={pets || []}
        reminderToEdit={reminderToEdit}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!reminderToDelete}
        onClose={() => setReminderToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pengingat?"
        message={`Apakah Anda yakin ingin menghapus pengingat "${reminderToDelete?.title}"?`}
      />
    </div>
  )
}
