import { describe, expect, it } from 'vitest'
import { buildExpression } from './buildExpression'

describe('buildExpression', () => {
  it('builds a binary expression with a unary root on the right', () => {
    expect(buildExpression([
      { kind: 'number', value: '10' },
      { kind: 'operator', value: 'add' },
      { kind: 'unary', value: 'root' },
    ], '25')).toEqual({
      type: 'binary',
      operator: 'add',
      left: { type: 'literal', value: 10 },
      right: {
        type: 'unary',
        operator: 'root',
        operand: { type: 'literal', value: 25 },
      },
    })
  })

  it('applies percentage to the preceding expression', () => {
    expect(buildExpression([
      { kind: 'number', value: '25' },
      { kind: 'unary', value: 'percentage' },
    ], '')).toEqual({
      type: 'unary',
      operator: 'percentage',
      operand: { type: 'literal', value: 25 },
    })
  })

  it('rejects an incomplete unary expression', () => {
    expect(() => buildExpression([{ kind: 'unary', value: 'root' }], '')).toThrow('La expresión está incompleta')
  })
})
