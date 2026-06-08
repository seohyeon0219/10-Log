type ReviewStarRatingProps = {
  label: string
  onChange: (rating: number) => void
  value: number
}

export default function ReviewStarRating({ label, onChange, value }: ReviewStarRatingProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold text-stone-500">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isActive = rating <= value

          return (
            <button
              aria-label={`${label} ${rating}점`}
              aria-pressed={isActive}
              className={[
                'grid h-10 w-10 place-items-center rounded-full text-lg font-black transition active:scale-95',
                isActive
                  ? 'bg-amber-200 shadow-sm'
                  : 'bg-white text-stone-300 ring-1 ring-stone-200 hover:text-stone-400',
              ].join(' ')}
              key={rating}
              onClick={() => onChange(rating)}
              type="button"
            >
              ★
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
