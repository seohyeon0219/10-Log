type MenuItemProps = {
  label: string
  onClick: () => void
}

export default function MenuItem({ label, onClick }: MenuItemProps) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition active:bg-gray-50"
      onClick={onClick}
      type="button"
    >
      <span className="text-[15px] font-semibold text-gray-900">{label}</span>
      <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 7 12" width="7">
        <path d="M1 1l5 5-5 5" stroke="#C0C0C0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </button>
  )
}
