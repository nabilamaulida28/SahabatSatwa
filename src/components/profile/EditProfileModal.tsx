import React, { useState, useEffect, useRef } from 'react'
import { OwnerProfile } from '../../types'
import { Modal } from '../common/Modal'
import { User, Camera, Upload, Sparkles, Check } from 'lucide-react'
import { ChangeAvatarModal } from './ChangeAvatarModal'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profile: OwnerProfile) => void
  currentProfile: OwnerProfile
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProfile,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setName(currentProfile.name)
    setEmail(currentProfile.email)
    setPhone(currentProfile.phone)
    setCity(currentProfile.city)
    setAddress(currentProfile.address)
    setBio(currentProfile.bio)
    setAvatar(currentProfile.avatar)
    setErrors({})
  }, [currentProfile, isOpen])

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!name.trim()) errs.name = 'Nama pemilik wajib diisi'
    if (!email.trim() || !email.includes('@')) errs.email = 'Email tidak valid'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const updated: OwnerProfile = {
      ...currentProfile,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      bio: bio.trim(),
      avatar: avatar.trim() || currentProfile.avatar,
    }

    onSave(updated)
    onClose()
  }

  // Quick file upload from device
  const handleQuickFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const compressed = canvas.toDataURL('image/jpeg', 0.88)
          setAvatar(compressed)
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Profil Pemilik"
        subtitle="Perbarui data kontak, bio, dan foto profil Anda"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section with Camera and Upload Options */}
          <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#E9E4DC]">
            <label className="block text-xs font-bold text-[#24312C] mb-2.5">
              Foto Profil Pemilik
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview with Camera badge */}
              <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                <img
                  src={avatar}
                  alt={name || 'Avatar'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-soft group-hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = currentProfile.avatar
                  }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#21845F] text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Photo Action Buttons */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Buka Kamera / Opsi Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E6F3E7] text-[#24312C] hover:text-[#21845F] text-xs font-bold border border-[#E9E4DC] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleQuickFileUpload}
                  />
                </div>
                <p className="text-[11px] text-[#718078]">
                  Ambil foto selfie langsung via kamera, pilih dari galeri, atau gunakan URL.
                </p>
              </div>
            </div>

            {/* URL Input */}
            <div className="mt-3 pt-3 border-t border-[#E9E4DC]/60">
              <label className="block text-[11px] font-semibold text-[#718078] mb-1">
                Atau tempel URL Gambar:
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-white border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] focus:outline-none focus:ring-1 focus:ring-[#21845F]"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Nama Lengkap <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                errors.name ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-[#E11D48] mt-1">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24312C] mb-1">
                Email <span className="text-[#E11D48]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-[#FAF6EF] border rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 ${
                  errors.email ? 'border-[#E11D48]' : 'border-[#E9E4DC] focus:border-[#21845F]'
                }`}
              />
              {errors.email && <p className="text-[11px] text-[#E11D48] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24312C] mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
              />
            </div>
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24312C] mb-1">
                Kota
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24312C] mb-1">
                Alamat Lengkap
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-[#24312C] mb-1">
              Bio / Catatan Pribadi
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
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
              <User className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Avatar Sub-Modal */}
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={avatar}
        onSave={(newUrl) => setAvatar(newUrl)}
      />
    </>
  )
}
