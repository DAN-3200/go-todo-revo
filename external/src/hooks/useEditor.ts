import { useState, useCallback, useEffect } from 'react'
import type { Note } from '../types'

export interface EditorState {
  title: string
  content: string
  isDirty: boolean
  savedFlash: boolean
}

export function useEditor(selectedNote: Note | null) {
  const [state, setState] = useState<EditorState>({
    title: '',
    content: '',
    isDirty: false,
    savedFlash: false,
  })

  // Sync when the selected note changes
  useEffect(() => {
    if (selectedNote) {
      setState({
        title: selectedNote.title,
        content: selectedNote.content,
        isDirty: false,
        savedFlash: false,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote?.id])

  const setTitle = useCallback((title: string) => {
    setState(s => ({ ...s, title, isDirty: true }))
  }, [])

  const setContent = useCallback((content: string) => {
    setState(s => ({ ...s, content, isDirty: true }))
  }, [])

  const markSaved = useCallback(() => {
    setState(s => ({ ...s, isDirty: false, savedFlash: true }))
    setTimeout(() => setState(s => ({ ...s, savedFlash: false })), 500)
  }, [])

  const wordCount = state.content.trim()
    ? state.content.trim().split(/\s+/).length
    : 0

  const charCount = state.content.length

  return { editorState: state, setTitle, setContent, markSaved, wordCount, charCount }
}
