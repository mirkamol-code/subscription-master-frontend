export const SORT_OPTIONS = [
  { value: 'nextPaymentDate,ASC', label: 'Renews soonest' },
  { value: 'nextPaymentDate,DESC', label: 'Renews latest' },
  { value: 'price,DESC', label: 'Price: high to low' },
  { value: 'price,ASC', label: 'Price: low to high' },
  { value: 'name,ASC', label: 'Name: A–Z' },
] as const

export const DEFAULT_SORT = SORT_OPTIONS[0].value

export interface FilterValues {
  name: string
  status: string
  category: string
  currency: string
  minPrice: string
  maxPrice: string
  sort: string
}
