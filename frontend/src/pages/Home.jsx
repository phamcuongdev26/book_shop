import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, X, Zap,
  BookOpen, TrendingUp, Star, ChevronLeft, ChevronRight,

} from 'lucide-react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { BookCard } from '../components/ui/BookCard'
import { Pagination } from '../components/ui/Pagination'
import { PageSpinner } from '../components/ui/Spinner'
const SORT_OPTIONS = [
  { value: 'newest',      label: 'Mới nhất'         },
  { value: 'best_seller', label: 'Bán chạy nhất'    },
  { value: 'rating',      label: 'Đánh giá cao nhất'},
  { value: 'price_asc',   label: 'Giá thấp → cao'  },
  { value: 'price_desc',  label: 'Giá cao → thấp'  },
  { value: 'title_asc',   label: 'Tên A → Z'       },
]

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function buildBookListUrl(params) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })
  return `/books?${query.toString()}`
}

export default function Home() {
  const gridRef = useRef(null)

  // ── Section books ─────────────────────────────────────────────
  const [flashBooks,       setFlashBooks]       = useState([])
  const [bestSellerBooks,  setBestSellerBooks]  = useState([])
  const [topRatedBooks,    setTopRatedBooks]    = useState([])
  const [categories,       setCategories]       = useState([])

  // ── Main grid ─────────────────────────────────────────────────
  const [books,         setBooks]         = useState([])
  const [totalPages,    setTotalPages]    = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [page,          setPage]          = useState(0)

  // ── Filter inputs (what user types – not applied until click) ─
  const [catInput,      setCatInput]      = useState('')
  const [sortInput,     setSortInput]     = useState('newest')
  const [discountInput, setDiscountInput] = useState(false)
  const [titleInput,    setTitleInput]    = useState('')
  const [authorInput,   setAuthorInput]   = useState('')
  const [yearInput,     setYearInput]     = useState('')

  // ── Applied filters (these trigger the fetch) ─────────────────
  const [applied, setApplied] = useState({
    categoryId: null, sortBy: 'newest', hasDiscount: false,
    title: '', author: '', year: '',
  })

  // load categories + section rows once
  useEffect(() => {
    categoriesApi.getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(console.error)

    booksApi.filter({ hasDiscount: true, size: 12, sortBy: 'rating' })
      .then((res) => setFlashBooks(res.data.data?.content || []))
      .catch(() => {})
    booksApi.filter({ size: 12, sortBy: 'best_seller' })
      .then((res) => setBestSellerBooks(res.data.data?.content || []))
      .catch(() => {})
    booksApi.filter({ size: 12, sortBy: 'rating' })
      .then((res) => setTopRatedBooks(res.data.data?.content || []))
      .catch(() => {})
  }, [])

  // fetch main grid when applied filters or page changes
  const fetchBooks = useCallback(() => {
    setLoading(true)
    const { categoryId, sortBy, hasDiscount, title, author, year } = applied
    const params = { page, size: 10, sortBy }
    if (categoryId)  params.categoryId  = categoryId
    if (hasDiscount) params.hasDiscount = true
    if (title)       params.title       = title
    if (author)      params.author      = author
    if (year)        params.publishYear = Number(year)
    booksApi.filter(params)
      .then((res) => {
        const d = res.data.data || {}
        setBooks(d.content || [])
        setTotalPages(d.totalPages || 0)
        setTotalElements(d.totalElements || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [applied, page])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const applyFilters = () => {
    setApplied({
      categoryId:  catInput ? Number(catInput) : null,
      sortBy:      sortInput,
      hasDiscount: discountInput,
      title:       titleInput.trim(),
      author:      authorInput.trim(),
      year:        yearInput.trim(),
    })
    setPage(0)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearFilters = () => {
    setCatInput(''); setSortInput('newest'); setDiscountInput(false)
    setTitleInput(''); setAuthorInput(''); setYearInput('')
    setApplied({ categoryId: null, sortBy: 'newest', hasDiscount: false, title: '', author: '', year: '' })
    setPage(0)
  }

  const hasActiveFilter =
    applied.categoryId || applied.hasDiscount || applied.title ||
    applied.author     || applied.year        || applied.sortBy !== 'newest'

  const categoryUrlBySlug = (slug) => {
    const category = categories.find((c) => c.slug === slug)
    return category
      ? buildBookListUrl({ section: slug, categoryId: category.id, categorySlug: slug })
      : buildBookListUrl({ section: slug, categorySlug: slug })
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/3 w-56 h-56 rounded-full bg-amber-400/10 blur-2xl -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center gap-10">

          {/* Left – text */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              <BookOpen className="h-3.5 w-3.5 text-amber-300" />
              Thư viện sách hàng đầu Việt Nam
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 tracking-tight">
              Khám phá
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                thế giới sách
              </span>
            </h1>

            <p className="text-white/65 text-sm sm:text-base mb-7 max-w-xs sm:max-w-sm leading-relaxed">
              {totalElements > 0
                ? `${totalElements.toLocaleString('vi-VN')} đầu sách đa thể loại – từ văn học, khoa học đến kỹ năng sống.`
                : 'Hàng nghìn đầu sách đa thể loại – từ văn học, khoa học đến kỹ năng sống.'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <BookOpen className="h-4 w-4" />
                Khám phá ngay
              </button>
              <a
                href="#flash-sale"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all backdrop-blur-sm"
              >
                <Zap className="h-4 w-4 text-rose-300 fill-rose-300" />
                Flash Sale
              </a>
            </div>

            {/* Stats chips */}
            {totalElements > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="bg-white/10 border border-white/15 text-white/80 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                  📚 {totalElements.toLocaleString('vi-VN')} đầu sách
                </span>
                {categories.length > 0 && (
                  <span className="bg-white/10 border border-white/15 text-white/80 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    🏷️ {categories.length} danh mục
                  </span>
                )}
                <span className="bg-white/10 border border-white/15 text-white/80 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                  ⚡ Giao hàng toàn quốc
                </span>
              </div>
            )}
          </div>

          {/* Right – staggered book cover mosaic (lg+) */}
          <div className="hidden lg:flex shrink-0 items-center gap-3 py-2">
            <HeroBookColumn books={[flashBooks[0], flashBooks[1]]} rotates={[-4, 3]} offsetClass="mt-6" />
            <HeroBookColumn books={[bestSellerBooks[0], bestSellerBooks[1]]} rotates={[2, -3]} offsetClass="" />
            <HeroBookColumn books={[topRatedBooks[0], topRatedBooks[1]]} rotates={[-2, 4]} offsetClass="mt-10" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── FLASH SALE ─────────────────────────────── */}
        {flashBooks.length > 0 && (
          <section id="flash-sale" className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  <Zap className="h-4 w-4 fill-white" /> FLASH SALE
                </span>
                <span className="text-sm text-gray-500">Ưu đãi hấp dẫn – số lượng có hạn!</span>
              </div>
              <Link
                to={buildBookListUrl({ section: 'flash-sale', hasDiscount: true, sortBy: 'rating' })}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Xem thêm →
              </Link>
            </div>
            <FlashSaleRow books={flashBooks} />
          </section>
        )}

        {/* ── BÁN CHẠY ───────────────────────────────── */}
        {bestSellerBooks.length > 0 && (
          <SectionRow
            books={bestSellerBooks}
            title="Bán chạy nhất"
            icon={TrendingUp}
            headerColor="bg-orange-500"
            subtitle="Được yêu thích & mua nhiều nhất"
            cardType="best_seller"
            viewMoreTo={buildBookListUrl({ section: 'best-seller', sortBy: 'best_seller' })}
          />
        )}

        {/* ── ĐÁNH GIÁ CAO ───────────────────────────── */}
        {topRatedBooks.length > 0 && (
          <SectionRow
            books={topRatedBooks}
            title="Đánh giá cao"
            icon={Star}
            headerColor="bg-violet-600"
            subtitle="Được độc giả đánh giá xuất sắc"
            cardType="top_rated"
            viewMoreTo={buildBookListUrl({ section: 'top-rated', sortBy: 'rating' })}
          />
        )}


        {/* ── TẤT CẢ SÁCH ───────────────────────────────── */}
        <div className="py-6" ref={gridRef}>

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Tất cả sách</h2>
              {totalElements > 0 && (
                <p className="text-xs text-gray-400">{totalElements} đầu sách</p>
              )}
            </div>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 border border-gray-200 rounded-lg hover:border-red-200"
              >
                <X className="h-3 w-3" /> Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 mb-5">
            <div className="flex flex-wrap gap-3 items-end">

              {/* Danh mục – native select, bên trái nhất */}
              <div className="shrink-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Danh mục</p>
                <select
                  value={catInput}
                  onChange={(e) => setCatInput(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[155px]"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Sắp xếp */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sắp xếp</p>
                <select
                  value={sortInput}
                  onChange={(e) => setSortInput(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[165px]"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Tên sách */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tên sách</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nhập tên sách..."
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    className="text-sm border border-gray-200 rounded-lg pl-8 pr-8 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-36"
                  />
                  {titleInput && (
                    <button onClick={() => setTitleInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tác giả */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tác giả</p>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nhập tên tác giả..."
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    className="text-sm border border-gray-200 rounded-lg pl-8 pr-8 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-36"
                  />
                  {authorInput && (
                    <button onClick={() => setAuthorInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Năm xuất bản */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Năm xuất bản</p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="VD: 2023"
                    maxLength={4}
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    className="text-sm border border-gray-200 rounded-lg px-3 pr-8 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-28"
                  />
                  {yearInput && (
                    <button onClick={() => setYearInput('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Giảm giá */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ưu đãi</p>
                <label
                  className={`flex items-center gap-2 h-9 cursor-pointer text-sm select-none px-3 border rounded-lg transition-colors ${
                    discountInput
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={discountInput}
                    onChange={(e) => setDiscountInput(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400 h-4 w-4"
                  />
                  Đang giảm giá
                </label>
              </div>

              {/* Áp dụng */}
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="btn-primary h-9 px-5 text-sm"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          {/* Book grid */}
          {loading ? (
            <PageSpinner />
          ) : books.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Không tìm thấy sách nào phù hợp.</p>
              <button onClick={clearFilters} className="mt-3 text-sm text-indigo-600 underline">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                {books.map((book, i) => (
                  <BookCard key={book.id} book={book} colorIndex={i} />
                ))}
              </div>
              <div className="flex justify-center pb-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Hero book column (staggered mosaic on desktop) ──────────────
function HeroBookColumn({ books, rotates, offsetClass }) {
  return (
    <div className={`flex flex-col gap-3 ${offsetClass}`}>
      {[0, 1].map((i) => {
        const book = books?.[i]
        return (
          <div
            key={i}
            className="w-[72px] h-[100px] rounded-xl overflow-hidden shadow-2xl border-2 border-white/25 transition-transform duration-300 hover:scale-105"
            style={{ transform: `rotate(${rotates[i]}deg)` }}
          >
            {book?.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-white/10') }}
              />
            ) : (
              <div className="w-full h-full bg-white/10 animate-pulse" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Generic horizontal scroll row with scroll-reveal animation ─
function SectionRow({ books, title, icon: Icon, headerColor, subtitle, cardType, onViewMore, viewMoreTo, staticItems = false }) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)
  const rowRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 ${headerColor} text-white text-sm font-bold px-3 py-1 rounded-full shadow`}>
            <Icon className="h-4 w-4" /> {title}
          </span>
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        </div>
        {viewMoreTo ? (
          <Link to={viewMoreTo} className="text-xs text-indigo-600 hover:underline font-medium">
            Xem thêm →
          </Link>
        ) : (
          <button
            onClick={onViewMore}
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            Xem thêm →
          </button>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 hidden sm:flex"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {books.map((book, i) => (
            <div
              key={book.id}
              className={`transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: `${i * 55}ms` }}
            >
              <SectionCard book={book} type={cardType} isStatic={staticItems} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 hidden sm:flex"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </section>
  )
}

function SectionCard({ book, type, isStatic = false }) {
  const hasDiscount = book.discountPrice != null && book.discountPrice < book.price
  const price = book.discountPrice ?? book.price

  const cardClass = "shrink-0 w-40 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group cursor-pointer"

  const inner = (
    <>
      <div className="relative aspect-[3/4] bg-white overflow-hidden">
        <img
          src={book.imageUrl || 'https://placehold.co/300x400?text=No+Image'}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Image' }}
        />
        {type === 'best_seller' && book.totalSold > 0 && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md shadow">
            <TrendingUp className="h-3 w-3" />
            {book.totalSold > 999 ? `${(book.totalSold / 1000).toFixed(1)}k` : book.totalSold}
          </span>
        )}
        {type === 'top_rated' && book.avgRating > 0 && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 bg-amber-400 text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded-md shadow">
            <Star className="h-3 w-3 fill-amber-800" />
            {book.avgRating.toFixed(1)}
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md shadow">
            -{Math.round((1 - price / book.price) * 100)}%
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">{book.title}</p>
        <p className="text-xs text-gray-400 mb-0.5">{book.author ?? book.brand}</p>
        <p className="text-sm font-bold text-indigo-600">{formatPrice(price)}</p>
        {hasDiscount && (
          <p className="text-xs text-gray-400 line-through">{formatPrice(book.price)}</p>
        )}
      </div>
    </>
  )

  return isStatic
    ? <Link to={`/product/${book.id}`} className={cardClass}>{inner}</Link>
    : <Link to={`/books/${book.id}`} className={cardClass}>{inner}</Link>
}

// ── Flash Sale horizontal scroll row ─────────────────────────
function FlashSaleRow({ books }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 hidden sm:flex"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>

      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {books.map((book) => (
          <FlashCard key={book.id} book={book} />
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 hidden sm:flex"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  )
}

function FlashCard({ book }) {
  const discount = Math.round((1 - book.discountPrice / book.price) * 100)
  return (
    <Link
      to={`/books/${book.id}`}
      className="shrink-0 w-40 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
    >
      <div className="relative aspect-[3/4] bg-white overflow-hidden">
        <img
          src={book.imageUrl || 'https://placehold.co/300x400?text=No+Image'}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/300x400?text=No+Image' }}
        />
        <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md shadow">
          -{discount}%
        </span>
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">{book.title}</p>
        <p className="text-sm font-bold text-rose-600">{formatPrice(book.discountPrice)}</p>
        <p className="text-xs text-gray-400 line-through">{formatPrice(book.price)}</p>
      </div>
    </Link>
  )
}

