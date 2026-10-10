import React from 'react'
import { Pet } from '../../types'
import { Modal } from '../common/Modal'
import { useSatwaStore } from '../../lib/storage'
import {
  Calendar,
  Scale,
  Heart,
  ClipboardList,
  Bell,
  Edit2,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react'

interface PetDetailModalProps {
  pet: Pet | null
  isOpen: boolean
  onClose: () => void
  onEdit: (pet: Pet) => void
}

export const PetDetailModal: React.FC<PetDetailModalProps> = ({
  pet,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { schedules, healthRecords, reminders } = useSatwaStore()

  if (!pet) return null

  const petSchedules = schedules.filter((s) => s.petId === pet.id)
  const petHealth = healthRecords.filter((h) => h.petId === pet.id)
  const petReminders = reminders.filter((r) => r.petId === pet.id)

  const weightDiff = (pet.currentWeight - pet.initialWeight).toFixed(1)
  const isWeightUp = Number(weightDiff) > 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Profil ${pet.name}`}
      subtitle={`${pet.type} · ${pet.breed}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Hero Pet Card Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-[#FAF6EF] border border-[#E9E4DC]">
          <img
            src={pet.photo}
            alt={pet.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-soft"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-[#24312C]">{pet.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F3E7] text-[#21845F] border border-[#21845F]/20">
                {pet.statusBadge}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white text-[#718078] border border-[#E9E4DC]">
                {pet.gender}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#718078] mt-1">
              Ras: <span className="text-[#24312C]">{pet.breed}</span> · Ciri:{' '}
              <span className="text-[#24312C]">{pet.color}</span>
            </p>

            {pet.notes && (
              <p className="text-xs text-[#718078] mt-2 italic bg-white/70 p-2 rounded-xl border border-[#E9E4DC]/50">
                "{pet.notes}"
              </p>
            )}

            <div className="mt-3 flex justify-center sm:justify-start">
              <button
                onClick={() => {
                  onClose()
                  onEdit(pet)
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E6F3E7] text-xs font-bold text-[#21845F] border border-[#E9E4DC] hover:border-[#21845F]/40 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Informasi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Vital Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-xl border border-[#E9E4DC] text-center shadow-2xs">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Umur</span>
            <p className="text-base font-extrabold text-[#24312C] mt-0.5">{pet.ageString}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E9E4DC] text-center shadow-2xs">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Berat Terkini</span>
            <p className="text-base font-extrabold text-[#21845F] mt-0.5">{pet.currentWeight} kg</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E9E4DC] text-center shadow-2xs">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Berat Awal</span>
            <p className="text-base font-extrabold text-[#718078] mt-0.5">{pet.initialWeight} kg</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E9E4DC] text-center shadow-2xs">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Pertumbuhan</span>
            <p className="text-base font-extrabold text-[#24312C] mt-0.5">
              {isWeightUp ? `+${weightDiff}` : weightDiff} kg
            </p>
          </div>
        </div>

        {/* Section: Upcoming Care Schedules */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Calendar className="w-4 h-4 text-[#8B5CF6]" />
            <h4 className="text-xs font-bold text-[#24312C] uppercase tracking-wider">
              Jadwal Perawatan Terdaftar ({petSchedules.length})
            </h4>
          </div>
          {petSchedules.length === 0 ? (
            <p className="text-xs text-[#718078] py-2 px-3 bg-[#FAF6EF] rounded-xl border border-[#E9E4DC]">
              Belum ada jadwal khusus untuk {pet.name}.
            </p>
          ) : (
            <div className="space-y-2">
              {petSchedules.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E9E4DC] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#24312C]">{s.title}</span>
                    <p className="text-[11px] text-[#718078] mt-0.5">
                      {s.date} pukul {s.time} · {s.category}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      s.status === 'Selesai'
                        ? 'bg-[#E6F3E7] text-[#21845F]'
                        : 'bg-[#EEE6FA] text-[#8B5CF6]'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Medical Records */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <ClipboardList className="w-4 h-4 text-[#21845F]" />
            <h4 className="text-xs font-bold text-[#24312C] uppercase tracking-wider">
              Riwayat Rekam Medis ({petHealth.length})
            </h4>
          </div>
          {petHealth.length === 0 ? (
            <p className="text-xs text-[#718078] py-2 px-3 bg-[#FAF6EF] rounded-xl border border-[#E9E4DC]">
              Belum ada riwayat medis tercatat.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {petHealth.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-white border border-[#E9E4DC] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#24312C]">{h.title}</span>
                    <span className="text-[10px] text-[#718078]">{h.date}</span>
                  </div>
                  <p className="text-[11px] text-[#21845F] font-semibold">{h.vetOrClinic}</p>
                  <p className="text-[11px] text-[#718078]">
                    <span className="font-semibold text-[#24312C]">Hasil:</span> {h.diagnosis}
                  </p>
                  {h.treatment && (
                    <p className="text-[11px] text-[#718078]">
                      <span className="font-semibold text-[#24312C]">Tindakan:</span> {h.treatment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
