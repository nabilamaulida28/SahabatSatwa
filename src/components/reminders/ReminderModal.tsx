import React, { useState, useEffect } from 'react'
import { Reminder, Pet, ReminderCategory, ReminderStatus } from '../../types'
import { Modal } from '../common/Modal'
import { Bell, Pill, Clock } from 'lucide-react'

interface ReminderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (reminder: Reminder) => void
  pets: Pet[]
  reminderToEdit?: Reminder | null
}

const CATEGORIES: ReminderCategory[] = [
  'Obat Cacing',
  'Vaksin Rabies',
  'Vaksin DHP',
  'Obat Tetes Telinga',
  'Obat Rutin',
  'Pemeriksaan Kesehatan',
  'Lainnya',
]

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  reminderToEdit,
}) => {
  const [petId, setPetId] = useState(pets[0]?.id || '')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ReminderCategory>('Obat Cacing')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [dosageOrInstruction, setDosageOrInstruction] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<ReminderStatus>('Hari Ini')

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (reminderToEdit) {
      setPetId(reminderToEdit.petId)
      setTitle(reminderToEdit.title)
      setCategory(reminderToEdit.category)
      setDate(reminderToEdit.date)
      setTime(reminderToEdit.time)
      setDosageOrInstruction(reminderToEdit.dosageOrInstruction)
      setNotes(reminderToEdit.notes || '')
      setStatus(reminderToEdit.status)
    } else {
      setPetId(pets[0]?.id || '')
      setTitle('')
      setCategory('Obat Cacing')
      setDate(new Date().toISOString().split('T')[0])
      setTime('09:00')
      setDosageOrInstruction('')
      setNotes('')
      setStatus('Hari Ini')
    }
    setErrors({})
  }, [reminderToEdit, isOpen, pets])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!petId) errs.petId = 'Pilih hewan peliharaan'
    if (!title.trim()) errs.title = 'Nama pengingat wajib diisi'
    if (!date) errs.date = 'Tanggal wajib diisi'
    if (!dosageOrInstruction.trim()) {
      errs.dosageOrInstruction = 'Aturan pemberian obat/vaksin wajib diisi'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const reminderData: Reminder = {
      id: reminderToEdit ? reminderToEdit.id : 'rem-' + Date.now(),
      petId,
      title: title.trim(),
      category,
      date,
      time,
      dosageOrInstruction: dosageOrInstruction.trim(),
      notes: notes.trim() || undefined,
      status,
      isCompleted: status === 'Selesai',
      createdAt: reminderToEdit ? reminderToEdit.createdAt : new Date().toISOString(),
    }

    onSave(reminderData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reminderToEdit ? 'Edit Pengingat' : 'Tambah Pengingat Vaksin & Obat'}
      subtitle="Pastikan jadwal obat dan vaksin tidak terlewat"
      maxWidth="max-w-lg"
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

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Nama Pengingat / Nama Obat <span className="text-[#E11D48]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Obat Cacing Rutin Mochi"
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.title ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          />
          {errors.title && <p className="text-[11px] text-[#E11D48] mt-1">{errors.title}</p>}
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Kategori Pengingat
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReminderCategory)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Status Waktu
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReminderStatus)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            >
              <option value="Hari Ini">Hari Ini</option>
              <option value="Mendatang">Mendatang</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Tanggal Pengingat <span className="text-[#E11D48]">*</span>
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
              Jam
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            />
          </div>
        </div>

        {/* Dosage and Instruction */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Aturan Pemberian / Dosis <span className="text-[#E11D48]">*</span>
          </label>
          <input
            type="text"
            value={dosageOrInstruction}
            onChange={(e) => setDosageOrInstruction(e.target.value)}
            placeholder="Contoh: 1 tablet dicampur makanan basah pagi hari"
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.dosageOrInstruction
                ? 'border-[#E11D48]'
                : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          />
          {errors.dosageOrInstruction && (
            <p className="text-[11px] text-[#E11D48] mt-1">{errors.dosageOrInstruction}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Catatan Tambahan
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Contoh: Jangan diberikan saat perut kosong..."
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
            <Bell className="w-4 h-4" />
            <span>{reminderToEdit ? 'Simpan Perubahan' : 'Buat Pengingat'}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
