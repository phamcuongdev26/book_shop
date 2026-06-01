import { useEffect, useRef, useState } from 'react'
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

function FilterInput({ placeholder, value, onChange, onClear, suggestions, showDrop, onSelect, containerRef }) {
  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <input
        value={value}
        onChange={onChange}
        onFocus={() => {}}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {value && (
        <button type="button" onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {showDrop && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onMouseDown={() => onSelect(item)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 text-left transition-colors"
            >
              <img
                src={item.imageUrl || '/placeholder.png'}
                alt={item.title}
                className="h-10 w-7 object-cover rounded flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 truncate">{item.author}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword      = searchParams.get('q')          || ''
  const page         = Number(searchParams.get('page') || '0')
  const section      = searchParams.get('section')    || ''
  const categorySlug = searchParams.get('categorySlug') || ''
  const sortBy       = searchParams.get('sortBy')     || 'newest'

  const [books,         setBooks]         = useState([])
  const [totalPages,    setTotalPages]    = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [categories,    setCategories]    = useState([])
  const [shopInput,     setShopInput]     = useState('')
  const [shopFilter,    setShopFilter]    = useState('')

  // title filter
  const [titleInput,       setTitleInput]       = useState(keyword)
  const [titleFilter,      setTitleFilter]      = useState(keyword)
  const [titleSuggestions, setTitleSuggestions] = useState([])
  const [showTitleDrop,    setShowTitleDrop]    = useState(false)
  const titleRef   = useRef(null)
  const titleTimer = useRef(null)

  // author filter
  const [authorInput,       setAuthorInput]       = useState('')
  const [authorFilter,      setAuthorFilter]      = useState('')
  const [authorSuggestions, setAuthorSuggestions] = useState([])
  const [showAuthorDrop,    setShowAuthorDrop]    = useState(false)
  const authorRef   = useRef(null)
  const authorTimer = useRef(null)

  // sync title input when header navigates with ?q=
  useEffect(() => { setTitleInput(keyword); setTitleFilter(keyword) }, [keyword])

  // click-outside for title
  useEffect(() => {
    const h = (e) => { if (titleRef.current && !titleRef.current.contains(e.target)) setShowTitleDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // click-outside for author
  useEffect(() => {
    const h = (e) => { if (authorRef.current && !authorRef.current.contains(e.target)) setShowAuthorDrop(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitleInput(val)
    clearTimeout(titleTimer.current)
    if (!val.trim()) { setTitleFilter(''); setTitleSuggestions([]); setShowTitleDrop(false); return }
    titleTimer.current = setTimeout(() => {
      booksApi.filter({ title: val.trim(), size: 8 })
        .then((res) => {
          const items = res.data?.data?.content || []
          setTitleSuggestions(items)
          setShowTitleDrop(items.length > 0)
        })
        .catch(() => {})
    }, 300)
  }

  const selectTitle = (book) => {
    setTitleInput(book.title)
    setTitleFilter(book.title)
    setShowTitleDrop(false)
    setSearchParams((prev) => { prev.set('page', '0'); return prev })
  }

  const clearTitle = () => {
    setTitleInput('')
    setTitleFilter('')
    setTitleSuggestions([])
    setShowTitleDrop(false)
    setSearchParams((prev) => { prev.delete('q'); prev.set('page', '0'); return prev })
  }

  const handleAuthorChange = (e) => {
    const val = e.target.value
    setAuthorInput(val)
    clearTimeout(authorTimer.current)
    if (!val.trim()) { setAuthorFilter(''); setAuthorSuggestions([]); setShowAuthorDrop(false); return }
    authorTimer.current = setTimeout(() => {
      booksApi.filter({ author: val.trim(), size: 8 })
        .then((res) => {
          const items = res.data?.data?.content || []
          setAuthorSuggestions(items)
          setShowAuthorDrop(items.length > 0)
        })
        .catch(() => {})
    }, 300)
  }

  const selectAuthor = (book) => {
    setAuthorInput(book.author)
    setAuthorFilter(book.author)
    setShowAuthorDrop(false)
    setSearchParams((prev) => { prev.set('page', '0'); return prev })
  }

  const clearAuthor = () => {
    setAuthorInput('')
    setAuthorFilter('')
    setAuthorSuggestions([])
    setShowAuthorDrop(false)
    setSearchParams((prev) => { prev.set('page', '0'); return prev })
  }

  // load categories once
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
      title:       titleFilter  || undefined,
      author:      authorFilter || undefined,
      categoryId:  resolvedCategoryId,
      hasDiscount: searchParams.get('hasDiscount') === 'true' ? true : undefined,
      sellerName:  shopFilter || undefined,
    }

    const hasAnyFilter = params.title || params.author || params.categoryId
      || params.hasDiscount || params.sellerName

    const req = hasAnyFilter
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
    titleFilter, authorFilter, page, sortBy,
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
  const pageTitle = categoryName || SECTION_TITLES[section] || 'Tất cả sách'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{totalElements} đầu sách</p>
      </div>

      {/* Category pills */}
      {!isFocusedSectionPage && categories.length > 0 && (
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

      {/* Title + Author filter row */}
      <div className="flex gap-2 mb-4 max-w-xl">
        <FilterInput
          placeholder="Tên sách..."
          value={titleInput}
          onChange={handleTitleChange}
          onClear={clearTitle}
          suggestions={titleSuggestions}
          showDrop={showTitleDrop}
          onSelect={selectTitle}
          containerRef={titleRef}
        />
        <FilterInput
          placeholder="Tác giả..."
          value={authorInput}
          onChange={handleAuthorChange}
          onClear={clearAuthor}
          suggestions={authorSuggestions}
          showDrop={showAuthorDrop}
          onSelect={selectAuthor}
          containerRef={authorRef}
        />
      </div>

      {/* Shop filter */}
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
