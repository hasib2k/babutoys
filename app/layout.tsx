import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'সোনামণিদের বাংলা ইংরেজি শেখার লার্নিং এন্ড প্লেয়িং টয়',
  description: 'Pসোনামণিদের বাংলা ইংরেজি শেখার লার্নিং এন্ড প্লেয়িং টয় - Limited time offer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
