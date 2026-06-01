import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
  const navigate        = useNavigate()
  const keyword         = searchParams.get('q')       || ''
  const page            = Number(searchParams.get('page') || '0')
  const section         = searchParams.get('section') || ''
  const categorySlug    = searchParams.get('categorySlug') || ''
  const sortBy          = searchParams.get('sortBy')  || 'newest'

  const [books,         setBooks]         = useState([])
  const [totalPages,    setTotalPages]    = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [categories,    setCategories]    = useState([])
  const [shopInput,     setShopInput]     = useState('')
  const [shopFilter,    setShopFilter]    = useState('')

  // title/author search with suggestions
  const [titleInput,    setTitleInput]    = useState(keyword)
  const [suggestions,   setSuggestions]   = useState([])
  const [showDrop,      setShowDrop]      = useState(false)
  const searchRef  = useRef(null)
  const timerRef   = useRef(null)

  // sync titleInput when keyword changes from outside (e.g. header search)
  useEffect(() => { setTitleInput(keyword) }, [keyword])

  // click-outside closes dropdown
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitleInput(val)
    clearTimeout(timerRef.current)
    if (val.trim().length < 2) { setSuggestions([]); setShowDrop(false); return }
    timerRef.current = setTimeout(() => {
      booksApi.search({ keyword: val.trim(), size: 8 })
        .then((res) => {
          const items = res.data?.data?.content || []
          setSuggestions(items)
          setShowDrop(items.length > 0)
        })
        .catch(() => {})
    }, 300)
  }

  const handleTitleSelect = (book) => {
    setShowDrop(false)
    navigate(`/books/${book.id}`)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowDrop(false)
      setSearchParams((prev) => { prev.set('q', titleInput.trim()); prev.set('page', '0'); return prev })
    } else if (e.key === 'Escape') {
      setShowDrop(false)
    }
  }

  const clearTitleSearch = () => {
    setTitleInput('')
    setSuggestions([])
    setShowDrop(false)
    setSearchParams((prev) => { prev.delete('q'); prev.set('page', '0'); return prev })
  }

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
  const isFocusedSectionPage = Boolean(section || categorySlug)
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

      {/* Category pills */}
      {!keyword && !isFocusedSectionPage && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSearchParams((prev) => { prev.delete('categoryId'); prev.delete('categorySlug'); prev.set('page', '0'); return prev })}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !searchParams.get('categoryId') && !categorySlug
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 bg-white'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams((prev) => { prev.set('categoryId', String(cat.id)); prev.delete('categorySlug'); prev.set('page', '0'); return prev })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                Number(searchParams.get('categoryId')) === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600 bg-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Title / author search with suggestions */}
      <div ref={searchRef} className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          value={titleInput}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDrop(true)}
          placeholder="Tìm theo tên sách, tác giả..."
          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {titleInput && (
          <button type="button" onClick={clearTitleSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {showDrop && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {suggestions.map((book) => (
              <button
                key={book.id}
                onMouseDown={() => handleTitleSelect(book)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 text-left transition-colors"
              >
                <img
                  src={book.imageUrl || '/placeholder.png'}
                  alt={book.title}
                  className="h-10 w-7 object-cover rounded flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-400 truncate">{book.author}</p>
                </div>
              </button>
            ))}
          </div>
        )}
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
