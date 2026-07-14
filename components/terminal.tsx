"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { EVENTS, onEvent } from "@/lib/events"
import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import { experience } from "@/data/experience"
import { skillGroups } from "@/data/skills"

type Line = { kind: "input" | "output"; text: string }

const BANNER = [
  `${profile.name} — interactive shell`,
  `Type 'help' to see available commands.`,
]

function runCommand(raw: string): string[] {
  const cmd = raw.trim().toLowerCase()

  switch (cmd) {
    case "help":
      return [
        "available commands:",
        "  about        who is Deepak?",
        "  skills       tech stack",
        "  projects     things I've built",
        "  experience   where I've been",
        "  contact      how to reach me",
        "  resume       open my resume",
        "  whoami       you, probably",
        "  clear        clear the screen",
        "  exit         close the terminal",
      ]
    case "about":
      return [profile.bio]
    case "skills":
      return skillGroups.map(
        (g) => `${g.title.padEnd(16)} ${g.skills.join(", ")}`
      )
    case "projects":
      return projects.flatMap((p) => [
        `${p.title} — ${p.headline}`,
        `  ${p.links.live ?? p.links.repo ?? ""}`,
      ])
    case "experience":
      return experience.map((e) => `${e.period.padEnd(18)} ${e.title} · ${e.org}`)
    case "contact":
      return [
        `email:    ${profile.email}`,
        `github:   ${profile.socials.github}`,
        `linkedin: ${profile.socials.linkedin}`,
      ]
    case "resume":
      window.open(profile.resumeUrl, "_blank")
      return ["opening resume…"]
    case "whoami":
      return ["a curious visitor with excellent taste"]
    case "sudo hire-me":
    case "sudo hire me":
      return [
        "[sudo] permission granted ✔",
        `initiating handshake… email drafted to ${profile.email}`,
        "(just kidding — but the contact form works!)",
      ]
    case "ls":
      return ["about/  skills/  projects/  experience/  contact/  resume"]
    case "pwd":
      return ["/home/deepak/portfolio"]
    case "":
      return []
    default:
      return [`command not found: ${cmd} — try 'help'`]
  }
}

export function Terminal() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((text) => ({ kind: "output", text }))
  )
  const [value, setValue] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const offEvent = onEvent(EVENTS.terminal, () => setOpen(true))
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      offEvent()
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [lines, open])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cmd = value
    setValue("")
    setHistoryIndex(-1)

    if (cmd.trim().toLowerCase() === "clear") {
      setLines([])
      return
    }
    if (cmd.trim().toLowerCase() === "exit") {
      setOpen(false)
      return
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h])

    const output = runCommand(cmd).map<Line>((text) => ({ kind: "output", text }))
    setLines((prev) => [...prev, { kind: "input", text: cmd }, ...output])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const next = Math.min(historyIndex + 1, history.length - 1)
      if (history[next]) {
        setHistoryIndex(next)
        setValue(history[next])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = historyIndex - 1
      setHistoryIndex(next)
      setValue(next >= 0 ? history[next] : "")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl gap-0 overflow-hidden border-border/60 bg-[#0d0d14] p-0 font-mono text-sm text-emerald-300/90"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          inputRef.current?.focus()
        }}
      >
        <DialogTitle className="sr-only">Interactive terminal</DialogTitle>
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
          <span className="size-3 rounded-full bg-red-400/80" />
          <span className="size-3 rounded-full bg-yellow-400/80" />
          <span className="size-3 rounded-full bg-green-400/80" />
          <span className="ml-2 text-xs text-white/50">deepak@portfolio: ~</span>
        </div>

        <div
          className="h-80 cursor-text overflow-y-auto p-4"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {line.kind === "input" ? (
                <>
                  <span className="text-primary">❯ </span>
                  <span className="text-white/90">{line.text}</span>
                </>
              ) : (
                line.text
              )}
            </p>
          ))}
          <form onSubmit={onSubmit} className="flex items-center">
            <span className="text-primary">❯&nbsp;</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal input"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-white/90 outline-none"
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
