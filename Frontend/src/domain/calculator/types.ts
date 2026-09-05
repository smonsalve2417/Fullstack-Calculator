export type BinaryOperator = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' 

export type UnaryOperator = 'root' | 'percentage'

export type Token =
  | { kind: 'number'; value: string }
  | { kind: 'operator'; value: BinaryOperator }
  | { kind: 'unary'; value: UnaryOperator }

export type Expression =
  | { type: 'literal'; value: number }
  | { type: 'unary'; operator: UnaryOperator; operand: Expression }
  | { type: 'binary'; operator: BinaryOperator; left: Expression; right: Expression }

export type CalculatorState = {
  tokens: Token[]
  currentInput: string
  justEvaluated: boolean
  error: string | null
}

export type CalculatorAction =
  | { type: 'digit'; value: string }
  | { type: 'decimal' }
  | { type: 'operator'; value: BinaryOperator | UnaryOperator }
  | { type: 'backspace' }
  | { type: 'clear' }
  | { type: 'result'; value: number }
  | { type: 'error'; message: string }

export const initialCalculatorState: CalculatorState = {
  tokens: [], currentInput: '', justEvaluated: false, error: null,
}