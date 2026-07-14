"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle, Send, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EVENTS, onEvent } from "@/lib/events"
import { localAnswer, suggestedQuestions } from "@/lib/chat-engine"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

type Message = { role: "user" | "assistant"; content: string }

const GREETING: Message = {
  role: "assistant",
  content: `Hi! I'm ${profile.firstName}'s AI assistant. Ask me anything about his work, skills, or how to reach him.`,
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [value, setValue] = useState("")
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => onEvent(EVENTS.chat, () => setOpen(true)), [])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ block: "end" })
      inputRef.current?.focus()
    }
  }, [open, messages, thinking])

  async function send(text: string) {
    const content = text.trim()
    if (!content || thinking) return
    setValue("")

    const next: Message[] = [...messages, { role: "user", content }]
    setMessages(next)
    setThinking(true)

    let reply: string
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Skip the canned greeting; only real conversation goes to the LLM.
        body: JSON.stringify({ messages: next.slice(1) }),
      })
      if (res.ok) {
        reply = (await res.json()).reply
      } else {
        reply = localAnswer(content)
      }
    } catch {
      reply = localAnswer(content)
    }

    // Small pause so the typing indicator reads naturally on instant answers.
    await new Promise((r) => setTimeout(r, 350))
    setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    setThinking(false)
  }

  return (
    <>
      {/* Launcher */}
      <motion.div
        className="fixed right-5 bottom-5 z-[60] sm:right-8 sm:bottom-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="icon-lg"
          aria-label={open ? "Close chat" : "Chat with my AI assistant"}
          onClick={() => setOpen((v) => !v)}
          className="size-13 rounded-full shadow-lg shadow-primary/25"
        >
          {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
        </Button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Chat with Deepak's assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass fixed right-0 bottom-24 z-[60] mx-4 flex h-[28rem] max-h-[70svh] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-xl border border-border/60 shadow-2xl sm:right-8 sm:mx-0 sm:w-96"
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold">
                  {profile.firstName}&apos;s assistant
                </p>
                <p className="text-xs text-muted-foreground">
                  Usually replies instantly
                </p>
              </div>
              <Sparkles className="ml-auto size-4 text-primary" />
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-wrap",
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {thinking ? (
                <div className="flex w-14 items-center justify-center gap-1 rounded-xl bg-muted px-3.5 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              ) : null}

              {messages.length === 1 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(value)
              }}
              className="flex items-center gap-2 border-t border-border/60 p-3"
            >
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask me anything…"
                aria-label="Chat message"
                className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="icon-sm"
                aria-label="Send message"
                disabled={!value.trim() || thinking}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
