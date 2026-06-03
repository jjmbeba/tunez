import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: string
  dedupeKey?: string
  title: string
  description?: string
  variant: 'info' | 'error'
}

interface ToastOptions {
  timeoutMs?: number
  dedupeKey?: string
  cooldownMs?: number
}

export const useToastStore = defineStore('toast', () => {
  const messages = ref<ToastMessage[]>([])
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  const lastShownAt = new Map<string, number>()

  function dismiss(id: string) {
    const timer = timers.get(id)

    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }

    messages.value = messages.value.filter((message) => message.id !== id)
  }

  function notify(message: Omit<ToastMessage, 'id' | 'dedupeKey'>, options: ToastOptions = {}) {
    const { timeoutMs = 4200, dedupeKey, cooldownMs = 8000 } = options
    const now = Date.now()

    if (dedupeKey) {
      const lastShown = lastShownAt.get(dedupeKey) ?? 0

      if (now - lastShown < cooldownMs) {
        return null
      }

      lastShownAt.set(dedupeKey, now)
    }

    const id = crypto.randomUUID()
    const nextMessage = { id, dedupeKey, ...message }
    const replacedMessages = dedupeKey
      ? messages.value.filter((item) => item.dedupeKey !== dedupeKey)
      : messages.value
    const nextMessages = [nextMessage, ...replacedMessages].slice(0, 3)
    const removedMessages = messages.value.filter(
      (item) => !nextMessages.some((nextItem) => nextItem.id === item.id),
    )

    for (const removedMessage of removedMessages) {
      const timer = timers.get(removedMessage.id)

      if (timer) {
        clearTimeout(timer)
        timers.delete(removedMessage.id)
      }
    }

    messages.value = nextMessages

    timers.set(
      id,
      setTimeout(() => dismiss(id), timeoutMs),
    )

    return id
  }

  function infrastructureError(description?: string, dedupeKey = 'infrastructure') {
    return notify(
      {
        title: "Can't connect to search",
        description: description ?? 'Check your connection and try again.',
        variant: 'error',
      },
      {
        dedupeKey,
      },
    )
  }

  return {
    messages,
    dismiss,
    notify,
    infrastructureError,
  }
})
