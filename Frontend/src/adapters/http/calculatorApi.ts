import type { CalculatorApi } from '../../application/calculate'
import type { Expression } from '../../domain/calculator/types'

type ResponseBody = { result: number } | { error?: { message?: string } }

export class HttpCalculatorApi implements CalculatorApi {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async calculate(expression: Expression): Promise<number> {
    const response = await fetch(`${this.baseUrl}/api/v1/calculations`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(expression),
    })
    const body = (await response.json()) as ResponseBody
    if (!response.ok) throw new Error('error' in body ? body.error?.message ?? 'No se pudo calcular' : 'No se pudo calcular')
    return (body as { result: number }).result
  }
}