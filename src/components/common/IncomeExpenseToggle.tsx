import SegmentedControl from './SegmentedControl'
import type { TransactionType } from '../../types/finance'

const options = [
  { label: '지출', value: 'expense' as const },
  { label: '수입', value: 'income' as const },
]

type Props = {
  onChange: (type: TransactionType) => void
  value: TransactionType
}

export default function IncomeExpenseToggle({ onChange, value }: Props) {
  return <SegmentedControl onChange={onChange} options={options} value={value} />
}
