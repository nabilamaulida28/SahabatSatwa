import React, { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { PetCard } from '../components/pets/PetCard'
import { PetModal } from '../components/pets/PetModal'
import { PetDetailModal } from '../components/pets/PetDetailModal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useToast } from '../components/common/Toast'
import { Pet, PetType } from '../types'
import { PawPrint, Plus, Search, Filter } from 'lucide-react'
import { EmptyStateIllustration } from '../components/illustrations/EmptyStateIllustration'

export const Route = createFileRoute('/hewan')({
  component: DataHewanPage,
})

function DataHewanPage() {
  const { pets, addPet, updatePet, deletePet } = useSatwaStore()
  const { showToast } = useToast()

  // Filter & Search states
  const [selectedType, setSelectedType] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null)
  const [petToView, setPetToView] = useState<Pet | null>(null)
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null)

  // Types list for filter pills
  const FILTER_TYPES = ['Semua', 'Kucing', 'Anjing', 'Kelinci', 'Hamster', 'Lainnya']

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchType = selectedType === 'Semua' || pet.type === selectedType
      const matchSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pet.notes && pet.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchType && matchSearch
    })
  }, [pets, selectedType, searchQuery])

  const handleSavePet = (newOrUpdatedPet: Pet) => {
    if (petToEdit) {
      updatePet(newOrUpdatedPet)
      showToast(`Data ${newOrUpdatedPet.name} berhasil diperbarui!`)
    } else {
      addPet(newOrUpdatedPet)
      showToast(`Hewan baru ${newOrUpdatedPet.name} berhasil didaftarkan!`)
    }
  }

  const handleConfirmDelete = () => {
    if (petToDelete) {
      deletePet(petToDelete.id)
      showToast(`Data ${petToDelete.name} berhasil dihapus!`, 'error')
      setPetToDelete(null)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6F3E7] text-[#21845F] text-xs font-bold mb-2">
            <PawPrint className="w-3.5 h-3.5" />
            <span>Manajemen Satwa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
            Data Hewan
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-0.5">
            Kelola informasi hewan kesayanganmu di sini.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPetToEdit(null)
            setIsAddModalOpen(true)
          }}
          className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Hewan</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#E9E4DC] shadow-soft">
        {/* Species filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {FILTER_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                selectedType === type
                  ? 'bg-[#21845F] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-[#718078] hover:text-[#24312C] hover:bg-[#E9E4DC]/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau ras..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] placeholder-[#718078] focus:outline-none focus:ring-1 focus:ring-[#21845F]"
          />
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onViewDetail={(p) => setPetToView(p)}
            onEdit={(p) => {
              setPetToEdit(p)
              setIsAddModalOpen(true)
            }}
            onDelete={(p) => setPetToDelete(p)}
          />
        ))}

        {/* Empty placeholder card: Tambah Hewan Baru */}
        <div
          onClick={() => {
            setPetToEdit(null)
            setIsAddModalOpen(true)
          }}
          className="min-h-[280px] rounded-2xl border-2 border-dashed border-[#E9E4DC] hover:border-[#21845F] bg-[#FAF6EF]/40 hover:bg-[#E6F3E7]/40 transition-all duration-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer group shadow-2xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#E6F3E7] text-[#21845F] group-hover:scale-110 flex items-center justify-center transition-transform shadow-xs mb-3">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-[#24312C] group-hover:text-[#21845F] transition-colors">
            Tambah Hewan Baru
          </h3>
          <p className="text-xs text-[#718078] mt-1 max-w-[180px]">
            Daftarkan anjing, kucing, atau hewan kesayangan lainnya
          </p>
        </div>
      </div>

      {filteredPets.length === 0 && (
        <div className="bg-white rounded-3xl border border-[#E9E4DC] p-8 shadow-soft">
          <EmptyStateIllustration message="Tidak ada hewan peliharaan yang cocok dengan pencarian atau filter ini." />
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <PetModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setPetToEdit(null)
        }}
        onSave={handleSavePet}
        petToEdit={petToEdit}
      />

      {/* Detail Modal */}
      <PetDetailModal
        isOpen={!!petToView}
        onClose={() => setPetToView(null)}
        pet={petToView}
        onEdit={(p) => {
          setPetToView(null)
          setPetToEdit(p)
          setIsAddModalOpen(true)
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!petToDelete}
        onClose={() => setPetToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Hewan?"
        message={`Apakah Anda yakin ingin menghapus data "${petToDelete?.name}"? Seluruh jadwal perawatan dan riwayat medis yang terkait juga akan dihapus.`}
      />
    </div>
  )
}
