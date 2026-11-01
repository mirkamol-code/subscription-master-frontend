export type SortableColumn = 'email' | 'createdAt' | 'lastLoginAt'

const FIRST_DIRECTION: Record<SortableColumn, 'ASC' | 'DESC'> = {
  email: 'ASC',
  createdAt: 'DESC',
  lastLoginAt: 'DESC',
}

export interface HeaderSort {
  ariaSort: 'ascending' | 'descending' | 'none'
  nextSort: string
}

export function getHeaderSort(currentSort: string, column: SortableColumn): HeaderSort {
  const [field, direction] = currentSort.split(',')
  if (field !== column) return { ariaSort: 'none', nextSort: `${column},${FIRST_DIRECTION[column]}` }
  return direction === 'ASC'
    ? { ariaSort: 'ascending', nextSort: `${column},DESC` }
    : { ariaSort: 'descending', nextSort: `${column},ASC` }
}
