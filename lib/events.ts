// Tiny cross-component event bus for the palette, terminal, and chatbot.
export const EVENTS = {
  palette: "portfolio:open-palette",
  terminal: "portfolio:open-terminal",
  chat: "portfolio:open-chat",
} as const

function emit(name: string) {
  window.dispatchEvent(new CustomEvent(name))
}

export const openPalette = () => emit(EVENTS.palette)
export const openTerminal = () => emit(EVENTS.terminal)
export const openChat = () => emit(EVENTS.chat)

export function onEvent(name: string, handler: () => void) {
  window.addEventListener(name, handler)
  return () => window.removeEventListener(name, handler)
}
