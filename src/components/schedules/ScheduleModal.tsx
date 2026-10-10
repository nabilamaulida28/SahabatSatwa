import React, { useState, useEffect } from 'react'
import { CareSchedule, Pet, ScheduleCategory, RepeatInterval, ScheduleStatus } from '../../types'
import { Modal } from '../common/Modal'
import { Calendar, Clock, Plus } from 'lucide-react'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (schedule: CareSchedule) => void
  pets: Pet[]
  scheduleToEdit?: CareSchedule | null
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  scheduleToEdit,
}) => {
  const [petId, setPetId] = useState(pets[0]?.id || '')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ScheduleCategory>('Vaksin')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [notes, setNotes] = useState('')
  const [repeat, setRepeat] = useState<RepeatInterval>('Tidak berulang')
  const [status, setStatus] = useState<ScheduleStatus>('Akan Datang')

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (scheduleToEdit) {
      setPetId(scheduleToEdit.petId)
      setTitle(scheduleToEdit.title)
      setCategory(scheduleToEdit.category)
      setDate(scheduleToEdit.date)
      setTime(scheduleToEdit.time)
      setNotes(scheduleToEdit.notes || '')
      setRepeat(scheduleToEdit.repeat)
      setStatus(scheduleToEdit.status)
    } else {
      setPetId(pets[0]?.id || '')
      setTitle('')
      setCategory('Vaksin')
      setDate(new Date().toISOString().split('T')[0])
      setTime('10:00')
      setNotes('')
      setRepeat('Tidak berulang')
      setStatus('Akan Datang')
    }
    setErrors({})
  }, [scheduleToEdit, isOpen, pets])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!petId) errs.petId = 'Pilih hewan peliharaan'
    if (!title.trim()) errs.title = 'Nama perawatan wajib diisi'
    if (!date) errs.date = 'Tanggal wajib diisi'
    if (!time) errs.time = 'Jam wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const scheduleData: CareSchedule = {
      id: scheduleToEdit ? scheduleToEdit.id : 'sched-' + Date.now(),
      petId,
      title: title.trim(),
      category,
      date,
      time,
      notes: notes.trim(),
      repeat,
      status,
      createdAt: scheduleToEdit ? scheduleToEdit.createdAt : new Date().toISOString(),
    }

    onSave(scheduleData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={scheduleToEdit ? 'Edit Jadwal Perawatan' : 'Tambah Jadwal Perawatan'}
      subtitle="Kelola waktu perawatan hewan dengan teratur"
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
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.petId ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          >
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type} - {p.breed})
              </option>
            ))}
          </select>
          {errors.petId && <p className="text-[11px] text-[#E11D48] mt-1">{errors.petId}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Nama Perawatan / Kegiatan <span className="text-[#E11D48]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Vaksin Rabies & Cek Imun"
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
              Kategori Perawatan <span className="text-[#E11D48]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ScheduleCategory)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            >
              <option value="Vaksin">Vaksin</option>
              <option value="Obat">Obat</option>
              <option value="Grooming">Grooming</option>
              <option value="Pemeriksaan">Pemeriksaan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Status Jadwal
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            >
              <option value="Akan Datang">Akan Datang</option>
              <option value="Selesai">Selesai</option>
              <option value="Terlewat">Terlewat</option>
            </select>
          </div>
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
              Jam <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.time ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            {errors.time && <p className="text-[11px] text-[#E11D48] mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Repeat Interval */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Pengulangan
          </label>
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as RepeatInterval)}
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          >
            <option value="Tidak berulang">Tidak berulang</option>
            <option value="Setiap Minggu">Setiap Minggu</option>
            <option value="Setiap Bulan">Setiap Bulan</option>
            <option value="Setiap Tahun">Setiap Tahun</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Catatan Tambahan (Klinik / Dokter / Persiapan)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Contoh: Klinik Satwa Sehat bersama drh. Amanda. Bawa buku vaksinasi."
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
            <Calendar className="w-4 h-4" />
            <span>{scheduleToEdit ? 'Simpan Perubahan' : 'Jadwalkan Perawatan'}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
