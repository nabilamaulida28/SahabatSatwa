import React, { useState, useMemo } from 'react'
import { Search, X, PawPrint, Calendar, Heart, Bell, ArrowRight, ClipboardList } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useSatwaStore } from '../../lib/storage'
import { Modal } from './Modal'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { pets, schedules, reminders, healthRecords, owner } = useSatwaStore()

  const trimmed = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!trimmed) {
      return {
        pets: pets.slice(0, 3),
        schedules: schedules.slice(0, 2),
        reminders: reminders.slice(0, 2),
        healthRecords: healthRecords.slice(0, 2),
      }
    }

    return {
      pets: pets.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.breed.toLowerCase().includes(trimmed) ||
          p.type.toLowerCase().includes(trimmed) ||
          (p.notes && p.notes.toLowerCase().includes(trimmed))
      ),
      schedules: schedules.filter(
        (s) =>
          s.title.toLowerCase().includes(trimmed) ||
          s.category.toLowerCase().includes(trimmed) ||
          (s.notes && s.notes.toLowerCase().includes(trimmed))
      ),
      reminders: reminders.filter(
        (r) =>
          r.title.toLowerCase().includes(trimmed) ||
          r.category.toLowerCase().includes(trimmed) ||
          (r.dosageOrInstruction && r.dosageOrInstruction.toLowerCase().includes(trimmed))
      ),
      healthRecords: healthRecords.filter(
        (h) =>
          h.title.toLowerCase().includes(trimmed) ||
          h.vetOrClinic.toLowerCase().includes(trimmed) ||
          h.symptoms.toLowerCase().includes(trimmed)
      ),
    }
  }, [trimmed, pets, schedules, reminders, healthRecords])

  const hasAnyResults =
    results.pets.length > 0 ||
    results.schedules.length > 0 ||
    (results.reminders && results.reminders.length > 0) ||
    (results.healthRecords && results.healthRecords.length > 0)

  const handleSelect = (path: string) => {
    onClose()
    navigate({ to: path })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pencarian Cepat" maxWidth="max-w-xl">
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718078]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari hewan, ras, jadwal, pengingat, atau riwayat..."
          autoFocus
          className="w-full pl-11 pr-10 py-3 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] placeholder-[#718078] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718078] hover:text-[#24312C]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {/* Results for Pets */}
        {results.pets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#718078] uppercase tracking-wider">
              <PawPrint className="w-3.5 h-3.5 text-[#21845F]" />
              <span>Data Hewan ({results.pets.length})</span>
            </div>
            <div className="space-y-1.5">
              {results.pets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => handleSelect('/hewan')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EF] cursor-pointer transition-colors border border-transparent hover:border-[#E9E4DC]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pet.photo}
                      alt={pet.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#E9E4DC]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#24312C]">{pet.name}</h4>
                      <p className="text-xs text-[#718078]">
                        {pet.type} · {pet.breed} · {pet.currentWeight} kg
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#718078]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results for Schedules */}
        {results.schedules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#718078] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Jadwal Perawatan ({results.schedules.length})</span>
            </div>
            <div className="space-y-1.5">
              {results.schedules.map((sched) => {
                const pet = pets.find((p) => p.id === sched.petId)
                return (
                  <div
                    key={sched.id}
                    onClick={() => handleSelect('/jadwal')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EF] cursor-pointer transition-colors border border-transparent hover:border-[#E9E4DC]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#24312C]">{sched.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EEE6FA] text-[#8B5CF6]">
                          {sched.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#718078] mt-0.5">
                        {pet?.name ? `${pet.name} · ` : ''}
                        {sched.date} pukul {sched.time}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718078]" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Results for Reminders */}
        {results.reminders && results.reminders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#718078] uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>Pengingat ({results.reminders.length})</span>
            </div>
            <div className="space-y-1.5">
              {results.reminders.map((rem) => (
                <div
                  key={rem.id}
                  onClick={() => handleSelect('/pengingat')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EF] cursor-pointer transition-colors border border-transparent hover:border-[#E9E4DC]"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#24312C]">{rem.title}</h4>
                    <p className="text-xs text-[#718078] mt-0.5">
                      {rem.category} · {rem.date} {rem.time}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#718078]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results for Health Records */}
        {results.healthRecords && results.healthRecords.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#718078] uppercase tracking-wider">
              <ClipboardList className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Riwayat Medis ({results.healthRecords.length})</span>
            </div>
            <div className="space-y-1.5">
              {results.healthRecords.map((rec) => {
                const pet = pets.find((p) => p.id === rec.petId)
                return (
                  <div
                    key={rec.id}
                    onClick={() => handleSelect('/riwayat')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EF] cursor-pointer transition-colors border border-transparent hover:border-[#E9E4DC]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#24312C]">{rec.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF1CC] text-[#D97706]">
                          {rec.vetOrClinic}
                        </span>
                      </div>
                      <p className="text-xs text-[#718078] mt-0.5">
                        {pet?.name ? `${pet.name} · ` : ''}
                        {rec.diagnosis || rec.symptoms}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718078]" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!hasAnyResults && (
          <div className="py-8 text-center text-[#718078]">
            <p className="text-sm">Tidak ditemukan hasil untuk "{query}"</p>
            <p className="text-xs text-[#718078] mt-1">Coba kata kunci lain seperti nama hewan atau jadwal.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
