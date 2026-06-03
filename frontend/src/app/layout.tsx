import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Platform',
  description: 'Generate structured question papers instantly with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
