import React, { useRef, useState } from 'react'
import { NoteCard } from './NoteCard'
import { IconButton } from '../ui/IconButton'
import type { Note, SortMode } from '@/types'

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'updated', label: 'Última edição' },
  { value: 'created', label: 'Data de criação' },
  { value: 'title',   label: 'Título (A–Z)' },
]

interface NoteListProps {
  notes: Note[]
  selectedId: number | null
  viewLabel: string
  searchQuery: string
  currentSort: SortMode
  onSelectNote: (id: number) => void
  onSearch: (q: string) => void
  onSort: (s: SortMode) => void
  onNewNote: () => void
}

export function NoteList({
  notes,
  selectedId,
  viewLabel,
  searchQuery,
  currentSort,
  onSelectNote,
  onSearch,
  onSort,
  onNewNote,
}: NoteListProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef  = useRef<HTMLDivElement>(null)

  function handleSortPick(s: SortMode) {
    onSort(s)
    setSortOpen(false)
  }

  return (
    <div className="w-[300px] bg-white border-r border-zinc-200 flex flex-col
      flex-shrink-0 overflow-hidden">

      {/* Pane header */}
      <div className="h-11 border-b border-zinc-200 px-3.5 flex items-center
        justify-between flex-shrink-0">
        <span className="text-[12px] font-semibold tracking-tight">{viewLabel}</span>
        <div className="flex items-center gap-1">

          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <IconButton
              label="Ordenar"
              active={sortOpen}
              onClick={() => setSortOpen(v => !v)}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </IconButton>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-white border
                border-zinc-200 shadow-lg min-w-[160px]">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortPick(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2
                      text-[12px] font-medium hover:bg-zinc-50 transition-colors
                      ${currentSort === opt.value ? 'text-zinc-900' : 'text-zinc-500'}`}
                  >
                    {opt.label}
                    {currentSort === opt.value && (
                      <svg className="w-3 h-3 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <IconButton label="Nova nota" onClick={onNewNote}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </IconButton>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-zinc-200 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
            text-zinc-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar notas…"
            className="w-full h-[30px] pl-8 pr-3 border border-zinc-300 bg-zinc-50
              text-[12px] text-zinc-900 outline-none focus:border-zinc-900 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400
                hover:text-zinc-700 text-[14px] leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Note cards */}
      <div className="overflow-y-auto flex-1">
        {notes.length === 0 ? (
          <p className="text-center text-[12px] text-zinc-400 py-10">
            Nenhuma nota encontrada
          </p>
        ) : (
          notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedId}
              onClick={() => onSelectNote(note.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
