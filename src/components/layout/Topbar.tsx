import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  User,
  RotateCcw,
  CheckCheck,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useSatwaStore } from '../../lib/storage'
import { SearchModal } from '../common/SearchModal'
import { useToast } from '../common/Toast'

export const Topbar: React.FC = () => {
  const {
    owner,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetAllData,
  } = useSatwaStore()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResetData = () => {
    setIsProfileOpen(false)
    if (window.confirm('Kembalikan semua data ke setelan demo awal?')) {
      resetAllData()
      showToast('Data demo berhasil direset ke setelan awal!', 'info')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E9E4DC] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Search Trigger Input (Desktop & Tablet) */}
          <div className="flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-[#FAF6EF] hover:bg-[#FAF6EF]/80 border border-[#E9E4DC] rounded-xl text-xs sm:text-sm text-[#718078] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-[#718078] group-hover:text-[#21845F] transition-colors shrink-0" />
                <span className="truncate">Cari hewan, jenis, atau pemilik...</span>
              </div>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-[#E9E4DC] text-[#718078]">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right Action Icons: Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-xl text-[#718078] hover:text-[#24312C] hover:bg-[#FAF6EF] transition-colors"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-[#E9E4DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#E9E4DC]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#24312C]">Notifikasi</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE7E5] text-[#E11D48]">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-semibold text-[#21845F] hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E9E4DC]/50">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#718078]">
                        Tidak ada notifikasi saat ini
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id)
                            setIsNotifOpen(false)
                            navigate({ to: n.link })
                          }}
                          className={`p-3.5 hover:bg-[#FAF6EF] cursor-pointer transition-colors flex items-start gap-3 ${
                            !n.read ? 'bg-[#FAF6EF]/50' : ''
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                              n.type === 'reminder'
                                ? 'bg-[#FCE7E5] text-[#E11D48]'
                                : 'bg-[#EEE6FA] text-[#8B5CF6]'
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="text-xs font-bold text-[#24312C] truncate">
                                {n.title}
                              </h5>
                              <span className="text-[10px] text-[#718078] shrink-0">
                                {n.date}
                              </span>
                            </div>
                            <p className="text-xs text-[#718078] mt-0.5 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#FAF6EF] transition-colors group cursor-pointer"
              >
                <img
                  src={owner.avatar}
                  alt={owner.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-[#21845F]/30"
                />
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#24312C] leading-none group-hover:text-[#21845F] transition-colors">
                      {owner.name}
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#E6F3E7] text-[#21845F] leading-none">
                      Pemilik
                    </span>
                  </div>
                  <span className="text-[10px] text-[#718078] leading-none">
                    {owner.email}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#718078] hidden sm:block group-hover:text-[#24312C] transition-colors" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-[#E9E4DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-[#E9E4DC] sm:hidden">
                    <p className="text-xs font-bold text-[#24312C]">{owner.name}</p>
                    <p className="text-[10px] text-[#718078] truncate">{owner.email}</p>
                  </div>

                  <Link
                    to="/profil"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#24312C] hover:bg-[#FAF6EF] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#21845F]" />
                    <span>Profil Pemilik</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#718078] hover:text-[#E11D48] hover:bg-[#FCE7E5]/50 transition-colors text-left"
                  >
                    <RotateCcw className="w-4 h-4 text-[#E11D48]" />
                    <span>Reset Data Demo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
