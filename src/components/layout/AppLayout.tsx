import React from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { ToastProvider } from '../common/Toast'
import { PawPrint } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FAF6EF] flex">
        {/* Desktop & Tablet Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          {/* Mobile Top Header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E9E4DC]">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center">
                <PawPrint className="w-4 h-4 fill-[#21845F]/20" />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#24312C] leading-none block">
                  SahabatSatwa
                </span>
                <span className="text-[10px] text-[#718078] leading-none block">
                  Perawatan Hewan
                </span>
              </div>
            </Link>
            <Link
              to="/profil"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF6EF] border border-[#E9E4DC] text-[#24312C] hover:bg-[#E6F3E7]"
            >
              Profil
            </Link>
          </div>

          {/* Topbar with search and notifications */}
          <Topbar />

          {/* Page Body Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </ToastProvider>
  )
}
