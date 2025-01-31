import { Metadata } from 'next'

export const metadata: Metadata = {
  icons: {
    icon: 'data:,'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  )
} 