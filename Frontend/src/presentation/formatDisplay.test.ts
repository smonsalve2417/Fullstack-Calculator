import { describe, expect, it } from 'vitest'
import { formatDisplayNumber } from './formatDisplay'

describe('formatDisplayNumber', () => {
  it('uses scientific notation from 1e10', () => {
    expect(formatDisplayNumber('10000000000')).toBe('1E10')
  })

  it('keeps smaller values in decimal notation', () => {
    expect(formatDisplayNumber('9999999999')).toBe('9999999999')
  })
})
