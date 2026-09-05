export function formatDisplayNumber(value: string): string {
  const number = Number(value)

  if (!Number.isFinite(number) || number === 0) return value

  const absoluteValue = Math.abs(number)

    if (absoluteValue >= 1e10) {
      return number.toExponential().replace('e+', 'E').replace('e-', 'E-')
  }

  return value
}