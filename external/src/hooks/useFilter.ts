import { useState, useCallback, useMemo } from 'react'
import type { Note, TagId, ViewMode, SortMode, FilterState } from '../types'

const RECENT_DAYS = 7

function isRecent(note: Note): boolean {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - RECENT_DAYS)
  return note.updatedAt >= cutoff
}

function sortNotes(list: Note[], sort: SortMode): Note[] {
  const pinned = list.filter(n => n.isPinned)
  const rest   = list.filter(n => !n.isPinned)

  const comparator: Record<SortMode, (a: Note, b: Note) => number> = {
    updated: (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    created: (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    title:   (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
  }

  const fn = comparator[sort]
  return [...pinned.sort(fn), ...rest.sort(fn)]
}

export function useFilter(notes: Note[]) {
  const [filter, setFilter] = useState<FilterState>({
    view: 'all',
    tagFilter: null,
    searchQuery: '',
    sort: 'updated',
  })

  const setView = useCallback((view: ViewMode) => {
    setFilter(f => ({ ...f, view, tagFilter: null }))
  }, [])

  const setTagFilter = useCallback((tag: TagId) => {
    setFilter(f => ({
      ...f,
      tagFilter: f.tagFilter === tag ? null : tag,
      view: 'all',
    }))
  }, [])

  const setSearch = useCallback((q: string) => {
    setFilter(f => ({ ...f, searchQuery: q }))
  }, [])

  const setSort = useCallback((sort: SortMode) => {
    setFilter(f => ({ ...f, sort }))
  }, [])

  const filteredNotes = useMemo(() => {
    let list = [...notes]

    if (filter.view === 'recent') list = list.filter(isRecent)
    if (filter.tagFilter)         list = list.filter(n => n.tags.includes(filter.tagFilter!))

    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase()
      list = list.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    }

    return sortNotes(list, filter.sort)
  }, [notes, filter])

  const recentCount = useMemo(() => notes.filter(isRecent).length, [notes])

  const countByTag = useCallback(
    (tag: TagId) => notes.filter(n => n.tags.includes(tag)).length,
    [notes]
  )

  return {
    filter,
    filteredNotes,
    recentCount,
    countByTag,
    setView,
    setTagFilter,
    setSearch,
    setSort,
  }
}
