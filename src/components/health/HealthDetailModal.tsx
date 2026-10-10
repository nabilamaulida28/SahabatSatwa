import React from 'react'
import { formatDate } from '../../lib/date'
import { HealthRecord, Pet } from '../../types'
import { Modal } from '../common/Modal'
import {
  Calendar,
  Building2,
  Stethoscope,
  Pill,
  FileText,
  AlertCircle,
  Edit2,
} from 'lucide-react'

interface HealthDetailModalProps {
  record: HealthRecord | null
  pet?: Pet
  isOpen: boolean
  onClose: () => void
  onEdit: (record: HealthRecord) => void
}

export const HealthDetailModal: React.FC<HealthDetailModalProps> = ({
  record,
  pet,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!record) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Catatan Kesehatan"
      subtitle={record.title}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Pet & Clinic Info Card */}
        <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#E9E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {pet && (
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-12 h-12 rounded-xl object-cover border border-white shadow-2xs"
              />
            )}
            <div>
              <h4 className="text-base font-bold text-[#24312C]">
                {pet?.name} ({pet?.type} · {pet?.breed})
              </h4>
              <p className="text-xs font-semibold text-[#21845F] flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{record.vetOrClinic}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#718078] bg-white px-3 py-1.5 rounded-xl border border-[#E9E4DC] self-start sm:self-center">
            <Calendar className="w-3.5 h-3.5 text-[#21845F]" />
            <span>{formatDate(record.date)}</span>
          </div>
        </div>

        {/* Symptoms */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E9E4DC]">
          <span className="text-xs font-bold text-[#718078] block mb-1">
            Kondisi / Gejala Saat Masuk:
          </span>
          <p className="text-[#24312C] leading-relaxed">{record.symptoms}</p>
        </div>

        {/* Diagnosis & Findings */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E9E4DC]">
          <span className="text-xs font-bold text-[#718078] block mb-1">
            Hasil Pemeriksaan / Diagnosis:
          </span>
          <p className="text-[#24312C] leading-relaxed font-medium">
            {record.diagnosis}
          </p>
        </div>

        {/* Treatment Given */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E9E4DC]">
          <span className="text-xs font-bold text-[#718078] block mb-1">
            Tindakan / Penanganan yang Diberikan:
          </span>
          <p className="text-[#24312C] leading-relaxed">{record.treatment}</p>
        </div>

        {/* Medication */}
        {record.medication && (
          <div className="p-3.5 rounded-xl bg-[#FCE7E5]/40 border border-[#FCE7E5] flex items-start gap-2.5">
            <Pill className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#E11D48] block mb-0.5">
                Obat & Resep Lanjutan:
              </span>
              <p className="text-[#24312C] leading-relaxed font-medium">
                {record.medication}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {record.notes && (
          <div className="p-3.5 rounded-xl bg-[#FAF6EF]/60 border border-[#E9E4DC]">
            <span className="text-xs font-bold text-[#718078] block mb-1">
              Catatan Dokter / Anjuran:
            </span>
            <p className="text-[#24312C] leading-relaxed italic">{record.notes}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9E4DC]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#718078] hover:text-[#24312C] bg-[#FAF6EF] hover:bg-[#E9E4DC]/60 rounded-xl transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(record)
            }}
            className="px-4 py-2 text-sm font-bold text-white bg-[#21845F] hover:bg-[#19694b] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Catatan</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
