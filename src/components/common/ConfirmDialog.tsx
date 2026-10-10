import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-[#FCE7E5] text-[#E11D48]' : 'bg-[#E6F3E7] text-[#21845F]'
          }`}
        >
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-[#24312C] leading-relaxed">{message}</p>
          <p className="text-xs text-[#718078] mt-2">
            Tindakan ini akan menghapus data dari penyimpanan perangkat Anda.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E9E4DC]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-[#718078] hover:text-[#24312C] bg-[#FAF6EF] hover:bg-[#E9E4DC]/60 rounded-xl transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all shadow-xs ${
            isDestructive
              ? 'bg-[#E11D48] hover:bg-[#BE123C]'
              : 'bg-[#21845F] hover:bg-[#19694b]'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
