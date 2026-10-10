import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  PawPrint,
  Calendar,
  ClipboardList,
  Bell,
  Scale,
  User,
} from 'lucide-react'
import { SidebarPetIllustration } from '../illustrations/SidebarPetIllustration'

interface NavItem {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Data Hewan', to: '/hewan', icon: PawPrint },
  { name: 'Jadwal Perawatan', to: '/jadwal', icon: Calendar },
  { name: 'Riwayat Kesehatan', to: '/riwayat', icon: ClipboardList },
  { name: 'Pengingat', to: '/pengingat', icon: Bell },
  { name: 'Catatan Makan & Berat', to: '/nutrisi-berat', icon: Scale },
  { name: 'Profil Pemilik', to: '/profil', icon: User },
]

export const Sidebar: React.FC = () => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#FFFFFF] border-r border-[#E9E4DC] h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
            <PawPrint className="w-6 h-6 fill-[#21845F]/20" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#24312C] tracking-tight leading-tight group-hover:text-[#21845F] transition-colors">
              SahabatSatwa
            </h1>
            <p className="text-[11px] font-medium text-[#718078] tracking-tight">
              Catatan Perawatan Hewan
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.to)
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#E6F3E7] text-[#21845F] shadow-xs'
                  : 'text-[#718078] hover:bg-[#FAF6EF] hover:text-[#24312C]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-[#21845F]' : 'text-[#718078]'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer Illustration */}
      <div className="p-4 m-3 mt-auto rounded-2xl bg-[#FAF6EF] border border-[#E9E4DC] text-center flex flex-col items-center">
        <SidebarPetIllustration className="w-36 h-auto mb-1" />
        <p className="text-xs font-semibold text-[#21845F] tracking-tight">
          “Hewan sehat, hidup lebih bahagia ♡”
        </p>
      </div>
    </aside>
  )
}
