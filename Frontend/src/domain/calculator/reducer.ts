import type { CalculatorAction, CalculatorState, Token } from './types'
import { initialCalculatorState } from './types'

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'digit': {
      const base = state.justEvaluated ? initialCalculatorState : state
      return { ...base, currentInput: base.currentInput === '0' ? action.value : `${base.currentInput}${action.value}`, error: null }
    }
    case 'decimal': {
      const base = state.justEvaluated ? initialCalculatorState : state
      return base.currentInput.includes('.') ? base : { ...base, currentInput: `${base.currentInput}.`, error: null }
    }
    case 'operator': {
      const tokens = appendNumber(state.justEvaluated ? [] : [...state.tokens], state.currentInput)
      const last = tokens.at(-1)
      if (last?.kind === 'operator') tokens[tokens.length - 1] = { kind: 'operator', value: action.value }
      else tokens.push({ kind: 'operator', value: action.value })
      return { ...state, tokens, currentInput: '0', justEvaluated: false, error: null }
    }
    case 'backspace':
      return { ...state, currentInput: state.currentInput.length > 1 ? state.currentInput.slice(0, -1) : '0', error: null }
    case 'clear': return initialCalculatorState
    case 'result': return { ...initialCalculatorState, currentInput: String(action.value), justEvaluated: true }
    case 'error': return { ...state, error: action.message }
  }
}

function appendNumber(tokens: Token[], value: string): Token[] {
  const last = tokens.at(-1)
  if (last?.kind === 'number') tokens[tokens.length - 1] = { kind: 'number', value }
  else tokens.push({ kind: 'number', value })
  return tokens
}