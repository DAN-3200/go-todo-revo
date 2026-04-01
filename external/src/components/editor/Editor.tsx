import React, { useRef, useState, useEffect } from 'react'
import { TagPill } from '../ui/TagPill'
import { TagPicker } from '../ui/TagPicker'
import { IconButton } from '../ui/IconButton'
import { Tooltip } from '../ui/Tooltip'
import type { Note, TagId } from '@/types'
import type { EditorState } from '@/hooks/useEditor'

function formatDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface EditorProps {
  note: Note | null
  editorState: EditorState
  wordCount: number
  charCount: number
  onTitleChange: (v: string) => void
  onContentChange: (v: string) => void
  onSave: () => void
  onDelete: () => void
  onTogglePin: () => void
  onAddTag: (tag: TagId) => void
  onRemoveTag: (tag: TagId) => void
}

export function Editor({
  note,
  editorState,
  wordCount,
  charCount,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
  onTogglePin,
  onAddTag,
  onRemoveTag,
}: EditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [copied, setCopied]         = useState(false)
  const addTagBtnRef = useRef<HTMLButtonElement>(null)

  // Ctrl/Cmd+S → save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (note) onSave()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [note, onSave])

  // Close picker when note changes
  useEffect(() => { setPickerOpen(false) }, [note?.id])

  function handleCopy() {
    if (!note) return
    const text = `${editorState.title}\n\n${editorState.content}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  if (!note) return <EmptyState />

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden transition-colors duration-300
        ${editorState.savedFlash ? 'bg-green-50' : 'bg-white'}`}
    >
      {/* ── Header ── */}
      <div className="border-b border-zinc-200 px-6 pt-5 pb-4 flex-shrink-0">
        <input
          type="text"
          value={editorState.title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Título da nota"
          className="w-full text-[22px] font-bold tracking-tight text-zinc-900
            bg-transparent border-none outline-none placeholder:text-zinc-300 mb-3"
        />

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Meta: date + tags */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] text-zinc-400">
              {formatDate(note.updatedAt)}
            </span>

            <div className="flex items-center gap-1.5 flex-wrap relative">
              {note.tags.map(tag => (
                <TagPill key={tag} tagId={tag} onRemove={onRemoveTag} />
              ))}

              <button
                ref={addTagBtnRef}
                onClick={() => setPickerOpen(v => !v)}
                className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400
                  border border-dashed border-zinc-300 px-2 py-[3px]
                  hover:text-zinc-700 hover:border-zinc-500 transition-colors"
              >
                + etiqueta
              </button>

              {pickerOpen && (
                <TagPicker
                  activeTags={note.tags}
                  onToggle={tag =>
                    note.tags.includes(tag) ? onRemoveTag(tag) : onAddTag(tag)
                  }
                  onClose={() => setPickerOpen(false)}
                  anchorRef={addTagBtnRef}
                />
              )}
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1">
            <Tooltip text={note.isPinned ? 'Desafixar' : 'Fixar nota'}>
              <IconButton
                label={note.isPinned ? 'Desafixar' : 'Fixar nota'}
                active={note.isPinned}
                onClick={onTogglePin}
              >
                <svg className="w-3.5 h-3.5" fill={note.isPinned ? 'currentColor' : 'none'}
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </IconButton>
            </Tooltip>

            <Tooltip text={copied ? 'Copiado!' : 'Copiar nota'}>
              <IconButton label="Copiar nota" onClick={handleCopy}>
                {copied
                  ? (
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )
                }
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <textarea
          value={editorState.content}
          onChange={e => onContentChange(e.target.value)}
          placeholder="Comece a escrever sua nota aqui…"
          className="w-full h-full resize-none text-[14px] leading-7 text-zinc-800
            bg-transparent border-none outline-none placeholder:text-zinc-300"
        />
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-zinc-200 px-6 py-2.5 flex items-center
        justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-400">
            {wordCount} palavra{wordCount !== 1 ? 's' : ''}
          </span>
          <span className="font-mono text-[10px] text-zinc-300">·</span>
          <span className="font-mono text-[10px] text-zinc-400">
            {charCount} caractere{charCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="h-7 px-3 text-[12px] font-medium text-zinc-500 border border-zinc-300
              hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all"
          >
            Excluir
          </button>
          <button
            onClick={onSave}
            disabled={!editorState.isDirty}
            className={`h-7 px-4 text-[12px] font-semibold transition-colors
              ${editorState.isDirty
                ? 'bg-zinc-900 text-white hover:bg-zinc-700'
                : 'bg-zinc-100 text-zinc-400 cursor-default'
              }`}
          >
            {editorState.isDirty ? 'Salvar' : 'Salvo ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3
      text-zinc-300 bg-white">
      <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
            m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <p className="text-[13px]">Selecione uma nota para editar</p>
    </div>
  )
}
