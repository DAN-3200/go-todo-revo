export type TagId = 'work' | 'personal' | 'idea' | 'urgent' | 'ref'

export interface TagDef {
  id: TagId
  label: string
  cls: string
}

export interface Note {
  id: number
  title: string
  content: string
  tags: TagId[]
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
}

export type ViewMode = 'all' | 'recent'
export type SortMode = 'updated' | 'created' | 'title'

export interface FilterState {
  view: ViewMode
  tagFilter: TagId | null
  searchQuery: string
  sort: SortMode
}
