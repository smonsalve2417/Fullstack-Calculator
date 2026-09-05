import type { BinaryOperator, Expression, Token } from '../domain/calculator/types'

const precedence: Record<BinaryOperator, number> = { add: 1, subtract: 1, multiply: 2, divide: 2, power: 3 }

export function buildExpression(tokens: Token[], currentInput: string): Expression {
  const values: Expression[] = []
  const operators: BinaryOperator[] = []
  const completeTokens: Token[] = [...tokens, { kind: 'number', value: currentInput }]
  for (const token of completeTokens) {
    if (token.kind === 'number') {
      const value = Number(token.value)
      if (!Number.isFinite(value)) throw new Error('El número no es válido')
      values.push({ type: 'literal', value })
    } else {
      while (operators.length && precedence[operators.at(-1)!] >= precedence[token.value]) reduce(values, operators.pop()!)
      operators.push(token.value)
    }
  }
  while (operators.length) reduce(values, operators.pop()!)
  if (values.length !== 1) throw new Error('La expresión está incompleta')
  return values[0]
}

function reduce(values: Expression[], operator: BinaryOperator): void {
  const right = values.pop(); const left = values.pop()
  if (!left || !right) throw new Error('La expresión está incompleta')
  values.push({ type: 'binary', operator, left, right })
}