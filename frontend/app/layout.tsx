import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ProvedorTema } from '@/components/providers/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard de Investimentos',
  description: 'Gerencie seus fundos de investimento, cotas e movimentacoes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ProvedorTema>
          {children}
        </ProvedorTema>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
