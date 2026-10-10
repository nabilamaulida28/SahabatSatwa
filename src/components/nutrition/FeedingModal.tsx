import React, { useState, useEffect } from 'react'
import { FeedingRecord, Pet, FoodType } from '../../types'
import { Modal } from '../common/Modal'
import { Utensils } from 'lucide-react'

interface FeedingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: FeedingRecord) => void
  pets: Pet[]
  defaultPetId?: string
}

const FOOD_TYPES: FoodType[] = [
  'Dry Food (Makanan Kering)',
  'Wet Food (Makanan Basah)',
  'Raw Food',
  'Snack & Camilan',
  'Lainnya',
]

export const FeedingModal: React.FC<FeedingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  defaultPetId,
}) => {
  const [petId, setPetId] = useState(defaultPetId || pets[0]?.id || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('08:00')
  const [foodType, setFoodType] = useState<FoodType>('Dry Food (Makanan Kering)')
  const [portion, setPortion] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setPetId(defaultPetId || pets[0]?.id || '')
    setDate(new Date().toISOString().split('T')[0])
    setTime('08:00')
    setFoodType('Dry Food (Makanan Kering)')
    setPortion('')
    setNotes('')
    setErrors({})
  }, [isOpen, defaultPetId, pets])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!petId) errs.petId = 'Pilih hewan'
    if (!date) errs.date = 'Tanggal wajib diisi'
    if (!portion.trim()) errs.portion = 'Porsi pakan wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const record: FeedingRecord = {
      id: 'f-' + Date.now(),
      petId,
      date,
      time,
      foodType,
      portion: portion.trim(),
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
      title="Catat Porsi & Jadwal Makan"
      subtitle="Pantau asupan nutrisi hewan kesayangan"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Pet */}
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

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Tanggal <span className="text-[#E11D48]">*</span>
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

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Jam Makan <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            />
          </div>
        </div>

        {/* Food Type */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Jenis Makanan
          </label>
          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value as FoodType)}
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          >
            {FOOD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Portion */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Porsi / Takaran <span className="text-[#E11D48]">*</span>
          </label>
          <input
            type="text"
            value={portion}
            onChange={(e) => setPortion(e.target.value)}
            placeholder="Contoh: 40 gram, 1 sachet (85g), 1 kaleng"
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.portion ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          />
          {errors.portion && <p className="text-[11px] text-[#E11D48] mt-1">{errors.portion}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Catatan (Merk / Reaksi Hewan)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Contoh: Royal Canin British Shorthair, makan dengan lahap..."
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] resize-none"
          />
        </div>

        {/* Action Buttons */}
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
            <Utensils className="w-4 h-4" />
            <span>Simpan Catatan Makan</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
