import React, { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: string // e.g. 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl'
  zIndex?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  zIndex = 'z-[100]',
}) => {
  const titleId = useId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // Check if any other modal is still active
      setTimeout(() => {
        const remaining = document.querySelectorAll('[data-satwa-modal="true"]').length
        if (remaining === 0) {
          document.body.style.overflow = ''
        }
      }, 0)
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const modalNode = (
    <div
      data-satwa-modal="true"
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-3 sm:p-5 overflow-y-auto`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#24312C]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative w-full ${maxWidth} max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3.5rem)] flex flex-col bg-white rounded-3xl shadow-soft-lg border border-[#E9E4DC] overflow-hidden z-10 transition-all transform animate-in zoom-in-95 duration-200 my-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Pinned at the top so it is never hidden or cut off */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#E9E4DC] bg-[#FAF6EF]/90 backdrop-blur-xs shrink-0">
          <div className="pr-3 min-w-0">
            <h3 id={titleId} className="text-base sm:text-lg font-bold text-[#24312C] truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#718078] mt-0.5 line-clamp-1 sm:line-clamp-none">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-[#718078] hover:text-[#24312C] hover:bg-white border border-transparent hover:border-[#E9E4DC] transition-colors shrink-0 cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrolls smoothly inside the box */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalNode, document.body)
}
