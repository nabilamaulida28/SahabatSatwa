import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/daftar')({
  beforeLoad: () => {
    throw redirect({
      to: '/masuk',
    })
  },
})
