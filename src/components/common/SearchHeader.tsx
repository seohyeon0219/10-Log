import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type SearchHeaderProps = {
  onSearch: () => void
}

export default function SearchHeader({ onSearch }: SearchHeaderProps) {
  return (
    <header className="flex h-12 items-center justify-end">
      <button
        aria-label="소비내역 검색"
        className="flex h-9 w-9 items-center justify-center rounded-full transition active:opacity-50"
        onClick={onSearch}
        type="button"
      >
        <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-(--color-text-sand)" />
      </button>
    </header>
  )
}
