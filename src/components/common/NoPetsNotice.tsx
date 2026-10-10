import React from 'react'
import { Link } from '@tanstack/react-router'
import { PawPrint, Plus } from 'lucide-react'

interface NoPetsNoticeProps {
  /** Teks aksi, mis. "membuat jadwal" */
  action?: string
}

/** Ditampilkan di halaman yang butuh minimal satu hewan terdaftar. */
export const NoPetsNotice: React.FC<NoPetsNoticeProps> = ({ action = 'menggunakan fitur ini' }) => (
  <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-[#FFF1CC]/60 border border-[#D97706]/25">
    <div className="w-12 h-12 rounded-2xl bg-white text-[#D97706] flex items-center justify-center shrink-0">
      <PawPrint className="w-6 h-6" />
    </div>
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-sm font-extrabold text-[#24312C]">Belum ada hewan terdaftar</h3>
      <p className="text-xs text-[#718078] mt-0.5">
        Daftarkan minimal satu hewan terlebih dahulu sebelum {action}.
      </p>
    </div>
    <Link
      to="/hewan"
      className="px-4 py-2 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
    >
      <Plus className="w-4 h-4" />
      Tambah Hewan
    </Link>
  </div>
)
