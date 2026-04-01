import React from 'react'
import { TAG_DEFS } from '@/data'
import type { TagId } from '@/types'

export const TAG_PILL_STYLES: Record<string, string> = {
  work:     'bg-blue-50 text-blue-700 border-blue-300',
  personal: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300',
  idea:     'bg-amber-50 text-amber-800 border-amber-300',
  urgent:   'bg-rose-50 text-rose-700 border-rose-300',
  ref:      'bg-green-50 text-green-700 border-green-300',
}

export const TAG_DOT_STYLES: Record<string, string> = {
  work:     'bg-blue-300',
  personal: 'bg-fuchsia-400',
  idea:     'bg-amber-400',
  urgent:   'bg-rose-300',
  ref:      'bg-green-300',
}

interface TagPillProps {
  tagId: TagId
  onRemove?: (tag: TagId) => void
  size?: 'xs' | 'sm'
}

export function TagPill({ tagId, onRemove, size = 'xs' }: TagPillProps) {
  const def = TAG_DEFS.find(t => t.id === tagId)
  if (!def) return null

  const sizeClass = size === 'xs'
    ? 'text-[9.5px] px-[7px] py-[3px]'
    : 'text-[11px] px-2 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 border font-mono font-medium
        tracking-wide leading-none ${sizeClass} ${TAG_PILL_STYLES[def.cls]}`}
    >
      {def.label}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(tagId) }}
          className="opacity-50 hover:opacity-100 transition-opacity ml-0.5 leading-none cursor-pointer"
          aria-label={`Remover ${def.label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

interface TagDotProps {
  tagId: TagId
  className?: string
}

export function TagDot({ tagId, className = '' }: TagDotProps) {
  const def = TAG_DEFS.find(t => t.id === tagId)
  if (!def) return null
  return (
    <span
      className={`inline-block w-[7px] h-[7px] flex-shrink-0 ${TAG_DOT_STYLES[def.cls]} ${className}`}
    />
  )
}
