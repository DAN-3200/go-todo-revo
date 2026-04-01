import React from 'react'
import { TagPill } from '../ui/TagPill'
import type { Note } from '@/types'

function formatDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface NoteCardProps {
  note: Note
  isSelected: boolean
  onClick: () => void
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  const preview = note.content.replace(/\n/g, ' ').substring(0, 100)

  return (
    <div
      onClick={onClick}
      className={`relative px-3.5 py-3 border-b border-zinc-100 cursor-pointer
        transition-colors border-l-2 group
        ${isSelected
          ? 'bg-green-50 border-l-zinc-900'
          : 'hover:bg-zinc-50 border-l-transparent'
        }`}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <span className="absolute top-2.5 right-3 text-zinc-300" title="Fixada">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
        </span>
      )}

      <p className="text-[13px] font-semibold tracking-tight truncate mb-1 text-zinc-900 pr-4">
        {note.title}
      </p>
      <p className="text-[11.5px] text-zinc-500 leading-relaxed line-clamp-2 mb-2">
        {preview.length < note.content.replace(/\n/g, ' ').length ? preview + '…' : preview}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <TagPill key={tag} tagId={tag} />
          ))}
        </div>
        <span className="font-mono text-[9.5px] text-zinc-400 whitespace-nowrap flex-shrink-0">
          {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  )
}
