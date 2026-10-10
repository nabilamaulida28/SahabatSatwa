import React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, PawPrint } from 'lucide-react'
import { EmptyStateIllustration } from '../illustrations/EmptyStateIllustration'

export const NotFoundPage: React.FC = () => (
  <div className="max-w-lg mx-auto py-10 text-center space-y-5">
    <div className="bg-white rounded-3xl border border-[#E9E4DC] p-8 shadow-soft">
      <EmptyStateIllustration message="Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan." />
    </div>
    <h1 className="text-2xl font-extrabold text-[#24312C]">Oops, halaman tidak ditemukan</h1>
    <p className="text-sm text-[#718078]">Mungkin alamatnya salah ketik. Yuk kembali ke beranda.</p>
    <div className="flex items-center justify-center gap-3">
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white font-bold text-sm flex items-center gap-2 transition-colors"
      >
        <Home className="w-4 h-4" /> Ke Beranda
      </Link>
      <Link
        to="/hewan"
        className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EF] text-[#24312C] font-bold text-sm border border-[#E9E4DC] flex items-center gap-2 transition-colors"
      >
        <PawPrint className="w-4 h-4 text-[#21845F]" /> Data Hewan
      </Link>
    </div>
  </div>
)
