import React from 'react'
import { formatDate } from '../../lib/date'
import { CareSchedule, Pet } from '../../types'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Syringe,
  Pill,
  Sparkles,
  Stethoscope,
  RotateCcw,
} from 'lucide-react'

interface ScheduleItemProps {
  schedule: CareSchedule
  pet?: Pet
  onToggleComplete: (id: string) => void
  onEdit: (schedule: CareSchedule) => void
  onDelete: (schedule: CareSchedule) => void
}

export const ScheduleItem: React.FC<ScheduleItemProps> = ({
  schedule,
  pet,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isCompleted = schedule.status === 'Selesai'

  // Category Icon & Styling
  const getCategoryConfig = () => {
    switch (schedule.category) {
      case 'Vaksin':
        return {
          icon: Syringe,
          bgColor: 'bg-[#EEE6FA]',
          textColor: 'text-[#8B5CF6]',
          badgeBg: 'bg-[#EEE6FA] text-[#8B5CF6]',
        }
      case 'Obat':
        return {
          icon: Pill,
          bgColor: 'bg-[#FCE7E5]',
          textColor: 'text-[#E11D48]',
          badgeBg: 'bg-[#FCE7E5] text-[#E11D48]',
        }
      case 'Grooming':
        return {
          icon: Sparkles,
          bgColor: 'bg-[#E6F3E7]',
          textColor: 'text-[#21845F]',
          badgeBg: 'bg-[#E6F3E7] text-[#21845F]',
        }
      case 'Pemeriksaan':
      default:
        return {
          icon: Stethoscope,
          bgColor: 'bg-[#FFF1CC]',
          textColor: 'text-[#D97706]',
          badgeBg: 'bg-[#FFF1CC] text-[#D97706]',
        }
    }
  }

  const cat = getCategoryConfig()
  const Icon = cat.icon

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isCompleted
          ? 'bg-white/60 border-[#E9E4DC] opacity-75'
          : 'bg-white border-[#E9E4DC] shadow-soft hover:shadow-soft-lg hover:border-[#21845F]/30'
      }`}
    >
      {/* Left: Category Icon + Details */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Category Avatar */}
        <div
          className={`w-11 h-11 rounded-2xl ${cat.bgColor} ${cat.textColor} flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`text-sm font-bold text-[#24312C] ${
                isCompleted ? 'line-through text-[#718078]' : ''
              }`}
            >
              {schedule.title}
            </h4>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${cat.badgeBg}`}>
              {schedule.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isCompleted
                  ? 'bg-[#E6F3E7] text-[#21845F]'
                  : 'bg-[#FAF6EF] text-[#718078] border border-[#E9E4DC]'
              }`}
            >
              {schedule.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#718078]">
            {pet && (
              <div className="flex items-center gap-1.5 font-semibold text-[#24312C]">
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>
                  {pet.name} ({pet.type})
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#21845F]" />
              <span>{formatDate(schedule.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#21845F]" />
              <span>{schedule.time} WIB</span>
            </div>
          </div>

          {schedule.notes && (
            <p className="text-xs text-[#718078] mt-1.5 line-clamp-1 bg-[#FAF6EF]/60 px-2.5 py-1 rounded-lg">
              {schedule.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {/* Toggle complete button */}
        <button
          type="button"
          onClick={() => onToggleComplete(schedule.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            isCompleted
              ? 'bg-[#FAF6EF] hover:bg-[#E9E4DC] text-[#718078]'
              : 'bg-[#E6F3E7] hover:bg-[#21845F] text-[#21845F] hover:text-white'
          }`}
        >
          {isCompleted ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Batal</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesai</span>
            </>
          )}
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(schedule)}
          className="p-1.5 rounded-xl text-[#718078] hover:text-[#21845F] hover:bg-[#FAF6EF] transition-colors"
          aria-label="Edit jadwal"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(schedule)}
          className="p-1.5 rounded-xl text-[#718078] hover:text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors"
          aria-label="Hapus jadwal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
