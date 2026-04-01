import { useCallback } from 'react'
import type { Note, TagId } from '../types'
import { SEED_NOTES } from '../data'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'notes-app:notes'
const NEXT_ID_KEY = 'notes-app:nextId'

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, SEED_NOTES)
  const [nextId, setNextId] = useLocalStorage<number>(NEXT_ID_KEY, SEED_NOTES.length + 1)

  const createNote = useCallback(
    (title: string, tags: TagId[]): Note => {
      const now = new Date()
      const note: Note = {
        id: nextId,
        title: title.trim() || 'Nova nota',
        content: '',
        tags,
        createdAt: now,
        updatedAt: now,
        isPinned: false,
      }
      setNotes(prev => [note, ...prev])
      setNextId(id => id + 1)
      return note
    },
    [nextId, setNotes, setNextId]
  )

  const updateNote = useCallback(
    (id: number, patch: Partial<Pick<Note, 'title' | 'content' | 'tags'>>) => {
      setNotes(prev =>
        prev.map(n =>
          n.id === id ? { ...n, ...patch, updatedAt: new Date() } : n
        )
      )
    },
    [setNotes]
  )

  const deleteNote = useCallback(
    (id: number) => setNotes(prev => prev.filter(n => n.id !== id)),
    [setNotes]
  )

  const togglePin = useCallback(
    (id: number) =>
      setNotes(prev =>
        prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
      ),
    [setNotes]
  )

  const addTagToNote = useCallback(
    (id: number, tag: TagId) =>
      setNotes(prev =>
        prev.map(n =>
          n.id === id && !n.tags.includes(tag)
            ? { ...n, tags: [...n.tags, tag] }
            : n
        )
      ),
    [setNotes]
  )

  const removeTagFromNote = useCallback(
    (id: number, tag: TagId) =>
      setNotes(prev =>
        prev.map(n =>
          n.id === id ? { ...n, tags: n.tags.filter(t => t !== tag) } : n
        )
      ),
    [setNotes]
  )

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    addTagToNote,
    removeTagFromNote,
  }
}
