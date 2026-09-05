import { buildExpression } from './buildExpression'
import type { CalculatorState, Expression } from '../domain/calculator/types'

export interface CalculatorApi { calculate(expression: Expression): Promise<number> }

export async function calculate(state: CalculatorState, api: CalculatorApi): Promise<number> {
  return api.calculate(buildExpression(state.tokens, state.currentInput))
}