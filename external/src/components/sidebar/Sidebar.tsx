import React from 'react'
import { TAG_DEFS } from '@/data'
import { TagDot } from '../ui/TagPill'
import type { TagId, ViewMode } from '@/types'

interface SidebarProps {
  totalCount: number
  recentCount: number
  currentView: ViewMode
  currentTagFilter: TagId | null
  countByTag: (tag: TagId) => number
  onSetView: (v: ViewMode) => void
  onTagFilter: (tag: TagId) => void
}

export function Sidebar({
  totalCount,
  recentCount,
  currentView,
  currentTagFilter,
  countByTag,
  onSetView,
  onTagFilter,
}: SidebarProps) {
  return (
    <nav className="w-[220px] bg-white border-r border-zinc-200 flex flex-col
      flex-shrink-0 overflow-hidden">

      {/* View filters */}
      <div className="px-3 pt-4 pb-2">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[.08em]
          text-zinc-400 px-2 mb-1">
          Visualizar
        </p>

        <SidebarNavItem
          icon={<AllNotesIcon />}
          label="Todas as notas"
          count={totalCount}
          active={currentView === 'all' && !currentTagFilter}
          onClick={() => onSetView('all')}
        />
        <SidebarNavItem
          icon={<RecentIcon />}
          label="Recentes"
          count={recentCount}
          active={currentView === 'recent' && !currentTagFilter}
          onClick={() => onSetView('recent')}
        />
      </div>

      <div className="mx-3 border-t border-zinc-200 my-1" />

      {/* Tag filters */}
      <div className="px-3 pt-2 pb-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[.08em]
          text-zinc-400 px-2 mb-1">
          Etiquetas
        </p>

        {TAG_DEFS.map(def => {
          const active = currentTagFilter === def.id
          const count  = countByTag(def.id)
          return (
            <button
              key={def.id}
              onClick={() => onTagFilter(def.id)}
              className={`flex items-center gap-2 px-2 py-1.25 text-[12px] font-medium cursor-pointer
                border transition-all text-left w-full
                ${active
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
            >
              <TagDot tagId={def.id} />
              {def.label}
              <span className="ml-auto font-mono text-[10px] text-zinc-400">
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ── Internal sub-components ── */

interface SidebarNavItemProps {
  icon: React.ReactNode
  label: string
  count: number
  active: boolean
  onClick: () => void
}

function SidebarNavItem({ icon, label, count, active, onClick }: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium
        border transition-all cursor-pointer
        ${active
          ? 'bg-zinc-900 text-white border-transparent'
          : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
        }`}
    >
      <span className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-white' : 'text-zinc-400'}`}>
        {icon}
      </span>
      {label}
      <span className={`ml-auto font-mono text-[10px] ${active ? 'opacity-60' : 'text-zinc-400'}`}>
        {count}
      </span>
    </button>
  )
}

function AllNotesIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14
          0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}

function RecentIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
