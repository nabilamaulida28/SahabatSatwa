import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { EditProfileModal } from '../components/profile/EditProfileModal'
import { ProfilePetsIllustration } from '../components/illustrations/ProfilePetsIllustration'
import { useToast } from '../components/common/Toast'
import { OwnerProfile } from '../types'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  PawPrint,
  Heart,
  ShieldCheck,
  Edit2,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react'

export const Route = createFileRoute('/profil')({
  component: ProfilPemilikPage,
})

function ProfilPemilikPage() {
  const {
    owner,
    saveOwner,
    pets,
    schedules,
    healthRecords,
    resetAllData,
  } = useSatwaStore()
  const { showToast } = useToast()

  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleSaveProfile = (updated: OwnerProfile) => {
    saveOwner(updated)
    showToast('Profil pemilik berhasil diperbarui!')
  }

  const handleReset = () => {
    if (window.confirm('Kembalikan semua data ke setelan demo awal?')) {
      resetAllData()
      showToast('Data demo berhasil direset ke setelan awal!', 'info')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6F3E7] text-[#21845F] text-xs font-bold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Akun Pengguna</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312C] tracking-tight">
            Profil Pemilik
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-0.5">
            Kelola informasi pribadimu di sini.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Profil</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E9E4DC] p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with Cute Border */}
          <div className="relative">
            <img
              src={owner.avatar}
              alt={owner.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[#E6F3E7] shadow-soft"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#21845F] text-white flex items-center justify-center shadow-xs">
              <PawPrint className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Identity Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24312C]">
                {owner.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F3E7] text-[#21845F] border border-[#21845F]/20">
                Pemilik Hewan
              </span>
            </div>

            <p className="text-sm text-[#718078] max-w-xl leading-relaxed">
              {owner.bio}
            </p>

            {/* Contact chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EF] text-[#24312C] border border-[#E9E4DC]">
                <Mail className="w-4 h-4 text-[#21845F]" />
                <span className="font-semibold">{owner.email}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EF] text-[#24312C] border border-[#E9E4DC]">
                <Phone className="w-4 h-4 text-[#21845F]" />
                <span className="font-semibold">{owner.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EF] text-[#24312C] border border-[#E9E4DC]">
                <MapPin className="w-4 h-4 text-[#21845F]" />
                <span className="font-semibold">{owner.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#E9E4DC]">
          <div className="p-4 rounded-2xl bg-[#E6F3E7]/60 border border-[#21845F]/20 text-center">
            <PawPrint className="w-5 h-5 text-[#21845F] mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-[#21845F]">
              {pets.length}
            </span>
            <p className="text-xs font-bold text-[#718078] mt-0.5">Hewan Kesayangan</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EEE6FA]/60 border border-[#8B5CF6]/20 text-center">
            <Calendar className="w-5 h-5 text-[#8B5CF6] mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-[#8B5CF6]">
              {schedules.length}
            </span>
            <p className="text-xs font-bold text-[#718078] mt-0.5">Jadwal Perawatan</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF1CC]/60 border border-[#D97706]/20 text-center">
            <Heart className="w-5 h-5 text-[#D97706] mx-auto mb-1" />
            <span className="text-2xl font-extrabold text-[#D97706]">
              {healthRecords.length}
            </span>
            <p className="text-xs font-bold text-[#718078] mt-0.5">Catatan Medis</p>
          </div>
        </div>
      </div>

      {/* Account Info and Storage Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Akun */}
        <div className="bg-white rounded-3xl border border-[#E9E4DC] p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E9E4DC]">
            <ShieldCheck className="w-5 h-5 text-[#21845F]" />
            <h3 className="text-base font-extrabold text-[#24312C]">Informasi Akun</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-2 border-b border-[#E9E4DC]/50">
              <span className="text-[#718078]">Status Akun:</span>
              <span className="font-bold text-[#21845F] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#21845F]" />
                Aktif (Demo Mode)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#E9E4DC]/50">
              <span className="text-[#718078]">Penyimpanan Data:</span>
              <span className="font-bold text-[#24312C]">Browser LocalStorage</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#E9E4DC]/50">
              <span className="text-[#718078]">Alamat Lengkap:</span>
              <span className="font-bold text-[#24312C] text-right truncate max-w-[200px]">
                {owner.address}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#718078]">Bahasa Aplikasi:</span>
              <span className="font-bold text-[#24312C]">Bahasa Indonesia</span>
            </div>
          </div>
        </div>

        {/* Demo Data Management */}
        <div className="bg-white rounded-3xl border border-[#E9E4DC] p-6 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#E9E4DC]">
              <Info className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-base font-extrabold text-[#24312C]">Pengaturan Data Demo</h3>
            </div>
            <p className="text-xs text-[#718078] mt-3 leading-relaxed">
              Aplikasi ini saat ini berjalan secara lokal menggunakan penyimpanan peramban (LocalStorage) tanpa koneksi server backend multi-pengguna. Anda bebas menambah, mengedit, atau menghapus data.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E9E4DC]">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6EF] hover:bg-[#FCE7E5] text-[#E11D48] font-bold text-xs border border-[#E9E4DC] hover:border-[#E11D48]/30 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Kembali ke Data Awal Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warm Closing Section with Cute Pet Illustration */}
      <section className="bg-gradient-to-r from-[#FFF9EE] via-[#FAF6EF] to-[#E6F3E7] rounded-3xl border border-[#E9E4DC] p-8 text-center flex flex-col items-center justify-center shadow-soft">
        <ProfilePetsIllustration className="w-48 sm:w-56 h-auto mb-3" />
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#21845F] tracking-tight">
          “Terima kasih sudah menjadi sahabat satwa yang baik ♡”
        </h3>
        <p className="text-xs sm:text-sm text-[#718078] mt-2 max-w-md">
          Hewan kesayanganmu merasakan setiap kasih sayang dan kepedulian yang kamu berikan setiap hari.
        </p>
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveProfile}
        currentProfile={owner}
      />
    </div>
  )
}
