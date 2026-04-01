import { useState, useEffect } from 'react'

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Handles serialization and Date revival automatically.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initialValue
      return JSON.parse(raw, dateReviver) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored))
    } catch {
      // storage quota exceeded or private mode — fail silently
    }
  }, [key, stored])

  return [stored, setStored]
}

/** Revive ISO date strings back to Date objects */
function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value)
  }
  return value
}
