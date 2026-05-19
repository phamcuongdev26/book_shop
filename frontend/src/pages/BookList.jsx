import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { booksApi } from '../api/books'
import { BookCard } from '../components/ui/BookCard'
import { Pagination } from '../components/ui/Pagination'
import { PageSpinner } from '../components/ui/Spinner'

const SECTION_TITLES = {
  'flash-sale':      'Flash Sale',
  'best-seller':     'Bán chạy nhất',
  'top-rated':       'Đánh giá cao',
  'do-dung-hoc-tap': 'Đồ Dùng Học Tập',
  'thiep':           'Thiệp',
  'gau-bong-mini':   'Gấu Bông Mini',
  'qua-tang':        'Quà Tặng',
}

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword     = searchParams.get('q')       || ''
  const page        = Number(searchParams.get('page') || '0')
  const section     = searchParams.get('section') || ''
  const categorySlug = searchParams.get('categorySlug') || ''
  const sortBy      = searchParams.get('sortBy')  || 'newest'

  const [books,         setBooks]         = useState([])
  const [totalPages,    setTotalPages]    = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [categories,    setCategories]    = useState([])
  const [shopInput,     setShopInput]     = useState('')
  const [shopFilter,    setShopFilter]    = useState('')

  // load categories once (for resolving categorySlug → id)
  useEffect(() => {
    import('../api/categories').then(({ categoriesApi }) =>
      categoriesApi.getAll().then((res) => setCategories(res.data.data || []))
    )
  }, [])

  useEffect(() => {
    setLoading(true)
    const resolvedCategoryId = searchParams.get('categoryId')
      ? Number(searchParams.get('categoryId'))
      : categories.find((c) => c.slug === categorySlug)?.id

    const params = {
      page, size: 20, sortBy,
      categoryId:  resolvedCategoryId,
      hasDiscount: searchParams.get('hasDiscount') === 'true' ? true : undefined,
      sellerName:  shopFilter || undefined,
    }

    const hasFilter = params.categoryId || params.hasDiscount || params.sellerName

    const req = keyword
      ? booksApi.search({ keyword, page, size: 20 })
      : hasFilter
        ? booksApi.filter(params)
        : booksApi.getAll({ page, size: 20, sortBy })

    req
      .then((res) => {
        const d = res.data.data || {}
        setBooks(d.content || [])
        setTotalPages(d.totalPages || 0)
        setTotalElements(d.totalElements || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [
    keyword, page, sortBy,
    searchParams.get('categoryId'),
    categorySlug, categories,
    searchParams.get('hasDiscount'),
    shopFilter,
  ])

  const handleShopSearch = (e) => {
    e.preventDefault()
    setShopFilter(shopInput.trim())
    setSearchParams((prev) => { prev.set('page', '0'); return prev })
  }

  const clearShopFilter = () => {
    setShopInput('')
    setShopFilter('')
    setSearchParams((prev) => { prev.set('page', '0'); return prev })
  }

  const resolvedCategoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : categories.find((c) => c.slug === categorySlug)?.id
  const categoryName = categories.find((c) => c.id === resolvedCategoryId)?.name
  const pageTitle = keyword
    ? `Kết quả cho "${keyword}"`
    : categoryName || SECTION_TITLES[section] || 'Tất cả sách'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{totalElements} đầu sách</p>
      </div>

      {/* Shop filter */}
      {!keyword && (
        <form onSubmit={handleShopSearch} className="flex gap-2 mb-5 max-w-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={shopInput}
              onChange={(e) => setShopInput(e.target.value)}
              placeholder="Tên shop..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {shopInput && (
              <button type="button" onClick={clearShopFilter}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button type="submit"
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
            Lọc
          </button>
        </form>
      )}

      {/* Book grid */}
      {loading ? (
        <PageSpinner />
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Không tìm thấy sách nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {books.map((book, i) => (
              <BookCard key={book.id} book={book} colorIndex={i} />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) =>
                setSearchParams((prev) => { prev.set('page', String(p)); return prev })
              }
            />
          </div>
        </>
      )}
    </div>
  )
}
