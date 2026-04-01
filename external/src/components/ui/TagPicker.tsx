import React, { useEffect, useRef } from 'react'
import { TAG_DEFS } from '@/data'
import { TagDot } from './TagPill'
import type { TagId } from '@/types'

interface TagPickerProps {
  activeTags: TagId[]
  onToggle: (tag: TagId) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLButtonElement>
}

export function TagPicker({ activeTags, onToggle, onClose, anchorRef }: TagPickerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, anchorRef])

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-50 mt-1 bg-white border border-zinc-300
        shadow-lg min-w-[160px]"
    >
      {TAG_DEFS.map(def => {
        const active = activeTags.includes(def.id)
        return (
          <button
            key={def.id}
            onClick={() => onToggle(def.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-[12px]
              font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <TagDot tagId={def.id} />
            {def.label}
            {active && (
              <svg className="ml-auto w-3 h-3 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
