import React, { useState, useRef } from 'react'
import { Modal } from '../common/Modal'
import { CameraCapture } from './CameraCapture'
import {
  Camera,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Check,
  Image as ImageIcon,
} from 'lucide-react'

interface ChangeAvatarModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar: string
  onSave: (avatarUrl: string) => void
}

const PRESET_AVATARS = [
  {
    name: 'Nabila Default',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Hijab Friendly',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Casual Smile',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Pet Owner Guy',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Cheerful Cat Lover',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Outdoor Dog Lover',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
]

type TabType = 'camera' | 'upload' | 'preset' | 'url'

export const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('camera')
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar)
  const [customUrl, setCustomUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload from file system / device gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        // Resize and compress using off-screen canvas to keep localStorage snappy
        const canvas = document.createElement('canvas')
        const size = Math.min(img.width, img.height)
        canvas.width = 400
        canvas.height = 400

        const ctx = canvas.getContext('2d')
        if (ctx) {
          const sx = (img.width - size) / 2
          const sy = (img.height - size) / 2
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400)
          const compressed = canvas.toDataURL('image/jpeg', 0.88)
          setSelectedAvatar(compressed)
        }
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  // Handle camera photo capture
  const handleCameraCapture = (dataUrl: string) => {
    setSelectedAvatar(dataUrl)
    onSave(dataUrl)
    onClose()
  }

  // Handle save from other tabs
  const handleSaveSelected = () => {
    if (activeTab === 'url' && customUrl.trim()) {
      onSave(customUrl.trim())
    } else {
      onSave(selectedAvatar)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ganti Foto Profil"
      subtitle="Ambil langsung dengan kamera atau unggah dari perangkat"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#FAF6EF] rounded-2xl border border-[#E9E4DC]">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-[#21845F] shadow-xs'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <Camera className="w-4 h-4 mb-0.5" />
            <span>Kamera</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#21845F] shadow-xs'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <Upload className="w-4 h-4 mb-0.5" />
            <span>Galeri/File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'preset'
                ? 'bg-white text-[#21845F] shadow-xs'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>Preset</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-[#21845F] shadow-xs'
                : 'text-[#718078] hover:text-[#24312C]'
            }`}
          >
            <LinkIcon className="w-4 h-4 mb-0.5" />
            <span>Tautan</span>
          </button>
        </div>

        {/* Tab 1: Live Camera Capture */}
        {activeTab === 'camera' && (
          <div className="pt-1">
            <CameraCapture
              onCapture={handleCameraCapture}
              onCancel={onClose}
            />
          </div>
        )}

        {/* Tab 2: Upload File / Gallery */}
        {activeTab === 'upload' && (
          <div className="space-y-4 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-[#E6F3E7] shadow-soft mb-3 bg-[#FAF6EF]">
                <img
                  src={selectedAvatar}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#E6F3E7] hover:bg-[#21845F] text-[#21845F] hover:text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Foto dari Perangkat</span>
              </button>
              <p className="text-[11px] text-[#718078] mt-1.5 text-center">
                Mendukung format JPG, PNG, atau WEBP. Foto akan otomatis dipotong persegi.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E9E4DC]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#718078] hover:text-[#24312C] bg-[#FAF6EF] rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSelected}
                className="px-5 py-2 text-xs font-bold text-white bg-[#21845F] hover:bg-[#19694b] rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Preset Avatars */}
        {activeTab === 'preset' && (
          <div className="space-y-4 pt-1">
            <p className="text-xs text-[#718078]">
              Pilih karakter avatar yang sesuai dengan gaya Anda:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AVATARS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAvatar(p.url)}
                  className={`group relative rounded-2xl overflow-hidden border-2 p-1 cursor-pointer transition-all ${
                    selectedAvatar === p.url
                      ? 'border-[#21845F] bg-[#E6F3E7] shadow-xs scale-105'
                      : 'border-[#E9E4DC] hover:border-[#21845F]/50 bg-white'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                  <p className="text-[10px] font-semibold text-center text-[#24312C] mt-1 truncate">
                    {p.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E9E4DC]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#718078] hover:text-[#24312C] bg-[#FAF6EF] rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSelected}
                className="px-5 py-2 text-xs font-bold text-white bg-[#21845F] hover:bg-[#19694b] rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Avatar Ini</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Custom URL */}
        {activeTab === 'url' && (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#24312C] mb-1">
                Tautan URL Foto
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value)
                  if (e.target.value.trim().startsWith('http')) {
                    setSelectedAvatar(e.target.value.trim())
                  }
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 bg-[#FAF6EF] border border-[#E9E4DC] rounded-xl text-xs text-[#24312C] focus:outline-none focus:ring-2 focus:ring-[#21845F]/30 focus:border-[#21845F]"
              />
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-[#FAF6EF]/60 rounded-2xl border border-[#E9E4DC]">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-2xs mb-1 bg-white">
                <img
                  src={customUrl.trim() || selectedAvatar}
                  alt="Preview URL"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = currentAvatar
                  }}
                />
              </div>
              <span className="text-[10px] text-[#718078]">Pratinjau Foto</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E9E4DC]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#718078] hover:text-[#24312C] bg-[#FAF6EF] rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSelected}
                disabled={!customUrl.trim() && !selectedAvatar}
                className="px-5 py-2 text-xs font-bold text-white bg-[#21845F] hover:bg-[#19694b] rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan URL</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
