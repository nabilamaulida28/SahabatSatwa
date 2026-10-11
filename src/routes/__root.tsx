/// <reference types="vite/client" />
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  HeadContent,
  Scripts,
  ErrorComponentProps,
} from '@tanstack/react-router'
import * as React from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { AuthProvider } from '../lib/auth'
import appCss from '../styles/app.css?url'
import { NotFoundPage } from '../components/common/NotFoundPage'

import { ToastProvider } from '../components/common/Toast'
import { SatwaStoreProvider } from '../lib/storage'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SahabatSatwa — Catatan Perawatan Hewan',
      },
      { name: 'theme-color', content: '#21845F' },
      {
        name: 'description',
        content: 'Aplikasi pencatatan dan pengelolaan perawatan hewan kesayangan Anda: jadwal vaksin, riwayat kesehatan, dan grafik berat badan.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'icon',
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>",
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: RootErrorComponent,
})

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  React.useEffect(() => {
    if (error) {
      console.error('Root error boundary caught:', error)
    }
  }, [error])

  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : ''

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#E6F3E7] text-[#21845F] flex items-center justify-center shadow-soft mb-4">
        <span className="text-2xl font-bold">🐾</span>
      </div>
      <h2 className="text-xl font-extrabold text-[#24312C]">Terjadi Kendala Memuat Halaman</h2>
      <p className="text-xs text-[#718078] mt-1 max-w-sm leading-relaxed">
        Sistem mendeteksi kendala pada navigasi atau render komponen. Silakan coba klik tombol di bawah untuk menyegarkan tampilan.
      </p>
      {errorMessage && (
        <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg mt-3 max-w-md break-all font-mono">
          {errorMessage}
        </p>
      )}
      <div className="mt-5 flex items-center gap-3">
        {reset && (
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#19694b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Coba Lagi
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') window.location.href = '/'
          }}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EF] text-[#24312C] border border-[#E9E4DC] text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Buka Beranda
        </button>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#FAF6EF] text-[#24312C] font-sans antialiased min-h-screen">
        <ToastProvider>
          <AuthProvider>
            <SatwaStoreProvider>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </SatwaStoreProvider>
          </AuthProvider>
        </ToastProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
