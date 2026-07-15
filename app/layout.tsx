import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk, Outfit, Anton } from "next/font/google"
import { Providers } from "@/components/providers"
import { SmoothScroll } from "@/components/ultra/smooth-scroll"
import { Cursor } from "@/components/ultra/cursor"
import { CommandPalette } from "@/components/command-palette"
import { Terminal } from "@/components/terminal"
import { ChatWidget } from "@/components/chat-widget"
import { profile } from "@/data/profile"
import { site } from "@/data/site"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["700", "800"],
})

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${profile.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: profile.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: site.url,
  sameAs: [profile.socials.github, profile.socials.linkedin],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${outfit.variable} ${anton.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <SmoothScroll />
          <Cursor />
          {children}
          <CommandPalette />
          <Terminal />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
