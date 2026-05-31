import { Link } from 'react-router-dom'
import { Star, ShoppingBag } from 'lucide-react'

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

const CAT_COLORS = [
  'text-indigo-500',
  'text-emerald-500',
  'text-amber-500',
  'text-rose-500',
  'text-violet-500',
  'text-cyan-500',
  'text-orange-500',
  'text-teal-500',
]

export function BookCard({ book, colorIndex = 0 }) {
  const effectivePrice = book.discountPrice ?? book.price
  const hasDiscount = book.discountPrice != null && book.discountPrice < book.price
  const outOfStock = book.status === 'OUT_OF_STOCK'
  const catColor = CAT_COLORS[colorIndex % CAT_COLORS.length]

  return (
    <Link
      to={`/books/${book.id}`}
      className="card group flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative aspect-[3/4] bg-white overflow-hidden">
        <img
          src={book.imageUrl || PLACEHOLDER}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 border border-gray-300 px-2 py-1 rounded-full bg-white shadow-sm">
              Hết hàng
            </span>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 badge bg-rose-500 text-white shadow-sm">
            -{Math.round((1 - effectivePrice / book.price) * 100)}%
          </span>
        )}
        {!outOfStock && !hasDiscount && book.avgRating >= 4.5 && (
          <span className="absolute top-2 left-2 badge bg-amber-400 text-amber-900 shadow-sm">
            Hot
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className={`text-xs font-medium ${catColor}`}>{book.categoryName}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-3 leading-snug group-hover:text-indigo-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-400">{book.author}</p>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-indigo-600">{formatPrice(effectivePrice)}</p>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(book.price)}</p>
            )}
          </div>
          {book.avgRating > 0 ? (
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {book.avgRating.toFixed(1)}
            </span>
          ) : (
            <ShoppingBag className="h-4 w-4 text-gray-300" />
          )}
        </div>
      </div>
    </Link>
  )
}
