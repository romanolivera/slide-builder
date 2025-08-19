import type React from "react"
import type { Metadata } from "next"
import { League_Gothic, Roboto, League_Spartan, Architects_Daughter } from "next/font/google"
import "./globals.css"

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league-gothic",
  weight: "400",
})

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  weight: ["400", "700"],
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "700"],
})

const architectsDaughter = Architects_Daughter({
  subsets: ["latin"],
  variable: "--font-architects-daughter",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Los Coaches - Slide Builder",
  description: "Generate professional slides from Markdown",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${leagueGothic.variable} ${leagueSpartan.variable} ${roboto.variable} ${architectsDaughter.variable} font-roboto antialiased`}>{children}</body>
    </html>
  )
}
