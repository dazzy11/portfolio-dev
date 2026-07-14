"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  Copy,
  FileDown,
  FolderGit2,
  Github,
  Linkedin,
  MessageCircle,
  Moon,
  SquareTerminal,
  Sun,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { EVENTS, onEvent, openChat, openTerminal } from "@/lib/events"
import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import { site } from "@/data/site"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKey)
    const off = onEvent(EVENTS.palette, () => setOpen(true))
    return () => {
      document.removeEventListener("keydown", onKey)
      off()
    }
  }, [])

  const run = useCallback((action: () => void) => {
    setOpen(false)
    // Let the dialog close before the action (scroll, focus) kicks in.
    setTimeout(action, 80)
  }, [])

  const goTo = (hash: string) =>
    run(() => {
      if (window.location.pathname !== "/") router.push(`/${hash}`)
      else document.querySelector(hash)?.scrollIntoView()
    })

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          {site.nav.map((item) => (
            <CommandItem key={item.href} onSelect={() => goTo(item.href.replace("/", ""))}>
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              onSelect={() => run(() => router.push(`/projects/${project.slug}`))}
            >
              <FolderGit2 />
              {project.title}
              <span className="text-muted-foreground">— {project.headline}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(openChat)}>
            <MessageCircle />
            Ask the chatbot
          </CommandItem>
          <CommandItem onSelect={() => run(openTerminal)}>
            <SquareTerminal />
            Open terminal
            <CommandShortcut>~</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => {
                navigator.clipboard.writeText(profile.email)
                toast.success("Email copied to clipboard")
              })
            }
          >
            <Copy />
            Copy email
          </CommandItem>
          <CommandItem
            onSelect={() => run(() => window.open(profile.resumeUrl, "_blank"))}
          >
            <FileDown />
            Download resume
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
            }
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
            Toggle theme
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Social">
          <CommandItem onSelect={() => run(() => window.open(profile.socials.github, "_blank"))}>
            <Github />
            GitHub
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(profile.socials.linkedin, "_blank"))}>
            <Linkedin />
            LinkedIn
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
