export function getBackgroundGradient(budget: number, spent: number): string {
  if (budget <= 0) {
    return 'linear-gradient(160deg, #fffefc 0%, #fdf9ef 50%, #faf3e2 100%)'
  }

  const ratio = (budget - spent) / budget

  if (ratio >= 0.7) return 'linear-gradient(160deg, #f8fbff 0%, #eef4ff 50%, #e3edff 100%)'
  if (ratio >= 0.5) return 'linear-gradient(160deg, #f8fdf9 0%, #edf8f0 50%, #e0f4e8 100%)'
  if (ratio >= 0.3) return 'linear-gradient(160deg, #fffefc 0%, #fdf9ef 50%, #faf3e2 100%)'
  return 'linear-gradient(160deg, #fff9f8 0%, #fef0ee 50%, #fde5e2 100%)'
}
