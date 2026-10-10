import React, { useState, useEffect } from 'react'
import { OwnerProfile } from '../../types'
import { Modal } from '../common/Modal'
import { User } from 'lucide-react'

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profil Pemilik"
      subtitle="Perbarui data kontak dan informasi akun Anda"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Avatar URL */}
        <div>
          <label className="block text-xs font-bold text-[#24312C] mb-1">
            URL Foto Profil
          </label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-sm text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
          />
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
  )
}
