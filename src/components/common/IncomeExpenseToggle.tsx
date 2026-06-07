export type IncomeExpenseType = 'income' | 'expense'

type IncomeExpenseToggleProps = {
  onChange: (type: IncomeExpenseType) => void
  value: IncomeExpenseType
}

const options: Array<{ id: IncomeExpenseType; label: string }> = [
  { id: 'expense', label: '지출' },
  { id: 'income', label: '수입' },
]

export default function IncomeExpenseToggle({ onChange, value }: IncomeExpenseToggleProps) {
  return (
    <div className="inline-flex w-auto shrink-0 rounded-lg bg-gray-100 p-1">
      {options.map((option) => (
        <button
          aria-pressed={option.id === value}
          className={[
            'min-h-8 cursor-pointer rounded-md border-0 px-3 text-sm font-extrabold transition max-[380px]:px-2.5',
            option.id === value ? 'bg-white text-black shadow-sm' : 'bg-transparent text-gray-400',
          ].join(' ')}
          key={option.id}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
