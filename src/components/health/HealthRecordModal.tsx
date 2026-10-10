import React, { useState, useEffect } from 'react'
import { HealthRecord, Pet } from '../../types'
import { Modal } from '../common/Modal'
import { ClipboardList, AlertCircle } from 'lucide-react'

interface HealthRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: HealthRecord) => void
  pets: Pet[]
  recordToEdit?: HealthRecord | null
}

export const HealthRecordModal: React.FC<HealthRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pets,
  recordToEdit,
}) => {
  const [petId, setPetId] = useState(pets[0]?.id || '')
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [treatment, setTreatment] = useState('')
  const [medication, setMedication] = useState('')
  const [vetOrClinic, setVetOrClinic] = useState('')
  const [notes, setNotes] = useState('')

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (recordToEdit) {
      setPetId(recordToEdit.petId)
      setDate(recordToEdit.date)
      setTitle(recordToEdit.title)
      setSymptoms(recordToEdit.symptoms)
      setDiagnosis(recordToEdit.diagnosis)
      setTreatment(recordToEdit.treatment)
      setMedication(recordToEdit.medication || '')
      setVetOrClinic(recordToEdit.vetOrClinic)
      setNotes(recordToEdit.notes || '')
    } else {
      setPetId(pets[0]?.id || '')
      setDate(new Date().toISOString().split('T')[0])
      setTitle('')
      setSymptoms('')
      setDiagnosis('')
      setTreatment('')
      setMedication('')
      setVetOrClinic('')
      setNotes('')
    }
    setErrors({})
  }, [recordToEdit, isOpen, pets])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!petId) errs.petId = 'Pilih hewan peliharaan'
    if (!title.trim()) errs.title = 'Jenis pemeriksaan wajib diisi'
    if (!date) errs.date = 'Tanggal pemeriksaan wajib diisi'
    if (!diagnosis.trim()) errs.diagnosis = 'Hasil pemeriksaan wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const recordData: HealthRecord = {
      id: recordToEdit ? recordToEdit.id : 'rec-' + Date.now(),
      petId,
      date,
      title: title.trim(),
      symptoms: symptoms.trim() || 'Kondisi umum normal',
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim() || 'Pemeriksaan rutin berkala',
      medication: medication.trim() || undefined,
      vetOrClinic: vetOrClinic.trim() || 'Pemeriksaan Mandiri / Klinik',
      notes: notes.trim() || undefined,
      createdAt: recordToEdit ? recordToEdit.createdAt : new Date().toISOString(),
    }

    onSave(recordData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recordToEdit ? 'Edit Catatan Kesehatan' : 'Tambah Catatan Riwayat Medis'}
      subtitle="Catat hasil pemeriksaan dokter hewan atau kondisi fisik"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medical disclaimer alert */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF6EF] border border-[#E9E4DC] text-xs text-[#718078]">
          <AlertCircle className="w-4 h-4 text-[#21845F] shrink-0 mt-0.5" />
          <span>
            Aplikasi ini menyimpan catatan yang dimasukkan pengguna atau dokter hewan, bukan diagnosis medis otomatis.
          </span>
        </div>

        {/* Row 1: Pet and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Tanggal Pemeriksaan <span className="text-[#E11D48]">*</span>
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
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Jenis Pemeriksaan / Kejadian <span className="text-[#E11D48]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pemeriksaan Rutin & Vaksin Rabies"
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.title ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          />
          {errors.title && <p className="text-[11px] text-[#E11D48] mt-1">{errors.title}</p>}
        </div>

        {/* Doctor or Clinic Name */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Nama Dokter Hewan / Klinik
          </label>
          <input
            type="text"
            value={vetOrClinic}
            onChange={(e) => setVetOrClinic(e.target.value)}
            placeholder="Contoh: Klinik Satwa Sehat - drh. Amanda"
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          />
        </div>

        {/* Symptoms / Condition */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Kondisi / Gejala Awal
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={2}
            placeholder="Gejala yang terlihat sebelum atau saat pemeriksaan..."
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] resize-none"
          />
        </div>

        {/* Diagnosis / Results */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Hasil Pemeriksaan <span className="text-[#E11D48]">*</span>
          </label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={2}
            placeholder="Contoh: Kondisi sehat optimal, suhu tubuh normal 38.2°C..."
            className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
              errors.diagnosis ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
            }`}
          />
          {errors.diagnosis && <p className="text-[11px] text-[#E11D48] mt-1">{errors.diagnosis}</p>}
        </div>

        {/* Treatment Given */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Tindakan / Pengobatan yang Diberikan
          </label>
          <input
            type="text"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Contoh: Pembersihan telinga, injeksi vitamin, atau scaling"
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          />
        </div>

        {/* Medication Prescribed */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Obat yang Diberikan (jika ada)
          </label>
          <input
            type="text"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            placeholder="Contoh: Nutri-Plus Gel 1 sdt/hari, Salep Gentamicin"
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Catatan Tambahan
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anjuran perawatan rumah atau jadwal kontrol..."
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
            <ClipboardList className="w-4 h-4" />
            <span>{recordToEdit ? 'Simpan Perubahan' : 'Simpan Catatan'}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
