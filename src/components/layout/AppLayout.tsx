import React, { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { PawPrint, AlertTriangle } from 'lucide-react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../lib/auth'

interface AppLayoutProps {
  children: React.ReactNode
}

class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode; currentPath: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; currentPath: string }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Page render error caught by LayoutErrorBoundary:', error, errorInfo)
  }

  componentDidUpdate(prevProps: { currentPath: string }) {
    if (prevProps.currentPath !== this.props.currentPath && this.state.hasError) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-3xl border border-[#E9E4DC] p-8 sm:p-12 text-center shadow-soft my-6 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertTriangle className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-[#24312C]">Gagal Memuat Konten Halaman</h3>
          <p className="text-xs text-[#718078] mt-1.5 max-w-md mx-auto leading-relaxed">
            Terjadi kendala saat menampilkan data di halaman ini. Navigasi tetap aktif, Anda dapat berpindah ke halaman lain atau mencoba kembali.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Coba Lagi
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/'
              }}
              className="px-4 py-2 rounded-xl bg-[#FAF6EF] hover:bg-[#E9E4DC] text-[#24312C] text-xs font-semibold border border-[#E9E4DC] cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
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
    }
  }, [user, isLoading, isAuthRoute, navigate])

  // While checking auth status: keep outlet mounted in background to avoid TanStack Router crash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-soft animate-bounce mb-4">
          <PawPrint className="w-8 h-8 fill-[#21845F]/20" />
        </div>
        <h2 className="text-xl font-extrabold text-[#24312C] font-display">SahabatSatwa</h2>
        <p className="text-xs text-[#718078] mt-1">Memeriksa sesi login...</p>
        <div className="hidden" aria-hidden="true">
          {children}
        </div>
      </div>
    )
  }

  // If on login/register route, render dedicated clean auth layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex flex-col justify-center">
        <main className="w-full mx-auto">
          <LayoutErrorBoundary currentPath={currentPath}>
            {children}
          </LayoutErrorBoundary>
        </main>
      </div>
    )
  }

  // If not logged in and not on auth route yet, show brief loading screen while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-soft animate-pulse mb-4">
          <PawPrint className="w-8 h-8 fill-[#21845F]/20" />
        </div>
        <p className="text-xs text-[#718078]">Mengarahkan ke halaman masuk...</p>
        <div className="hidden" aria-hidden="true">
          {children}
        </div>
      </div>
    )
  }

  // Main Authenticated Dashboard Layout
  return (
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
          <LayoutErrorBoundary currentPath={currentPath}>
            {children}
          </LayoutErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
