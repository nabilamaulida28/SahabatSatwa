import React from 'react'
import { formatDate } from '../../lib/date'
import { Reminder, Pet } from '../../types'
import {
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Pill,
  Syringe,
  Sparkles,
  RotateCcw,
} from 'lucide-react'

interface ReminderItemProps {
  reminder: Reminder
  pet?: Pet
  onToggleComplete: (id: string) => void
  onEdit: (reminder: Reminder) => void
  onDelete: (reminder: Reminder) => void
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  pet,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isCompleted = reminder.isCompleted

  // Category Colors
  const getCategoryConfig = () => {
    switch (reminder.category) {
      case 'Obat Cacing':
        return {
          bg: 'bg-[#FFF1CC]',
          border: 'border-[#FFF1CC]',
          text: 'text-[#D97706]',
          icon: Pill,
        }
      case 'Vaksin Rabies':
      case 'Vaksin DHP':
        return {
          bg: 'bg-[#EEE6FA]',
          border: 'border-[#EEE6FA]',
          text: 'text-[#8B5CF6]',
          icon: Syringe,
        }
      case 'Obat Tetes Telinga':
      case 'Obat Rutin':
        return {
          bg: 'bg-[#FCE7E5]',
          border: 'border-[#FCE7E5]',
          text: 'text-[#E11D48]',
          icon: Pill,
        }
      case 'Pemeriksaan Kesehatan':
      default:
        return {
          bg: 'bg-[#E6F3E7]',
          border: 'border-[#E6F3E7]',
          text: 'text-[#21845F]',
          icon: Sparkles,
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
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl ${cat.bg} ${cat.text} flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`text-sm font-bold text-[#24312C] ${
                isCompleted ? 'line-through text-[#718078]' : ''
              }`}
            >
              {reminder.title}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${cat.bg} ${cat.text}`}
            >
              {reminder.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isCompleted
                  ? 'bg-[#E6F3E7] text-[#21845F]'
                  : reminder.status === 'Hari Ini'
                  ? 'bg-[#FCE7E5] text-[#E11D48] animate-pulse'
                  : 'bg-[#FAF6EF] text-[#718078] border border-[#E9E4DC]'
              }`}
            >
              {reminder.status}
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
                <span>{pet.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#21845F]" />
              <span>{formatDate(reminder.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#21845F]" />
              <span>{reminder.time} WIB</span>
            </div>
          </div>

          <p className="text-xs text-[#24312C] mt-2 bg-[#FAF6EF]/60 px-3 py-1.5 rounded-xl border border-[#E9E4DC]/40">
            <strong className="text-[#718078]">Aturan / Dosis:</strong>{' '}
            {reminder.dosageOrInstruction}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => onToggleComplete(reminder.id)}
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
              <span>Tandai Selesai</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onEdit(reminder)}
          className="p-1.5 rounded-xl text-[#718078] hover:text-[#21845F] hover:bg-[#FAF6EF] transition-colors"
          aria-label="Edit pengingat"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(reminder)}
          className="p-1.5 rounded-xl text-[#718078] hover:text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors"
          aria-label="Hapus pengingat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
