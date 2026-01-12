import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Massage Therapy Combo Package - Special Offer',
  description: 'Premium quality massage therapy combo pack - Limited time offer',
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
