"use client"

import Link from "next/link"
import { ArrowUp, Github, Linkedin, Mail, SquareTerminal } from "lucide-react"
import Magnet from "@/components/bits/Magnet"
import { Button } from "@/components/ui/button"
import { openTerminal } from "@/lib/events"
import { profile } from "@/data/profile"
import { site } from "@/data/site"

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link href="#home" className="font-display text-lg font-semibold tracking-tight">
            {profile.firstName}
            <span className="text-primary">.</span>
          </Link>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" aria-label="GitHub">
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="LinkedIn">
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="size-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Email">
              <a href={`mailto:${profile.email}`}>
                <Mail className="size-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open terminal (press `)"
              onClick={openTerminal}
            >
              <SquareTerminal className="size-4" />
            </Button>
            <Magnet padding={40} magnetStrength={6}>
              <Button
                variant="outline"
                size="icon"
                aria-label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp className="size-4" />
              </Button>
            </Magnet>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, Tailwind CSS
          &amp; GSAP. Psst — try pressing <kbd className="rounded border border-border px-1 font-mono">⌘K</kbd> or{" "}
          <kbd className="rounded border border-border px-1 font-mono">`</kbd>
        </p>
      </div>
    </footer>
  )
}
