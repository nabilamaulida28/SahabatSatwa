import React, { useState, useEffect, useRef } from 'react'
import { Pet, PetType, PetGender } from '../../types'
import { Modal } from '../common/Modal'
import { PawPrint, Image as ImageIcon, Camera, Upload } from 'lucide-react'
import { todayStr, addMonths, ageFromBirthDate } from '../../lib/date'
import { CameraCapture } from '../profile/CameraCapture'

interface PetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pet: Pet) => void
  petToEdit?: Pet | null
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80', // Cute Cat Grey
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', // White Persian Cat
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80', // Golden Puppy
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', // Playful Dog
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80', // Cute Bunny Rabbit
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80', // Tabby Cat
]

export const PetModal: React.FC<PetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  petToEdit,
}) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<PetType>('Kucing')
  const [breed, setBreed] = useState('')
  const [gender, setGender] = useState<PetGender>('Jantan')
  const [birthDate, setBirthDate] = useState('')
  const [ageString, setAgeString] = useState('')
  const [weight, setWeight] = useState('')
  const [color, setColor] = useState('')
  const [photo, setPhoto] = useState(PRESET_AVATARS[0])
  const [notes, setNotes] = useState('')
  const [statusBadge, setStatusBadge] = useState('Vaksin Lengkap')
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name)
      setType(petToEdit.type)
      setBreed(petToEdit.breed)
      setGender(petToEdit.gender)
      setBirthDate(petToEdit.birthDate)
      setAgeString(petToEdit.ageString)
      setWeight(petToEdit.currentWeight.toString())
      setColor(petToEdit.color)
      setPhoto(petToEdit.photo)
      setNotes(petToEdit.notes || '')
      setStatusBadge(petToEdit.statusBadge)
    } else {
      setName('')
      setType('Kucing')
      setBreed('')
      setGender('Jantan')
      setBirthDate(addMonths(todayStr(), -12))
      setAgeString(ageFromBirthDate(addMonths(todayStr(), -12)))
      setWeight('3.5')
      setColor('')
      setPhoto(PRESET_AVATARS[0])
      setNotes('')
      setStatusBadge('Vaksin Lengkap')
    }
    setErrors({})
  }, [petToEdit, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!name.trim()) newErrors.name = 'Nama hewan wajib diisi'
    if (!breed.trim()) newErrors.breed = 'Ras hewan wajib diisi'
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.weight = 'Berat badan harus angka positif (contoh: 4.2)'
    }
    if (!birthDate) newErrors.ageString = 'Tanggal lahir wajib diisi'
    else if (birthDate > todayStr()) newErrors.ageString = 'Tanggal lahir tidak boleh di masa depan'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const numWeight = parseFloat(weight)

    const petData: Pet = {
      id: petToEdit ? petToEdit.id : 'pet-' + Date.now(),
      name: name.trim(),
      type,
      breed: breed.trim(),
      gender,
      birthDate,
      ageString: ageFromBirthDate(birthDate) || ageString.trim(),
      currentWeight: numWeight,
      initialWeight: petToEdit ? petToEdit.initialWeight : numWeight,
      color: color.trim() || 'Standar',
      photo: photo.trim() || PRESET_AVATARS[0],
      notes: notes.trim(),
      statusBadge,
      createdAt: petToEdit ? petToEdit.createdAt : new Date().toISOString(),
    }

    onSave(petData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={petToEdit ? 'Edit Data Hewan' : 'Tambah Hewan Baru'}
      subtitle="Isi informasi hewan kesayanganmu dengan lengkap"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Selector with Camera & Upload */}
        <div className="p-3 bg-[#FAF6EF] rounded-2xl border border-[#E9E4DC]">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[#24312C]">
              Foto Hewan Peliharaan
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#21845F] hover:bg-[#19694b] text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Kamera</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E6F3E7] text-[#24312C] hover:text-[#21845F] text-[11px] font-bold border border-[#E9E4DC] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    const img = new Image()
                    img.onload = () => {
                      const canvas = document.createElement('canvas')
                      const size = Math.min(img.width, img.height)
                      canvas.width = 400
                      canvas.height = 400
                      const ctx = canvas.getContext('2d')
                      if (ctx) {
                        const sx = (img.width - size) / 2
                        const sy = (img.height - size) / 2
                        ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400)
                        setPhoto(canvas.toDataURL('image/jpeg', 0.88))
                      }
                    }
                    img.src = reader.result as string
                  }
                  reader.readAsDataURL(file)
                }}
              />
            </div>
          </div>

          {/* Camera live capture preview if active */}
          {isCameraOpen ? (
            <div className="p-3 bg-white rounded-2xl border border-[#E9E4DC] mb-3">
              <CameraCapture
                onCapture={(dataUrl) => {
                  setPhoto(dataUrl)
                  setIsCameraOpen(false)
                }}
                onCancel={() => setIsCameraOpen(false)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-2">
              <img
                src={photo}
                alt="Selected"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-2xs shrink-0"
              />
              <div className="flex-1 overflow-x-auto pb-1">
                <span className="text-[10px] text-[#718078] block mb-1">Preset Cepat:</span>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(url)}
                      className={`relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border-2 transition-transform ${
                        photo === url
                          ? 'border-[#21845F] scale-105 shadow-xs'
                          : 'border-[#E9E4DC] hover:opacity-80'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="Atau masukkan URL foto kustom..."
            className="w-full px-3 py-1.5 bg-white border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] focus:outline-none focus:ring-1 focus:ring-[#21845F]"
          />
        </div>

        {/* Row 1: Name & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Nama Hewan <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Mochi"
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.name ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-[#E11D48] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Jenis Hewan <span className="text-[#E11D48]">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PetType)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            >
              <option value="Kucing">Kucing</option>
              <option value="Anjing">Anjing</option>
              <option value="Kelinci">Kelinci</option>
              <option value="Hamster">Hamster</option>
              <option value="Burung">Burung</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Row 2: Breed & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Ras / Spesies <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Contoh: British Shorthair"
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.breed ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            {errors.breed && <p className="text-[11px] text-[#E11D48] mt-1">{errors.breed}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Jenis Kelamin
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('Jantan')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  gender === 'Jantan'
                    ? 'bg-[#E6F3E7] border-[#21845F] text-[#21845F]'
                    : 'bg-[#FAF6EF] border-[#E9E4DC] text-[#718078]'
                }`}
              >
                ♂ Jantan
              </button>
              <button
                type="button"
                onClick={() => setGender('Betina')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  gender === 'Betina'
                    ? 'bg-[#FCE7E5] border-[#E11D48] text-[#E11D48]'
                    : 'bg-[#FAF6EF] border-[#E9E4DC] text-[#718078]'
                }`}
              >
                ♀ Betina
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Age String & Current Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Tanggal Lahir / Perkiraan <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              max={todayStr()}
              onChange={(e) => {
                setBirthDate(e.target.value)
                setAgeString(ageFromBirthDate(e.target.value))
              }}
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.ageString ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            {errors.ageString ? (
              <p className="text-[11px] text-[#E11D48] mt-1">{errors.ageString}</p>
            ) : (
              ageString && <p className="text-[11px] text-[#718078] mt-1">Umur saat ini: {ageString}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Berat Badan (kg) <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 4.2"
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.weight ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            {errors.weight && <p className="text-[11px] text-[#E11D48] mt-1">{errors.weight}</p>}
          </div>
        </div>

        {/* Row 4: Color & Status Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Warna & Ciri Fisik
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Contoh: Abu-abu keperakan (Blue)"
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Status Perawatan
            </label>
            <select
              value={statusBadge}
              onChange={(e) => setStatusBadge(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
            >
              <option value="Vaksin Lengkap">Vaksin Lengkap</option>
              <option value="Menunggu Booster">Menunggu Booster</option>
              <option value="Perawatan Rutin">Perawatan Rutin</option>
              <option value="Observasi">Observasi</option>
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Informasi kebiasaan, alergi, atau kesukaan hewan..."
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
            <PawPrint className="w-4 h-4" />
            <span>{petToEdit ? 'Simpan Perubahan' : 'Tambahkan Hewan'}</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
