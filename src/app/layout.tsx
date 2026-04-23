import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Terrabras — Serra da Canastra", template: "%s | Terrabras" },
  description:
    "Vinho de altitude produzido ao pé da Serra da Canastra, a 1.350 m, em solo com milhões de anos. Syrah e Cabernet Franc — safra 2024.",
  keywords: ["terrabras", "vinho", "serra da canastra", "syrah", "cabernet franc", "altitude", "minas gerais"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  )
}
