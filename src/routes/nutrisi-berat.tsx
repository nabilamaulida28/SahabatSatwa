import React, { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { WeightChart } from '../components/nutrition/WeightChart'
import { WeightModal } from '../components/nutrition/WeightModal'
import { FeedingModal } from '../components/nutrition/FeedingModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useToast } from '../components/common/Toast'
import { NoPetsNotice } from '../components/common/NoPetsNotice'
import { WeightRecord, FeedingRecord } from '../types'
import {
  Scale,
  Utensils,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { EmptyStateIllustration } from '../components/illustrations/EmptyStateIllustration'

export const Route = createFileRoute('/nutrisi-berat')({
  component: NutrisiBeratPage,
})

function NutrisiBeratPage() {
  const {
    pets,
    weightRecords,
    feedingRecords,
    addWeightRecord,
    deleteWeightRecord,
    addFeedingRecord,
    deleteFeedingRecord,
  } = useSatwaStore()
  const { showToast } = useToast()

  // Active Pet Tab
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '')

  // Modals
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)
  const [isFeedingModalOpen, setIsFeedingModalOpen] = useState(false)
  const [weightToDelete, setWeightToDelete] = useState<WeightRecord | null>(null)
  const [feedingToDelete, setFeedingToDelete] = useState<FeedingRecord | null>(null)

  // Current selected pet
  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0]

  // Filter records for active pet
  const petWeightRecords = useMemo(() => {
    if (!activePet) return []
    return weightRecords
      .filter((w) => w.petId === activePet.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [weightRecords, activePet])

  const petFeedingRecords = useMemo(() => {
    if (!activePet) return []
    return feedingRecords
      .filter((f) => f.petId === activePet.id)
      .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
  }, [feedingRecords, activePet])

  // Weight Calculation: Latest weight & Change indicator
  const latestRecord = petWeightRecords[petWeightRecords.length - 1]
  const previousRecord = petWeightRecords.length > 1 ? petWeightRecords[petWeightRecords.length - 2] : null
  const currentWeightVal = latestRecord ? latestRecord.weight : activePet?.currentWeight || 0

  const diffFromPrevious = previousRecord ? (currentWeightVal - previousRecord.weight).toFixed(2) : '0'
  const isWeightUp = Number(diffFromPrevious) > 0
  const isWeightDown = Number(diffFromPrevious) < 0

  const handleSaveWeight = (rec: WeightRecord) => {
    addWeightRecord(rec)
    showToast(`Berat badan ${activePet?.name} (${rec.weight} kg) berhasil dicatat!`)
  }

  const handleSaveFeeding = (rec: FeedingRecord) => {
    addFeedingRecord(rec)
    showToast(`Catatan porsi makan ${activePet?.name} berhasil disimpan!`)
  }

  const handleConfirmDeleteWeight = () => {
    if (weightToDelete) {
      deleteWeightRecord(weightToDelete.id)
      showToast('Data berat badan berhasil dihapus!', 'info')
      setWeightToDelete(null)
    }
  }

  const handleConfirmDeleteFeeding = () => {
    if (feedingToDelete) {
      deleteFeedingRecord(feedingToDelete.id)
      showToast('Catatan pakan berhasil dihapus!', 'info')
      setFeedingToDelete(null)
    }
  }

  if (pets.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
          Catatan Makan & Berat Badan
        </h1>
        <NoPetsNotice action="mencatat berat badan dan pola makan" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEE6FA] text-[#8B5CF6] text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>Tumbuh Kembang & Nutrisi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
            Catatan Makan & Berat Badan
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-0.5">
            Pantau pola makan dan perkembangan berat badan hewan peliharaanmu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsWeightModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>+ Catat Berat</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFeedingModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EF] text-[#24312C] font-bold text-xs sm:text-sm border border-[#E9E4DC] shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#21845F]" />
            <span>+ Catat Makan</span>
          </button>
        </div>
      </div>

      {/* Pet Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {pets.map((pet) => {
          const isSelected = (activePet?.id || '') === pet.id
          return (
            <button
              key={pet.id}
              type="button"
              onClick={() => setSelectedPetId(pet.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#21845F] text-[#21845F] shadow-soft'
                  : 'bg-[#FAF6EF] border-[#E9E4DC] text-[#718078] hover:bg-white'
              }`}
            >
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{pet.name}</span>
              <span className="text-[11px] font-normal text-[#718078]">
                ({pet.currentWeight} kg)
              </span>
            </button>
          )
        })}
      </div>

      {/* SECTION 1: GRAFIK & STATISTIK BERAT BADAN */}
      <section className="bg-white rounded-3xl border border-[#E9E4DC] p-5 sm:p-7 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E4DC]">
          <div>
            <h2 className="text-lg font-extrabold text-[#24312C]">
              Perkembangan Berat Badan — {activePet?.name}
            </h2>
            <p className="text-xs text-[#718078] mt-0.5">
              Grafik pengukuran berat historis berdasarkan waktu pencatatan
            </p>
          </div>

          {/* Quick Current Weight Highlight Cards */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-[#E6F3E7] border border-[#21845F]/20 text-center">
              <span className="text-[10px] font-bold text-[#718078] uppercase block">
                Berat Saat Ini
              </span>
              <span className="text-xl font-extrabold text-[#21845F]">
                {currentWeightVal} kg
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#FAF6EF] border border-[#E9E4DC] text-center">
              <span className="text-[10px] font-bold text-[#718078] uppercase block">
                Perubahan
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                {isWeightUp ? (
                  <TrendingUp className="w-4 h-4 text-[#21845F]" />
                ) : isWeightDown ? (
                  <TrendingDown className="w-4 h-4 text-[#E11D48]" />
                ) : (
                  <Minus className="w-4 h-4 text-[#718078]" />
                )}
                <span
                  className={`text-sm font-extrabold ${
                    isWeightUp
                      ? 'text-[#21845F]'
                      : isWeightDown
                      ? 'text-[#E11D48]'
                      : 'text-[#718078]'
                  }`}
                >
                  {isWeightUp ? `+${diffFromPrevious}` : diffFromPrevious} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recharts Component */}
        <WeightChart
          records={petWeightRecords}
          petName={activePet?.name || 'Hewan'}
        />

        {/* Historical Weight Log Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#718078] uppercase tracking-wider">
              Daftar Catatan Pengukuran ({petWeightRecords.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E9E4DC] text-[#718078]">
                  <th className="py-2.5 px-3 font-bold">Tanggal</th>
                  <th className="py-2.5 px-3 font-bold">Berat (kg)</th>
                  <th className="py-2.5 px-3 font-bold">Keterangan</th>
                  <th className="py-2.5 px-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E4DC]/60">
                {petWeightRecords
                  .slice()
                  .reverse()
                  .map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#24312C]">
                        {rec.date}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-[#21845F]">
                        {rec.weight} kg
                      </td>
                      <td className="py-3 px-3 text-[#718078]">
                        {rec.notes || '-'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setWeightToDelete(rec)}
                          className="p-1 rounded-lg text-[#718078] hover:text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors"
                          title="Hapus rekaman berat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATATAN POLA MAKAN */}
      <section className="bg-white rounded-3xl border border-[#E9E4DC] p-5 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E4DC]">
          <div>
            <h2 className="text-lg font-extrabold text-[#24312C]">
              Riwayat Catatan Makan — {activePet?.name}
            </h2>
            <p className="text-xs text-[#718078] mt-0.5">
              Jadwal, jenis pakan, dan takaran porsi harian
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFeedingModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#E6F3E7] hover:bg-[#21845F] text-[#21845F] hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Catatan</span>
          </button>
        </div>

        {petFeedingRecords.length === 0 ? (
          <EmptyStateIllustration message={`Belum ada catatan makan untuk ${activePet?.name}.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E9E4DC] text-[#718078]">
                  <th className="py-2.5 px-3 font-bold">Waktu</th>
                  <th className="py-2.5 px-3 font-bold">Jenis Makanan</th>
                  <th className="py-2.5 px-3 font-bold">Porsi</th>
                  <th className="py-2.5 px-3 font-bold">Catatan Pakan</th>
                  <th className="py-2.5 px-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E4DC]/60">
                {petFeedingRecords.map((f) => (
                  <tr key={f.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#24312C]">
                      <div className="flex flex-col">
                        <span>{f.date}</span>
                        <span className="text-[10px] text-[#718078] font-normal">{f.time} WIB</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#FAF6EF] text-[#24312C] border border-[#E9E4DC]">
                        {f.foodType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-[#21845F]">
                      {f.portion}
                    </td>
                    <td className="py-3 px-3 text-[#718078] max-w-xs">
                      {f.notes || '-'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setFeedingToDelete(f)}
                        className="p-1 rounded-lg text-[#718078] hover:text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors"
                        title="Hapus catatan makan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modals */}
      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSave={handleSaveWeight}
        pets={pets}
        defaultPetId={activePet?.id}
      />

      <FeedingModal
        isOpen={isFeedingModalOpen}
        onClose={() => setIsFeedingModalOpen(false)}
        onSave={handleSaveFeeding}
        pets={pets}
        defaultPetId={activePet?.id}
      />

      <ConfirmDialog
        isOpen={!!weightToDelete}
        onClose={() => setWeightToDelete(null)}
        onConfirm={handleConfirmDeleteWeight}
        title="Hapus Catatan Berat Badan?"
        message="Apakah Anda yakin ingin menghapus catatan penimbangan ini?"
      />

      <ConfirmDialog
        isOpen={!!feedingToDelete}
        onClose={() => setFeedingToDelete(null)}
        onConfirm={handleConfirmDeleteFeeding}
        title="Hapus Catatan Pola Makan?"
        message="Apakah Anda yakin ingin menghapus catatan konsumsi pakan ini?"
      />
    </div>
  )
}
