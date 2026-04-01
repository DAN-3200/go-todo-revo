import { useState, useCallback } from 'react'
import type { TagId } from '../types'

export function useNewNoteModal() {
  const [isOpen, setIsOpen]         = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalTags, setModalTags]   = useState<TagId[]>([])

  const open = useCallback(() => {
    setModalTitle('')
    setModalTags([])
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const toggleTag = useCallback((tag: TagId) => {
    setModalTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }, [])

  return { isOpen, modalTitle, modalTags, open, close, setModalTitle, toggleTag }
}
