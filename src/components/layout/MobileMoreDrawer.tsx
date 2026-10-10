import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ClipboardList,
  Bell,
  Scale,
  User,
  X,
  RotateCcw,
  PawPrint,
  LogIn,
  LogOut,
} from 'lucide-react'
import { useSatwaStore } from '../../lib/storage'
import { useAuth } from '../../lib/auth'
import { useToast } from '../common/Toast'
import { ConfirmDialog } from '../common/ConfirmDialog'

interface MobileMoreDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMoreDrawer: React.FC<MobileMoreDrawerProps> = ({ isOpen, onClose }) => {
  const { resetAllData } = useSatwaStore()
  const { user, signOut } = useAuth()
  const { showToast } = useToast()
  const [isResetOpen, setIsResetOpen] = useState(false)

  const resetDialog = (
    <ConfirmDialog
      isOpen={isResetOpen}
      onClose={() => setIsResetOpen(false)}
      onConfirm={() => {
        resetAllData()
        showToast('Data demo berhasil direset ke setelan awal!', 'info')
      }}
      title="Reset Data Demo?"
      message="Semua data yang kamu tambahkan atau ubah akan dikembalikan ke data demo awal."
      confirmText="Ya, Reset"
    />
  )

  if (!isOpen) return resetDialog

  const handleReset = () => {
    onClose()
    setIsResetOpen(true)
  }

  const handleLogout = async () => {
    onClose()
    await signOut()
    showToast('Anda telah keluar dari akun.', 'info')
  }

  const MORE_ITEMS = [
    {
      name: 'Riwayat Kesehatan',
      desc: 'Catatan pemeriksaan & rekam medis hewan',
      to: '/riwayat',
      icon: ClipboardList,
      bgColor: 'bg-[#FFF1CC]',
      textColor: 'text-[#D97706]',
    },
    {
      name: 'Pengingat Vaksin & Obat',
      desc: 'Jadwal obat cacing, vitamin, dan vaksin rutin',
      to: '/pengingat',
      icon: Bell,
      bgColor: 'bg-[#FCE7E5]',
      textColor: 'text-[#E11D48]',
    },
    {
      name: 'Catatan Makan & Berat',
      desc: 'Grafik berat badan & pola konsumsi pakan harian',
      to: '/nutrisi-berat',
      icon: Scale,
      bgColor: 'bg-[#EEE6FA]',
      textColor: 'text-[#8B5CF6]',
    },
    {
      name: 'Profil Pemilik',
      desc: 'Informasi akun & kontak pemilik satwa',
      to: '/profil',
      icon: User,
      bgColor: 'bg-[#E6F3E7]',
      textColor: 'text-[#21845F]',
    },
    {
      name: user ? 'Kelola Akun' : 'Masuk / Daftar',
      desc: user ? `Masuk sebagai ${user.email}` : 'Masuk akun atau daftar akun online',
      to: '/masuk',
      icon: LogIn,
      bgColor: 'bg-[#E7F6ED]',
      textColor: 'text-[#21845F]',
    },
  ]

  return (
    <>
      {resetDialog}
      <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#24312C]/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Drawer content */}
        <div className="relative w-full bg-white rounded-t-3xl p-6 shadow-soft-lg z-10 animate-in slide-in-from-bottom duration-250 border-t border-[#E9E4DC] max-h-[85vh] overflow-y-auto">
          {/* Drag handle pill */}
          <div className="w-12 h-1.5 bg-[#E9E4DC] rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center">
                <PawPrint className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#24312C]">Menu Lengkap</h3>
                <p className="text-xs text-[#718078]">Fitur dan pengaturan SahabatSatwa</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#718078] hover:text-[#24312C] hover:bg-[#FAF6EF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#FAF6EF] transition-colors border border-transparent hover:border-[#E9E4DC]"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#24312C]">{item.name}</h4>
                    <p className="text-xs text-[#718078] truncate">{item.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="pt-3 border-t border-[#E9E4DC] flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#E11D48] hover:underline flex items-center gap-1.5 py-2 px-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Data Demo
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 py-2 px-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            )}
            <span className="text-[11px] text-[#718078]">SahabatSatwa Cloud ♡</span>
          </div>
        </div>
      </div>
    </>
  )
}
