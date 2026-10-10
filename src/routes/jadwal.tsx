import React, { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { ScheduleItem } from '../components/schedules/ScheduleItem'
import { ScheduleModal } from '../components/schedules/ScheduleModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useToast } from '../components/common/Toast'
import { CareSchedule, ScheduleCategory, ScheduleStatus } from '../types'
import { Calendar, Plus, Search, Filter } from 'lucide-react'
import { EmptyStateIllustration } from '../components/illustrations/EmptyStateIllustration'

export const Route = createFileRoute('/jadwal')({
  component: JadwalPerawatanPage,
})

function JadwalPerawatanPage() {
  const {
    schedules,
    pets,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleScheduleComplete,
  } = useSatwaStore()
  const { showToast } = useToast()

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scheduleToEdit, setScheduleToEdit] = useState<CareSchedule | null>(null)
  const [scheduleToDelete, setScheduleToDelete] = useState<CareSchedule | null>(null)

  const CATEGORIES = ['Semua', 'Vaksin', 'Obat', 'Grooming', 'Pemeriksaan']
  const STATUSES = ['Semua', 'Akan Datang', 'Selesai', 'Terlewat']

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchCategory =
        selectedCategory === 'Semua' || s.category === selectedCategory
      const matchStatus =
        selectedStatus === 'Semua' || s.status === selectedStatus
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCategory && matchStatus && matchSearch
    })
  }, [schedules, selectedCategory, selectedStatus, searchQuery])

  const handleSave = (sched: CareSchedule) => {
    if (scheduleToEdit) {
      updateSchedule(sched)
      showToast(`Jadwal "${sched.title}" berhasil diperbarui!`)
    } else {
      addSchedule(sched)
      showToast(`Jadwal "${sched.title}" berhasil ditambahkan!`)
    }
  }

  const handleConfirmDelete = () => {
    if (scheduleToDelete) {
      deleteSchedule(scheduleToDelete.id)
      showToast(`Jadwal "${scheduleToDelete.title}" telah dihapus!`, 'error')
      setScheduleToDelete(null)
    }
  }

  const handleToggle = (id: string) => {
    toggleScheduleComplete(id)
    const target = schedules.find((s) => s.id === id)
    if (target) {
      const newStatus = target.status === 'Selesai' ? 'diubah ke Akan Datang' : 'ditandai Selesai'
      showToast(`Jadwal "${target.title}" ${newStatus}!`)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEE6FA] text-[#8B5CF6] text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda & Perawatan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
            Jadwal Perawatan
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-0.5">
            Lihat dan kelola jadwal perawatan hewan peliharaanmu.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setScheduleToEdit(null)
            setIsModalOpen(true)
          }}
          className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Jadwal</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E9E4DC] shadow-soft">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
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

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama perawatan..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] placeholder-[#718078] focus:outline-none focus:ring-1 focus:ring-[#21845F]"
            />
          </div>
        </div>

        {/* Status Tab Filter */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#E9E4DC]/60 text-xs">
          <span className="font-bold text-[#718078] mr-1">Status:</span>
          {STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[#FAF6EF] text-[#21845F] font-bold border border-[#21845F]/30'
                  : 'text-[#718078] hover:text-[#24312C]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-3.5">
        {filteredSchedules.map((schedule) => {
          const pet = pets.find((p) => p.id === schedule.petId)
          return (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              pet={pet}
              onToggleComplete={handleToggle}
              onEdit={(s) => {
                setScheduleToEdit(s)
                setIsModalOpen(true)
              }}
              onDelete={(s) => setScheduleToDelete(s)}
            />
          )
        })}

        {filteredSchedules.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E9E4DC] p-8 shadow-soft">
            <EmptyStateIllustration message="Tidak ada jadwal yang sesuai dengan filter ini." />
          </div>
        )}
      </div>

      {/* Modal Add & Edit */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setScheduleToEdit(null)
        }}
        onSave={handleSave}
        pets={pets}
        scheduleToEdit={scheduleToEdit}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!scheduleToDelete}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Jadwal Perawatan?"
        message={`Apakah Anda yakin ingin menghapus jadwal "${scheduleToDelete?.title}"?`}
      />
    </div>
  )
}
