export function formatDuration(duration: number) {
  if (duration < 60) {
    return `${duration}s`
  }

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  if (seconds === 0) {
    return `${minutes}m`
  }

  return `${minutes}m ${seconds}s`
}

export function formatCompactDuration(duration: number) {
  if (duration < 60) {
    return `${duration}s`
  }

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

export function formatListenCount(count: number) {
  return count === 1 ? '1 listen' : `${count} listens`
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
