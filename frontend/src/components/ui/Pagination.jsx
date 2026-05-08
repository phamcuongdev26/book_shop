import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageRange(page, totalPages) {
  const delta = 2
  const pages = []
  let last = -1

  for (let i = 0; i < totalPages; i++) {
    const isEdge = i === 0 || i === totalPages - 1
    const isNearCurrent = i >= page - delta && i <= page + delta
    if (isEdge || isNearCurrent) {
      if (last !== -1 && i - last > 1) pages.push('…')
      pages.push(i)
      last = i
    }
  }
  return pages
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = getPageRange(page, totalPages)

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Trước
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} className="px-2 py-1.5 text-gray-400 select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages - 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Sau <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
