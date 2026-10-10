import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, RefreshCw, Check, X, AlertCircle, FlipHorizontal } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
  onCancel: () => void
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [isLoading, setIsLoading] = useState(true)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

  // Stop camera tracks cleanly
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  // Check if device has multiple cameras (front/back)
  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput')
        if (videoInputs.length > 1) {
          setHasMultipleCameras(true)
        }
      }).catch(() => {})
    }
  }, [])

  // Start camera stream
  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    setIsLoading(true)
    setCameraError(null)

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Peramban Anda tidak mendukung akses kamera secara langsung.')
      setIsLoading(false)
      return
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      })

      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        videoRef.current.play().catch(() => {})
      }
      setIsLoading(false)
    } catch (err: any) {
      console.warn('Camera access error:', err)
      setIsLoading(false)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Izin akses kamera ditolak. Silakan izinkan kamera di pengaturan peramban Anda.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Kamera tidak ditemukan pada perangkat ini.')
      } else {
        setCameraError(`Gagal mengakses kamera: ${err.message || 'Periksa koneksi webcam Anda.'}`)
      }
    }
  }, [stream])

  useEffect(() => {
    startCamera(facingMode)
    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [facingMode])

  // Capture current frame from video to canvas
  const handleTakePhoto = () => {
    if (!videoRef.current) return

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480)
    canvas.width = 400
    canvas.height = 400

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // If front camera, mirror image for natural selfie look
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    const sx = Math.max(0, (video.videoWidth - size) / 2)
    const sy = Math.max(0, (video.videoHeight - size) / 2)

    ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88)

    setCapturedImage(dataUrl)
    stopStream()
  }

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null)
    startCamera(facingMode)
  }

  // Toggle front / back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  // Cancel and exit
  const handleClose = () => {
    stopStream()
    onCancel()
  }

  return (
    <div className="space-y-4">
      {/* Video Viewport / Photo Preview */}
      <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-[#24312C] rounded-3xl overflow-hidden border-4 border-[#E6F3E7] shadow-soft-lg flex items-center justify-center">
        {capturedImage ? (
          // Captured Preview
          <img
            src={capturedImage}
            alt="Hasil Foto Kamera"
            className="w-full h-full object-cover animate-in zoom-in-95 duration-150"
          />
        ) : cameraError ? (
          // Error Message
          <div className="p-6 text-center text-white space-y-2">
            <AlertCircle className="w-10 h-10 text-[#E11D48] mx-auto" />
            <p className="text-xs font-semibold text-rose-200">{cameraError}</p>
            <p className="text-[11px] text-slate-300">
              Gunakan opsi "Unggah File" untuk memilih foto langsung dari galeri atau disk Anda.
            </p>
          </div>
        ) : (
          // Live Video Stream
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Circular framing overlay guide */}
            <div className="absolute inset-0 pointer-events-none border-[3px] border-dashed border-white/60 rounded-full m-6" />

            {isLoading && (
              <div className="absolute inset-0 bg-[#24312C]/80 flex flex-col items-center justify-center text-white gap-2 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-[#21845F]" />
                <span>Menghubungkan ke kamera...</span>
              </div>
            )}
          </>
        )}

        {/* Camera switch toggle button on top-right */}
        {!capturedImage && !cameraError && hasMultipleCameras && (
          <button
            type="button"
            onClick={handleToggleFacingMode}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-xs"
            title="Ganti Kamera (Depan / Belakang)"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Control Actions */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {capturedImage ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2.5 rounded-xl bg-[#FAF6EF] hover:bg-[#E9E4DC] text-xs font-bold text-[#24312C] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ambil Ulang</span>
            </button>
            <button
              type="button"
              onClick={() => onCapture(capturedImage)}
              className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-xs font-bold text-white shadow-soft transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Gunakan Foto Ini</span>
            </button>
          </>
        ) : cameraError ? (
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-[#FAF6EF] hover:bg-[#E9E4DC] text-xs font-semibold text-[#718078]"
          >
            Tutup
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl bg-[#FAF6EF] hover:bg-[#E9E4DC] text-xs font-semibold text-[#718078] transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleTakePhoto}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-xs font-bold text-white shadow-soft transition-all duration-150 flex items-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>Ambil Foto</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
