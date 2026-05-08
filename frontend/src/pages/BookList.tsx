import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { BookCard } from '../components/ui/BookCard'
import { Pagination } from '../components/ui/Pagination'
import { PageSpinner } from '../components/ui/Spinner'
import type { BookSummary, CategoryResponse } from '../types'

const PAGE_SIZE = 12

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  const page = Number(searchParams.get('page') || '0')

  const [books, setBooks] = useState<BookSummary[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    categoriesApi.getAll().then((res) => setCategories(res.data.result.filter((c) => c.active)))
  }, [])

  const fetchBooks = useCallback(() => {
    setLoading(true)
    const params = { page, size: PAGE_SIZE, categoryId, minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined }
    const req = keyword
      ? booksApi.search({ keyword, page, size: PAGE_SIZE })
      : booksApi.getAll(params)
    req.then((res) => {
      setBooks(res.data.result.content)
      setTotalPages(res.data.result.totalPages)
      setTotalElements(res.data.result.totalElements)
    }).finally(() => setLoading(false))
  }, [keyword, categoryId, page, minPrice, maxPrice])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const setPage = (p: number) => {
    setSearchParams((prev) => { prev.set('page', String(p)); return prev })
  }

  const setCategory = (id?: number) => {
    setSearchParams((prev) => {
      prev.delete('page')
      prev.delete('q')
      if (id) prev.set('categoryId', String(id))
      else prev.delete('categoryId')
      return prev
    })
  }

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice('')
    setSearchParams({})
  }

  const activeCategoryName = categories.find((c) => c.id === categoryId)?.name

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {keyword ? `Kết quả cho "${keyword}"` : activeCategoryName || 'Tất cả sách'}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalElements} đầu sách</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" /> Bộ lọc
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className={`w-56 shrink-0 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Danh mục</p>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory(undefined)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!categoryId ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${categoryId === cat.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Giá (VND)</p>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input text-sm"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input text-sm"
                />
                <button onClick={fetchBooks} className="btn-primary w-full text-sm py-2">Áp dụng</button>
              </div>
            </div>

            {/* Clear filters */}
            {(keyword || categoryId || minPrice || maxPrice) && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
                <X className="h-3.5 w-3.5" /> Xóa bộ lọc
              </button>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <PageSpinner />
          ) : books.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">Không tìm thấy sách nào</p>
              <button onClick={clearFilters} className="text-sm underline">Xóa bộ lọc</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
              <div className="flex justify-center">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
