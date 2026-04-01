import React, { useEffect, useRef } from 'react'
import { TAG_DEFS } from '@/data'
import { TagPill } from '../ui/TagPill'
import type { TagId } from '@/types'

interface NewNoteModalProps {
  isOpen: boolean
  title: string
  selectedTags: TagId[]
  onTitleChange: (v: string) => void
  onTagToggle: (tag: TagId) => void
  onCreate: () => void
  onClose: () => void
}

export function NewNoteModal({
  isOpen,
  title,
  selectedTags,
  onTitleChange,
  onTagToggle,
  onCreate,
  onClose,
}: NewNoteModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80)
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onCreate()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose, onCreate])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border border-zinc-300 w-[420px] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <span className="text-sm font-semibold tracking-tight">Nova nota</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-zinc-400
              hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-zinc-500 tracking-wide uppercase">
              Título
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onCreate() }}
              placeholder="Ex: Reunião de alinhamento"
              className="h-9 border border-zinc-300 bg-zinc-50 px-3 text-[13px]
                text-zinc-900 outline-none focus:border-zinc-900 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-zinc-500 tracking-wide uppercase">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_DEFS.map(def => (
                <button
                  key={def.id}
                  onClick={() => onTagToggle(def.id)}
                  className={`transition-opacity ${
                    selectedTags.includes(def.id) ? 'opacity-100' : 'opacity-35 hover:opacity-70'
                  }`}
                >
                  <TagPill tagId={def.id} size="sm" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-zinc-200">
          <button
            onClick={onClose}
            className="h-8 px-4 text-[12px] font-medium text-zinc-600 border
              border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onCreate}
            className="h-8 px-4 text-[12px] font-semibold bg-zinc-900 text-white
              hover:bg-zinc-700 transition-colors"
          >
            Criar nota
          </button>
        </div>
      </div>
    </div>
  )
}
