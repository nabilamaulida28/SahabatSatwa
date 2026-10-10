import React, { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { HealthRecordItem } from '../components/health/HealthRecordItem'
import { HealthRecordModal } from '../components/health/HealthRecordModal'
import { HealthDetailModal } from '../components/health/HealthDetailModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useToast } from '../components/common/Toast'
import { HealthRecord, Pet } from '../types'
import { ClipboardList, Plus, Search, ShieldCheck } from 'lucide-react'
import { EmptyStateIllustration } from '../components/illustrations/EmptyStateIllustration'

export const Route = createFileRoute('/riwayat')({
  component: RiwayatKesehatanPage,
})

function RiwayatKesehatanPage() {
  const {
    healthRecords,
    pets,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
  } = useSatwaStore()
  const { showToast } = useToast()

  // Filter states
  const [selectedPetId, setSelectedPetId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recordToEdit, setRecordToEdit] = useState<HealthRecord | null>(null)
  const [recordToView, setRecordToView] = useState<HealthRecord | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<HealthRecord | null>(null)

  const filteredRecords = useMemo(() => {
    return healthRecords.filter((rec) => {
      const matchPet = selectedPetId === 'all' || rec.petId === selectedPetId
      const matchSearch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.vetOrClinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
      return matchPet && matchSearch
    })
  }, [healthRecords, selectedPetId, searchQuery])

  const handleSave = (rec: HealthRecord) => {
    if (recordToEdit) {
      updateHealthRecord(rec)
      showToast(`Catatan "${rec.title}" berhasil diperbarui!`)
    } else {
      addHealthRecord(rec)
      showToast(`Catatan "${rec.title}" berhasil disimpan!`)
    }
  }

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      deleteHealthRecord(recordToDelete.id)
      showToast(`Catatan "${recordToDelete.title}" telah dihapus!`, 'error')
      setRecordToDelete(null)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF1CC] text-[#D97706] text-xs font-bold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Rekam Medis & Pemeriksaan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
            Riwayat Kesehatan
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-0.5">
            Catatan pemeriksaan dan kondisi kesehatan hewan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRecordToEdit(null)
            setIsModalOpen(true)
          }}
          className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Catatan</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E4DC] shadow-soft">
        {/* Pet Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedPetId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedPetId === 'all'
                ? 'bg-[#21845F] text-white shadow-xs'
                : 'bg-[#FAF6EF] text-[#718078] hover:text-[#24312C] hover:bg-[#E9E4DC]/60'
            }`}
          >
            Semua Hewan
          </button>
          {pets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => setSelectedPetId(pet.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedPetId === pet.id
                  ? 'bg-[#21845F] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-[#718078] hover:text-[#24312C] hover:bg-[#E9E4DC]/60'
              }`}
            >
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{pet.name}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pemeriksaan, dokter, atau klinik..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] placeholder-[#718078] focus:outline-none focus:ring-1 focus:ring-[#21845F]"
          />
        </div>
      </div>

      {/* Records list */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const pet = pets.find((p) => p.id === record.petId)
          return (
            <HealthRecordItem
              key={record.id}
              record={record}
              pet={pet}
              onViewDetail={(r) => setRecordToView(r)}
              onEdit={(r) => {
                setRecordToEdit(r)
                setIsModalOpen(true)
              }}
              onDelete={(r) => setRecordToDelete(r)}
            />
          )
        })}

        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E9E4DC] p-8 shadow-soft">
            <EmptyStateIllustration message="Belum ada catatan riwayat kesehatan yang cocok dengan filter ini." />
          </div>
        )}
      </div>

      {/* Form Modal */}
      <HealthRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setRecordToEdit(null)
        }}
        onSave={handleSave}
        pets={pets}
        recordToEdit={recordToEdit}
      />

      {/* Detail Modal */}
      <HealthDetailModal
        isOpen={!!recordToView}
        onClose={() => setRecordToView(null)}
        record={recordToView}
        pet={pets.find((p) => p.id === recordToView?.petId)}
        onEdit={(r) => {
          setRecordToView(null)
          setRecordToEdit(r)
          setIsModalOpen(true)
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Catatan Riwayat Medis?"
        message={`Apakah Anda yakin ingin menghapus catatan "${recordToDelete?.title}"?`}
      />
    </div>
  )
}
