import React, { useState, useCallback } from 'react'
import { Titlebar }      from '@/components/layout/Titlebar'
import { Sidebar }       from '@/components/sidebar/Sidebar'
import { NoteList }      from '@/components/notes/NoteList'
import { Editor }        from '@/components/editor/Editor'
import { NewNoteModal }  from '@/components/notes/NewNoteModal'

import { useNotes }        from '@/hooks/useNotes'
import { useFilter }       from '@/hooks/useFilter'
import { useEditor }       from '@/hooks/useEditor'
import { useNewNoteModal } from '@/hooks/useNewNoteModal'

import { TAG_DEFS } from '@/data'
import type { TagId, ViewMode } from '@/types'

export default function App() {
  // ── Data layer ───────────────────────────────────────────────────────────
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    addTagToNote,
    removeTagFromNote,
  } = useNotes()

  // ── Selection ────────────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedNote = notes.find(n => n.id === selectedId) ?? null

  // ── Filter / search / sort ───────────────────────────────────────────────
  const {
    filter,
    filteredNotes,
    recentCount,
    countByTag,
    setView,
    setTagFilter,
    setSearch,
    setSort,
  } = useFilter(notes)

  const viewLabel =
    filter.tagFilter
      ? TAG_DEFS.find(t => t.id === filter.tagFilter)?.label ?? filter.tagFilter
      : filter.view === 'recent'
      ? 'Recentes'
      : 'Todas as notas'

  // ── Editor state ─────────────────────────────────────────────────────────
  const {
    editorState,
    setTitle,
    setContent,
    markSaved,
    wordCount,
    charCount,
  } = useEditor(selectedNote)

  const handleSelectNote = useCallback(
    (id: number) => {
      // Auto-save before switching notes
      if (selectedId !== null && editorState.isDirty) {
        updateNote(selectedId, {
          title:   editorState.title,
          content: editorState.content,
        })
      }
      setSelectedId(id)
    },
    [selectedId, editorState, updateNote]
  )

  const handleSave = useCallback(() => {
    if (!selectedId) return
    updateNote(selectedId, {
      title:   editorState.title,
      content: editorState.content,
    })
    markSaved()
  }, [selectedId, editorState, updateNote, markSaved])

  const handleDelete = useCallback(() => {
    if (!selectedId) return
    if (!window.confirm('Excluir esta nota permanentemente?')) return
    deleteNote(selectedId)
    setSelectedId(null)
  }, [selectedId, deleteNote])

  const handleTogglePin = useCallback(() => {
    if (selectedId) togglePin(selectedId)
  }, [selectedId, togglePin])

  const handleAddTag = useCallback(
    (tag: TagId) => { if (selectedId) addTagToNote(selectedId, tag) },
    [selectedId, addTagToNote]
  )

  const handleRemoveTag = useCallback(
    (tag: TagId) => { if (selectedId) removeTagFromNote(selectedId, tag) },
    [selectedId, removeTagFromNote]
  )

  // ── New note modal ────────────────────────────────────────────────────────
  const {
    isOpen,
    modalTitle,
    modalTags,
    open,
    close,
    setModalTitle,
    toggleTag,
  } = useNewNoteModal()

  const handleCreate = useCallback(() => {
    const note = createNote(modalTitle, modalTags)
    close()
    setSelectedId(note.id)
    // Focus textarea after mount
    setTimeout(() => {
      const el = document.querySelector<HTMLTextAreaElement>('textarea')
      el?.focus()
    }, 80)
  }, [createNote, modalTitle, modalTags, close])

  // ── Global keyboard shortcuts ─────────────────────────────────────────────
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        open()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-100">
      <Titlebar noteCount={notes.length} onNewNote={open} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          totalCount={notes.length}
          recentCount={recentCount}
          currentView={filter.view as ViewMode}
          currentTagFilter={filter.tagFilter}
          countByTag={countByTag}
          onSetView={setView}
          onTagFilter={setTagFilter}
        />

        <NoteList
          notes={filteredNotes}
          selectedId={selectedId}
          viewLabel={viewLabel}
          searchQuery={filter.searchQuery}
          currentSort={filter.sort}
          onSelectNote={handleSelectNote}
          onSearch={setSearch}
          onSort={setSort}
          onNewNote={open}
        />

        <Editor
          note={selectedNote}
          editorState={editorState}
          wordCount={wordCount}
          charCount={charCount}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSave={handleSave}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>

      <NewNoteModal
        isOpen={isOpen}
        title={modalTitle}
        selectedTags={modalTags}
        onTitleChange={setModalTitle}
        onTagToggle={toggleTag}
        onCreate={handleCreate}
        onClose={close}
      />
    </div>
  )
}
