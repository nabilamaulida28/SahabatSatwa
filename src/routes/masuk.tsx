import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import { useToast } from '../components/common/Toast'
import {
  PawPrint,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Database,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export const Route = createFileRoute('/masuk')({
  component: MasukPage,
})

function MasukPage() {
  const navigate = useNavigate()
  const { user, signIn, signUp, signOut, loginAsDemo, isConfigured, isDemoUser } = useAuth()
  const { showToast } = useToast()

  const [tab, setTab] = useState<'masuk' | 'daftar'>('masuk')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Jika sudah login, langsung arahkan ke dashboard
  React.useEffect(() => {
    if (user) {
      navigate({ to: '/' })
    }
  }, [user, navigate])

  // Login form state
  const [loginEmail, setLoginEmail] = useState('nabila@sahabatsatwa.id')
  const [loginPassword, setLoginPassword] = useState('password123')

  // Register form state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      showToast('Harap masukkan email dan kata sandi.', 'warning')
      return
    }

    setIsLoading(true)
    const result = await signIn(loginEmail, loginPassword)
    setIsLoading(false)

    if (result.success) {
      showToast('Selamat datang kembali di SahabatSatwa!', 'success')
      navigate({ to: '/' })
    } else {
      showToast(result.error || 'Gagal masuk. Periksa email atau kata sandi Anda.', 'error')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Semua kolom wajib diisi.', 'warning')
      return
    }

    if (regPassword !== regConfirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'warning')
      return
    }

    if (regPassword.length < 6) {
      showToast('Kata sandi minimal 6 karakter.', 'warning')
      return
    }

    if (!isConfigured) {
      showToast('Koneksi Supabase belum diatur di file .env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).', 'error')
      return
    }

    setIsLoading(true)
    const result = await signUp(regEmail, regPassword, regName)
    setIsLoading(false)

    if (result.success) {
      showToast('Pendaftaran berhasil! Akun Anda telah aktif.', 'success')
      navigate({ to: '/' })
    } else {
      showToast(result.error || 'Gagal mendaftar. Silakan coba lagi.', 'error')
    }
  }

  const handleDemoLogin = () => {
    loginAsDemo()
    showToast('Masuk sebagai Akun Demo (Nabila Maulida)', 'success')
    navigate({ to: '/' })
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-xs">
            <PawPrint className="w-4.5 h-4.5 fill-[#21845F]/20" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-[#24312C] font-display leading-none block">
              SahabatSatwa
            </span>
            <span className="text-[10px] text-[#718078] leading-none block mt-0.5">
              Catatan Perawatan Hewan
            </span>
          </div>
        </div>

        {isConfigured && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F6ED] text-[#196447] border border-[#95D9B5]/40">
            <span className="w-2 h-2 rounded-full bg-[#21845F] animate-pulse" />
            <span>Supabase Online (.env)</span>
          </div>
        )}
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl border border-[#E9E4DC] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Visual Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#21845F] to-[#175C42] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle paw print decorations */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-6 top-10 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white mb-5 shadow-inner">
              <PawPrint className="w-7 h-7" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-emerald-100 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SahabatSatwa Cloud
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Catatan Perawatan Hewan Kesayangan
            </h1>

            <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed">
              Pantau jadwal vaksin, riwayat kesehatan, nutrisi harian, dan grafik berat badan secara realtime di semua perangkat Anda.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-2.5 mt-8 relative z-10">
            <div className="flex items-center gap-2.5 text-xs text-white/90">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Database PostgreSQL Supabase Online</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-white/90">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Realtime sync seketika tanpa refresh</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-white/90">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Foto profil custom & foto kamera langsung</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 text-[11px] text-white/70 flex items-center justify-between relative z-10">
            <span>© 2026 SahabatSatwa</span>
            <span className="flex items-center gap-1">
              Dibuat dengan <Heart className="w-3 h-3 text-rose-300 fill-rose-300" /> untuk satwa
            </span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {user ? (
            /* Logged in state */
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#21845F] to-[#3ECF8E] shadow-lg mb-4">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <User className="w-10 h-10 text-[#21845F]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#24312C] font-display">
                Anda Sudah Masuk!
              </h2>
              <p className="text-sm text-[#718078] mt-1">
                Masuk sebagai: <strong className="text-[#24312C]">{user.email}</strong>
              </p>

              {isDemoUser && (
                <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  ⚡ Mode Akun Demo Aktif
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/' })}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#21845F] hover:bg-[#1a6b4c] text-white font-bold text-sm shadow-md shadow-[#21845F]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Buka Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#E9E4DC] hover:bg-[#FAF6EF] text-rose-600 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Keluar (Logout)
                </button>
              </div>
            </div>
          ) : (
            /* Login & Register Tabs */
            <div>
              {/* Tab Selector */}
              <div className="flex rounded-2xl bg-[#FAF6EF] p-1.5 border border-[#E9E4DC] mb-6">
                <button
                  type="button"
                  onClick={() => setTab('masuk')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tab === 'masuk'
                      ? 'bg-white text-[#21845F] shadow-sm'
                      : 'text-[#718078] hover:text-[#24312C]'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => setTab('daftar')}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tab === 'daftar'
                      ? 'bg-white text-[#21845F] shadow-sm'
                      : 'text-[#718078] hover:text-[#24312C]'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Daftar Baru
                </button>
              </div>

              {/* Login Tab Content */}
              {tab === 'masuk' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#24312C] mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#21845F]" />
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E9E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] bg-[#FAF6EF]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24312C] mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#21845F]" />
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-11 rounded-2xl border border-[#E9E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] bg-[#FAF6EF]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718078] hover:text-[#24312C] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-[#21845F] hover:bg-[#1a6b4c] text-white font-bold text-sm shadow-md shadow-[#21845F]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Masuk ke SahabatSatwa
                      </>
                    )}
                  </button>

                  {/* Quick Demo Login */}
                  <div className="pt-3 border-t border-[#E9E4DC] space-y-2">
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="w-full py-2.5 rounded-2xl border border-[#E9E4DC] hover:bg-[#FAF6EF] text-xs font-bold text-[#24312C] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Coba Mode Demo Instan
                    </button>
                  </div>
                </form>
              ) : (
                /* Register Tab Content */
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#24312C] mb-1 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#21845F]" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Nabila Maulida"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] bg-[#FAF6EF]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24312C] mb-1 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#21845F]" />
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] bg-[#FAF6EF]/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#24312C] mb-1 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-[#21845F]" />
                        Kata Sandi
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 karakter"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E9E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] bg-[#FAF6EF]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#24312C] mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#21845F]" />
                        Konfirmasi Sandi
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Ulangi sandi"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E9E4DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F] bg-[#FAF6EF]/40"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-[#21845F] hover:bg-[#1a6b4c] text-white font-bold text-sm shadow-md shadow-[#21845F]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Daftar Akun Baru
                      </>
                    )}
                  </button>

                  {!isConfigured && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                      <Database className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        Pendaftaran akun online memerlukan konfigurasi Supabase di file <strong>.env</strong> (<strong>VITE_SUPABASE_URL</strong> dan <strong>VITE_SUPABASE_ANON_KEY</strong>).
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
