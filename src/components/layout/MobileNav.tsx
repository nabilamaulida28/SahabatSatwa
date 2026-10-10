import React, { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, PawPrint, Calendar, MoreHorizontal } from 'lucide-react'
import { MobileMoreDrawer } from './MobileMoreDrawer'

export const MobileNav: React.FC = () => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isMoreActive =
    currentPath.startsWith('/riwayat') ||
    currentPath.startsWith('/pengingat') ||
    currentPath.startsWith('/nutrisi-berat') ||
    currentPath.startsWith('/profil')

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E9E4DC] px-2 py-2 safe-bottom">
        <div className="grid grid-cols-4 max-w-md mx-auto">
          {/* Beranda */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all ${
              currentPath === '/'
                ? 'text-[#21845F] bg-[#E6F3E7]/60'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Beranda</span>
          </Link>

          {/* Hewan */}
          <Link
            to="/hewan"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all ${
              currentPath.startsWith('/hewan')
                ? 'text-[#21845F] bg-[#E6F3E7]/60'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <PawPrint className="w-5 h-5 mb-0.5" />
            <span>Hewan</span>
          </Link>

          {/* Jadwal */}
          <Link
            to="/jadwal"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all ${
              currentPath.startsWith('/jadwal')
                ? 'text-[#21845F] bg-[#E6F3E7]/60'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span>Jadwal</span>
          </Link>

          {/* Lainnya */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all ${
              isMoreActive
                ? 'text-[#21845F] bg-[#E6F3E7]/60'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span>Lainnya</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileMoreDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
