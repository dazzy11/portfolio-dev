"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useSpring } from "framer-motion"
import { Command, FileDown, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { site } from "@/data/site"
import { profile } from "@/data/profile"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { openPalette } from "@/lib/events"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "glass border-b border-border/60" : "bg-transparent"
      )}
    >
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-primary"
      />

      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10"
      >
        <Link
          href="#home"
          className="font-display text-lg font-semibold tracking-tight"
        >
          {profile.firstName}
          <span className="text-primary">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={openPalette}
            aria-label="Open command palette"
            className="hidden text-muted-foreground lg:inline-flex"
          >
            <Command className="size-3.5" />
            <kbd className="font-mono text-xs">K</kbd>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              <FileDown className="size-4" />
              Resume
            </a>
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="md:hidden"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-left">
                  {profile.firstName}
                  <span className="text-primary">.</span>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-2 px-4">
                <ul className="grid gap-1">
                  {site.nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-md px-3 py-3 font-display text-2xl font-medium tracking-tight transition-colors hover:bg-accent hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileDown className="size-4" />
                    Download resume
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
