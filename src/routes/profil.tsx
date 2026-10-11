import React, { useState, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSatwaStore } from '../lib/storage'
import { useAuth } from '../lib/auth'
import { EditProfileModal } from '../components/profile/EditProfileModal'
import { ProfilePetsIllustration } from '../components/illustrations/ProfilePetsIllustration'
import { useToast } from '../components/common/Toast'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { todayStr } from '../lib/date'
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
  Download,
  Upload,
  Camera,
  LogIn,
  LogOut,
} from 'lucide-react'
import { ChangeAvatarModal } from '../components/profile/ChangeAvatarModal'

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
    exportData,
    importData,
  } = useSatwaStore()
  const { user, signOut } = useAuth()
  const { showToast } = useToast()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [pendingImport, setPendingImport] = useState<unknown | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSaveProfile = (updated: OwnerProfile) => {
    saveOwner(updated)
    showToast('Profil pemilik berhasil diperbarui!')
  }

  const handleReset = () => setIsResetOpen(true)

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sahabatsatwa-backup-${todayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup berhasil diunduh!')
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // izinkan memilih file yang sama lagi
    if (!file) return
    try {
      setPendingImport(JSON.parse(await file.text()))
    } catch {
      showToast('File bukan JSON yang valid.', 'error')
    }
  }

  const handleConfirmImport = () => {
    const result = importData(pendingImport)
    if (result.ok) showToast('Data berhasil dipulihkan dari backup!')
    else showToast(result.error, 'error')
    setPendingImport(null)
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

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#E6F3E7] text-[#24312C] hover:text-[#21845F] font-bold text-xs sm:text-sm border border-[#E9E4DC] shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#21845F]" />
            <span>Ganti Foto</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-150 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profil</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E9E4DC] p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with Cute Border and Camera Button */}
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsAvatarModalOpen(true)}
            title="Klik untuk ganti foto atau ambil foto dengan kamera"
          >
            <img
              src={owner.avatar}
              alt={owner.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[#E6F3E7] shadow-soft group-hover:scale-102 transition-transform duration-200"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 backdrop-blur-2xs">
              <Camera className="w-6 h-6" />
              <span>Ganti Foto</span>
            </div>
            {/* Camera badge trigger */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsAvatarModalOpen(true)
              }}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#21845F] hover:bg-[#19694b] text-white flex items-center justify-center shadow-soft hover:scale-110 transition-transform cursor-pointer"
              title="Ambil foto kamera atau unggah"
            >
              <Camera className="w-4 h-4" />
            </button>
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

      {/* Sesi Akun & Cadangan Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Akun & Sesi */}
        <div className="bg-white rounded-3xl border border-[#E9E4DC] p-6 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E4DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEE6FA] text-[#8B5CF6] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#24312C] leading-none">Sesi Akun</h3>
                  <p className="text-[11px] text-[#718078] mt-1">Status Login & Akses</p>
                </div>
              </div>

              <Link
                to="/masuk"
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF6EF] hover:bg-[#E6F3E7] text-[#21845F] border border-[#E9E4DC] transition-colors"
              >
                {user ? 'Ganti Akun' : 'Masuk'}
              </Link>
            </div>

            <div className="space-y-2.5 text-xs mt-3">
              <div className="flex items-center justify-between py-1.5 border-b border-[#E9E4DC]/50">
                <span className="text-[#718078]">Nama Lengkap:</span>
                <span className="font-bold text-[#24312C]">{owner.name}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E9E4DC]/50">
                <span className="text-[#718078]">Email:</span>
                <span className="font-bold text-[#24312C] truncate max-w-[180px]">
                  {user ? user.email : owner.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E9E4DC]/50">
                <span className="text-[#718078]">Kota / Domisili:</span>
                <span className="font-bold text-[#24312C]">{owner.city}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  signOut()
                  showToast('Anda telah keluar dari akun.', 'info')
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <Link
                to="/masuk"
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-3 rounded-xl bg-[#FAF6EF] hover:bg-[#FCE7E5] text-[#718078] hover:text-[#E11D48] font-bold text-xs border border-[#E9E4DC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Reset data ke setelan awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Cadangan Data */}
        <div className="bg-white rounded-3xl border border-[#E9E4DC] p-6 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#E9E4DC]">
              <Download className="w-5 h-5 text-[#21845F]" />
              <h3 className="text-base font-extrabold text-[#24312C]">Cadangkan & Pulihkan Data</h3>
            </div>
            <p className="text-xs text-[#718078] leading-relaxed mt-2">
              Data tersimpan di perangkat ini. Unduh cadangan secara berkala dalam format JSON, lalu impor kembali kapan saja untuk memulihkan catatan satwa Anda.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Unduh Backup
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#FAF6EF] hover:bg-[#E6F3E7] text-[#24312C] font-bold text-xs border border-[#E9E4DC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#21845F]" />
              Impor Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={() => {
          resetAllData()
          showToast('Data berhasil direset ke setelan awal!', 'info')
        }}
        title="Reset Data?"
        message="Semua data yang kamu tambahkan atau ubah akan dikembalikan ke setelan awal."
        confirmText="Ya, Reset"
      />

      <ConfirmDialog
        isOpen={pendingImport !== null}
        onClose={() => setPendingImport(null)}
        onConfirm={handleConfirmImport}
        title="Pulihkan dari Backup?"
        message="Data yang ada saat ini akan digantikan dengan isi berkas backup yang Anda pilih."
        confirmText="Ya, Pulihkan"
        isDestructive={false}
        subtitle="Pastikan berkas backup berasal dari sumber yang tepercaya."
      />

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

      {/* Change Avatar / Camera Modal */}
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={owner.avatar}
        onSave={(newAvatar) => {
          saveOwner({ ...owner, avatar: newAvatar })
          showToast('Foto profil berhasil diperbarui!')
        }}
      />
    </div>
  )
}
