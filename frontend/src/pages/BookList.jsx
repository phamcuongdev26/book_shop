import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X, SlidersHorizontal, Search } from 'lucide-react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { BookCard } from '../components/ui/BookCard'
import { Pagination } from '../components/ui/Pagination'
import { PageSpinner } from '../components/ui/Spinner'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mới nhất' },
  { value: 'price_asc',  label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'best_seller',label: 'Bán chạy nhất' },
  { value: 'rating',     label: 'Đánh giá cao nhất' },
  { value: 'year_desc',  label: 'Năm mới nhất' },
  { value: 'year_asc',   label: 'Năm cũ nhất' },
  { value: 'title_asc',  label: 'Tên A → Z' },
]

const currentYear = new Date().getFullYear()

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword    = searchParams.get('q') || ''
  const page       = Number(searchParams.get('page') || '0')

  const [books, setBooks]                 = useState([])
  const [categories, setCategories]       = useState([])
  const [totalPages, setTotalPages]       = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading]             = useState(true)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // Filter inputs (what user types)
  const [titleInput,  setTitleInput]  = useState(searchParams.get('title')  || '')
  const [authorInput, setAuthorInput] = useState(searchParams.get('author') || '')
  const [yearInput,   setYearInput]   = useState(searchParams.get('year')   || '')
  const [minInput,    setMinInput]    = useState(searchParams.get('minPrice') || '')
  const [maxInput,    setMaxInput]    = useState(searchParams.get('maxPrice') || '')
  const [categoryId,  setCategoryIdState] = useState(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest')

  useEffect(() => {
    categoriesApi.getAll().then((res) =>
      setCategories(res.data.data || [])
    )
  }, [])

  // Sync from URL to state when URL changes externally (e.g. clicking category on homepage)
  useEffect(() => {
    const catId = searchParams.get('categoryId')
    setCategoryIdState(catId ? Number(catId) : null)
  }, [searchParams.get('categoryId')])

  useEffect(() => {
    setLoading(true)
    const params = {
      page,
      size: 12,
      sortBy,
      title:      searchParams.get('title')    || undefined,
      author:     searchParams.get('author')   || undefined,
      publishYear:searchParams.get('year')     ? Number(searchParams.get('year')) : undefined,
      minPrice:   searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice:   searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    }

    const hasAdvancedFilter = params.title || params.author || params.publishYear ||
      params.minPrice || params.maxPrice || params.categoryId

    const req = keyword
      ? booksApi.search({ keyword, page, size: 12 })
      : hasAdvancedFilter
        ? booksApi.filter(params)
        : booksApi.getAll({ page, size: 12, sortBy })

    req.then((res) => {
      const pageData = res.data.data || {}
      setBooks(pageData.content || [])
      setTotalPages(pageData.totalPages || 0)
      setTotalElements(pageData.totalElements || 0)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [
    keyword, page, sortBy,
    searchParams.get('title'),
    searchParams.get('author'),
    searchParams.get('year'),
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
    searchParams.get('categoryId'),
  ])

  // Apply all sidebar filters to URL at once
  const applyFilters = () => {
    setSearchParams((prev) => {
      prev.set('page', '0')
      titleInput  ? prev.set('title',    titleInput)  : prev.delete('title')
      authorInput ? prev.set('author',   authorInput) : prev.delete('author')
      yearInput   ? prev.set('year',     yearInput)   : prev.delete('year')
      minInput    ? prev.set('minPrice', minInput)    : prev.delete('minPrice')
      maxInput    ? prev.set('maxPrice', maxInput)    : prev.delete('maxPrice')
      categoryId  ? prev.set('categoryId', String(categoryId)) : prev.delete('categoryId')
      prev.set('sortBy', sortBy)
      prev.delete('q')
      return prev
    })
    setShowMobileFilter(false)
  }

  const setCategory = (id) => {
    setCategoryIdState(id)
    setSearchParams((prev) => {
      prev.delete('page'); prev.delete('q')
      id ? prev.set('categoryId', String(id)) : prev.delete('categoryId')
      return prev
    })
  }

  const clearFilters = () => {
    setTitleInput(''); setAuthorInput(''); setYearInput('')
    setMinInput(''); setMaxInput(''); setCategoryIdState(null)
    setSortBy('newest')
    setSearchParams({})
  }

  const hasFilter = keyword || searchParams.get('title') || searchParams.get('author') ||
    searchParams.get('year') || searchParams.get('minPrice') || searchParams.get('maxPrice') ||
    searchParams.get('categoryId')

  const activeCategoryName = categories.find((c) => c.id === (searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null))?.name

  const FilterPanel = () => (
    <div className="space-y-5">

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sắp xếp</p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Danh mục</p>
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => setCategoryIdState(null)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
              !categoryId ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >Tất cả</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setCategoryIdState(cat.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                categoryId === cat.id ? 'bg-indigo-600 text-white font-medium' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >{cat.name}</button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tên sách</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Nhập tên sách..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="input text-sm pl-8 pr-8"
          />
          {titleInput && (
            <button onClick={() => setTitleInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Author */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tác giả</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Nhập tên tác giả..."
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="input text-sm pl-8 pr-8"
          />
          {authorInput && (
            <button onClick={() => setAuthorInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Publish Year */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Năm xuất bản</p>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder={`VD: 2023`}
            maxLength={4}
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="input text-sm pr-8"
          />
          {yearInput && (
            <button onClick={() => setYearInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Khoảng giá (VND)</p>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Từ"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="input text-sm pr-8"
            />
            {minInput && (
              <button onClick={() => setMinInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Đến"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="input text-sm pr-8"
            />
            {maxInput && (
              <button onClick={() => setMaxInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <button onClick={applyFilters} className="btn-primary w-full py-2">
        Áp dụng bộ lọc
      </button>

      {hasFilter && (
        <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors w-full justify-center">
          <X className="h-3.5 w-3.5" /> Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  )

  const activeFiltersCount = [
    searchParams.get('title'), searchParams.get('author'), searchParams.get('year'),
    searchParams.get('minPrice'), searchParams.get('maxPrice'), searchParams.get('categoryId')
  ].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {keyword ? `Kết quả cho "${keyword}"` : activeCategoryName || 'Tất cả sách'}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{totalElements} đầu sách</p>
        </div>
        <button
          className="sm:hidden flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Lọc
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchParams.get('title')    && <FilterTag label={`Tên: ${searchParams.get('title')}`}    onRemove={() => { setTitleInput('');  setSearchParams(p => { p.delete('title');    return p }) }} />}
          {searchParams.get('author')   && <FilterTag label={`Tác giả: ${searchParams.get('author')}`} onRemove={() => { setAuthorInput(''); setSearchParams(p => { p.delete('author');   return p }) }} />}
          {searchParams.get('year')     && <FilterTag label={`Năm: ${searchParams.get('year')}`}     onRemove={() => { setYearInput('');   setSearchParams(p => { p.delete('year');     return p }) }} />}
          {searchParams.get('minPrice') && <FilterTag label={`Từ: ${Number(searchParams.get('minPrice')).toLocaleString('vi-VN')}đ`} onRemove={() => { setMinInput(''); setSearchParams(p => { p.delete('minPrice'); return p }) }} />}
          {searchParams.get('maxPrice') && <FilterTag label={`Đến: ${Number(searchParams.get('maxPrice')).toLocaleString('vi-VN')}đ`} onRemove={() => { setMaxInput(''); setSearchParams(p => { p.delete('maxPrice'); return p }) }} />}
          {searchParams.get('categoryId') && <FilterTag label={`Danh mục: ${activeCategoryName || searchParams.get('categoryId')}`} onRemove={() => setCategory(null)} />}
        </div>
      )}

      {/* Mobile filter */}
      {showMobileFilter && (
        <div className="sm:hidden card p-4 mb-6">
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="w-56 shrink-0 hidden sm:block">
          <FilterPanel />
        </aside>

        {/* Book grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <PageSpinner />
          ) : books.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">Không tìm thấy sách nào</p>
              <button onClick={clearFilters} className="text-sm text-indigo-600 underline">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {books.map((book, i) => <BookCard key={book.id} book={book} colorIndex={i} />)}
              </div>
              <div className="flex justify-center">
                <Pagination page={page} totalPages={totalPages} onChange={(p) =>
                  setSearchParams((prev) => { prev.set('page', String(p)); return prev })
                } />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-indigo-900">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
