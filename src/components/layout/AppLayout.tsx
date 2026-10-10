import React, { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { ToastProvider } from '../common/Toast'
import { PawPrint } from 'lucide-react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  const isAuthRoute = currentPath === '/masuk' || currentPath === '/daftar'

  useEffect(() => {
    if (isLoading) return

    if (!user && !isAuthRoute) {
      navigate({ to: '/masuk' })
    } else if (user && isAuthRoute) {
      navigate({ to: '/' })
    }
  }, [user, isLoading, isAuthRoute, navigate])

  // While checking auth status
  if (isLoading) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-soft animate-bounce mb-4">
            <PawPrint className="w-8 h-8 fill-[#21845F]/20" />
          </div>
          <h2 className="text-xl font-extrabold text-[#24312C] font-display">SahabatSatwa</h2>
          <p className="text-xs text-[#718078] mt-1">Memeriksa sesi login...</p>
        </div>
      </ToastProvider>
    )
  }

  // If not logged in and not on auth route yet, show brief loading screen while redirecting
  if (!user && !isAuthRoute) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-soft animate-pulse mb-4">
            <PawPrint className="w-8 h-8 fill-[#21845F]/20" />
          </div>
          <p className="text-xs text-[#718078]">Mengarahkan ke halaman masuk...</p>
        </div>
      </ToastProvider>
    )
  }

  // If on login/register route, render dedicated clean auth layout
  if (isAuthRoute) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#FAF6EF] flex flex-col justify-center">
          <main className="w-full mx-auto">
            {children}
          </main>
        </div>
      </ToastProvider>
    )
  }

  // Main Authenticated Dashboard Layout
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
