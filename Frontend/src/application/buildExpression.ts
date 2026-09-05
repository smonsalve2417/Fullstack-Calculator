import type { BinaryOperator, Expression, Token, UnaryOperator } from '../domain/calculator/types'

const precedence: Record<BinaryOperator, number> = { add: 1, subtract: 1, multiply: 2, divide: 2, power: 3 }

export function buildExpression(tokens: Token[], currentInput: string): Expression {
  const values: Expression[] = []
  const operators: BinaryOperator[] = []
  const pendingUnaryOperators: UnaryOperator[] = []
  const completeTokens: Token[] = currentInput === ''
    ? tokens
    : [...tokens, { kind: 'number', value: currentInput }]
  for (const token of completeTokens) {
    if (token.kind === 'number') {
      const value = Number(token.value)
      if (!Number.isFinite(value)) throw new Error('El número no es válido')
      let expression: Expression = { type: 'literal', value }
      while (pendingUnaryOperators.length) {
        expression = { type: 'unary', operator: pendingUnaryOperators.pop()!, operand: expression }
      }
      values.push(expression)
    } else if (token.kind === 'unary') {
      if (token.value === 'percentage') {
        const operand = values.pop()
        if (!operand) throw new Error('La expresión está incompleta')
        values.push({ type: 'unary', operator: token.value, operand })
      } else {
        pendingUnaryOperators.push(token.value)
      }
    } else {
      while (operators.length && precedence[operators.at(-1)!] >= precedence[token.value]) reduce(values, operators.pop()!)
      operators.push(token.value)
    }
  }
  while (operators.length) reduce(values, operators.pop()!)
  if (pendingUnaryOperators.length) throw new Error('La expresión está incompleta')
  if (values.length !== 1) throw new Error('La expresión está incompleta')
  return values[0]
}

function reduce(values: Expression[], operator: BinaryOperator): void {
  const right = values.pop(); const left = values.pop()
  if (!left || !right) throw new Error('La expresión está incompleta')
  values.push({ type: 'binary', operator, left, right })
}