import { describe, expect, it } from 'vitest'
import { formatFileSize } from '@/lib/file-size'

describe('formatFileSize', () => {
  it.each([
    [0, '0 B'],
    [512, '512 B'],
    [1536, '1.5 KB'],
    [2_500_000, '2.4 MB'],
    [-1, '—'],
  ])('shows %i bytes as %s', (bytes, expected) => {
    // when
    const size = formatFileSize(bytes)

    // then
    expect(size).toBe(expected)
  })
})
