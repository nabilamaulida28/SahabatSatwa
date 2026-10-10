import React, { useState } from 'react'
import { ageFromBirthDate } from '../../lib/date'
import { Pet } from '../../types'
import { MoreVertical, Edit2, Trash2, Eye, Scale, Calendar, Heart } from 'lucide-react'

interface PetCardProps {
  pet: Pet
  onViewDetail: (pet: Pet) => void
  onEdit: (pet: Pet) => void
  onDelete: (pet: Pet) => void
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false)

  // Badge color based on status
  const badgeStyle =
    pet.statusBadge === 'Vaksin Lengkap'
      ? 'bg-[#E6F3E7] text-[#21845F] border-[#21845F]/20'
      : pet.statusBadge === 'Menunggu Booster'
      ? 'bg-[#FFF1CC] text-[#D97706] border-[#D97706]/20'
      : 'bg-[#EEE6FA] text-[#8B5CF6] border-[#8B5CF6]/20'

  return (
    <div className="group bg-white rounded-2xl border border-[#E9E4DC] overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200 flex flex-col relative">
      {/* Photo Container */}
      <div className="relative h-48 w-full bg-[#FAF6EF] overflow-hidden">
        <img
          src={pet.photo}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // fallback image if broken
            ;(e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs ${badgeStyle}`}
          >
            {pet.statusBadge}
          </span>
        </div>

        {/* Action Menu button */}
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu((prev) => !prev)
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-[#24312C] flex items-center justify-center shadow-xs transition-colors"
            aria-label="Menu tindakan"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-soft-lg border border-[#E9E4DC] py-1 z-20 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  onEdit(pet)
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#24312C] hover:bg-[#FAF6EF] transition-colors text-left"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#21845F]" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  onDelete(pet)
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold text-[#24312C] group-hover:text-[#21845F] transition-colors">
              {pet.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF6EF] text-[#718078] border border-[#E9E4DC]">
              {pet.gender}
            </span>
          </div>

          <p className="text-xs font-medium text-[#718078] mt-0.5">
            {pet.type} · {pet.breed}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E9E4DC]/60 text-xs">
            <div className="flex items-center gap-1.5 text-[#718078]">
              <Calendar className="w-3.5 h-3.5 text-[#21845F]" />
              <span className="font-semibold text-[#24312C]">{ageFromBirthDate(pet.birthDate) || pet.ageString}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#718078]">
              <Scale className="w-3.5 h-3.5 text-[#21845F]" />
              <span className="font-semibold text-[#24312C]">{pet.currentWeight} kg</span>
            </div>
          </div>
        </div>

        {/* Detail Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => onViewDetail(pet)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6EF] hover:bg-[#E6F3E7] text-[#24312C] hover:text-[#21845F] font-bold text-xs transition-colors border border-[#E9E4DC] flex items-center justify-center gap-2 group-hover:border-[#21845F]/30"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Detail</span>
          </button>
        </div>
      </div>
    </div>
  )
}
