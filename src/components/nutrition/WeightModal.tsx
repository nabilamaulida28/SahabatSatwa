import React, { useState, useEffect } from 'react'
import { WeightRecord, Pet } from '../../types'
import { Modal } from '../common/Modal'
import { todayStr } from '../../lib/date'
import { Scale } from 'lucide-react'

interface WeightModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: WeightRecord) => void
  pets: Pet[]
  defaultPetId?: string
}

export const WeightModal: React.FC<WeightModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  defaultPetId,
}) => {
  const [petId, setPetId] = useState(defaultPetId || pets[0]?.id || '')
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setPetId(defaultPetId || pets[0]?.id || '')
    setDate(todayStr())
    setWeight('')
    setNotes('')
    setErrors({})
  }, [isOpen, defaultPetId, pets])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!petId) errs.petId = 'Pilih hewan'
    if (!date) errs.date = 'Tanggal wajib diisi'
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      errs.weight = 'Masukkan berat yang valid (contoh: 4.2)'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const record: WeightRecord = {
      id: 'w-' + Date.now(),
      petId,
      date,
      weight: parseFloat(weight),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    }

    onSave(record)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Berat Badan Baru"
      subtitle="Pantau grafik dan perkembangan berat hewan"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pet selection */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Pilih Hewan <span className="text-[#E11D48]">*</span>
          </label>
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type} - {p.breed})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Tanggal Pengukuran <span className="text-[#E11D48]">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.date ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          />
          {errors.date && <p className="text-[11px] text-[#E11D48] mt-1">{errors.date}</p>}
        </div>

        {/* Weight in kg */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Berat Badan (kg) <span className="text-[#E11D48]">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.05"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 4.25"
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.weight ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#718078]">
              kg
            </span>
          </div>
          {errors.weight && <p className="text-[11px] text-[#E11D48] mt-1">{errors.weight}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Catatan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Contoh: Penimbangan rutin sebelum sarapan pagi..."
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9E4DC]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#718078] hover:text-[#24312C] bg-[#FAF6EF] hover:bg-[#E9E4DC]/60 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold text-white bg-[#21845F] hover:bg-[#19694b] rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            <span>Simpan Berat Badan</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
