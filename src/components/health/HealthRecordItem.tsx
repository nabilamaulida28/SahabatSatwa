import React from 'react'
import { formatDate } from '../../lib/date'
import { HealthRecord, Pet } from '../../types'
import {
  ClipboardList,
  Calendar,
  Building2,
  Stethoscope,
  Pill,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react'

interface HealthRecordItemProps {
  record: HealthRecord
  pet?: Pet
  onViewDetail: (record: HealthRecord) => void
  onEdit: (record: HealthRecord) => void
  onDelete: (record: HealthRecord) => void
}

export const HealthRecordItem: React.FC<HealthRecordItemProps> = ({
  record,
  pet,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E9E4DC] p-5 shadow-soft hover:shadow-soft-lg hover:border-[#21845F]/30 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Title & Pet info */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF1CC] text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#24312C]">{record.title}</h3>
              {pet && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F3E7] text-[#21845F] border border-[#21845F]/20">
                  {pet.name} ({pet.type})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#718078]">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#21845F]" />
                <span>{formatDate(record.date)}</span>
              </div>
              {record.vetOrClinic && (
                <div className="flex items-center gap-1 font-semibold text-[#21845F]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{record.vetOrClinic}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 self-end sm:self-start">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="p-1.5 rounded-xl text-[#718078] hover:text-[#21845F] hover:bg-[#FAF6EF] transition-colors"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(record)}
            className="p-1.5 rounded-xl text-[#718078] hover:text-[#21845F] hover:bg-[#FAF6EF] transition-colors"
            title="Edit Catatan"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(record)}
            className="p-1.5 rounded-xl text-[#718078] hover:text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors"
            title="Hapus Catatan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary grid */}
      <div className="mt-4 pt-3.5 border-t border-[#E9E4DC]/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#FAF6EF]/60 p-2.5 rounded-xl">
          <span className="font-bold text-[#718078] block mb-0.5">Kondisi / Gejala:</span>
          <p className="text-[#24312C] leading-relaxed">{record.symptoms}</p>
        </div>

        <div className="bg-[#FAF6EF]/60 p-2.5 rounded-xl">
          <span className="font-bold text-[#718078] block mb-0.5">Tindakan / Pengobatan:</span>
          <p className="text-[#24312C] leading-relaxed">
            {record.treatment || 'Pemeriksaan standar tanpa tindakan khusus'}
          </p>
        </div>
      </div>

      {record.medication && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-[#718078] bg-[#FCE7E5]/40 px-3 py-1.5 rounded-xl border border-[#FCE7E5]">
          <Pill className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
          <span>
            <strong className="text-[#24312C]">Obat:</strong> {record.medication}
          </span>
        </div>
      )}
    </div>
  )
}
