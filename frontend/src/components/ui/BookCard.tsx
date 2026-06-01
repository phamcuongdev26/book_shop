import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { BookSummary } from '../../types'

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export function BookCard({ book }: { book: BookSummary }) {
  const effectivePrice = book.discountPrice ?? book.price
  const hasDiscount = book.discountPrice != null && book.discountPrice < book.price
  const outOfStock = book.status === 'OUT_OF_STOCK'

  return (
    <Link to={`/books/${book.id}`} className="card group flex flex-col hover:shadow-md transition-shadow">
      <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden rounded-t-xl">
        <img
          src={book.imageUrl || PLACEHOLDER}
          aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(18px)', transform: 'scale(1.15)', opacity: 0.55 }}
        />
        <img
          src={book.imageUrl || PLACEHOLDER}
          alt={book.title}
          className="absolute inset-0 h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 border border-gray-300 px-2 py-1 rounded-full bg-white">Hết hàng</span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 badge bg-red-100 text-red-700">
            -{Math.round((1 - effectivePrice / book.price) * 100)}%
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-gray-400">{book.categoryName}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500">{book.author}</p>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{formatPrice(effectivePrice)}</p>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(book.price)}</p>
            )}
          </div>
          {book.avgRating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-500">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {book.avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
