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
      className="group flex flex-col hover:-translate-y-1 transition-all duration-200"
    >
      {/* Khung ảnh 3:4 */}
      <div className="relative overflow-hidden bg-[#f5f5f5] rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow" style={{ aspectRatio: '2/3' }}>
        <img
          src={book.imageUrl || PLACEHOLDER}
          alt={book.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
          className="group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
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

      {/* Chữ bên dưới khung */}
      <div className="pt-2 px-0.5 flex flex-col gap-0.5">
        <p className={`text-xs font-medium ${catColor}`}>{book.categoryName}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-400">{book.author}</p>
        <div className="pt-1 flex items-end justify-between">
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
