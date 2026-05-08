import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ChevronDown, ChevronUp, SlidersHorizontal, X, Zap,
  BookOpen, Ghost, BookHeart, BookType, Smile, Church, Layers,
  BookMarked, Lightbulb, BarChart2, FlaskConical,
  Globe, Baby, Brain, Palette, Heart, Languages,
  TrendingUp, Star, Clock, ChevronLeft, ChevronRight,
  GraduationCap, Gift, Mail, Package,
} from 'lucide-react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { BookCard } from '../components/ui/BookCard'
import { Pagination } from '../components/ui/Pagination'
import { PageSpinner } from '../components/ui/Spinner'
import { SPOTLIGHT_SECTIONS } from '../data/spotlightProducts'

const CAT_META = {
  'van-hoc':            { icon: BookMarked,   color: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-200' },
  'ky-nang-song':       { icon: Lightbulb,    color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200'  },
  'kinh-te-kinh-doanh': { icon: BarChart2,    color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200'},
  'khoa-hoc-cong-nghe': { icon: FlaskConical, color: 'text-sky-600',    bg: 'bg-sky-50',     border: 'border-sky-200'    },
  'lich-su-dia-ly':     { icon: Globe,        color: 'text-teal-600',   bg: 'bg-teal-50',    border: 'border-teal-200'   },
  'thieu-nhi':          { icon: Baby,         color: 'text-pink-600',   bg: 'bg-pink-50',    border: 'border-pink-200'   },
  'tam-ly-hoc':         { icon: Brain,        color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-200' },
  'nghe-thuat':         { icon: Palette,      color: 'text-rose-600',   bg: 'bg-rose-50',    border: 'border-rose-200'   },
  'suc-khoe-the-thao':  { icon: Heart,        color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200'    },
  'ngoai-ngu':          { icon: Languages,    color: 'text-cyan-600',   bg: 'bg-cyan-50',    border: 'border-cyan-200'   },
  'truyen-kinh-di':     { icon: Ghost,        color: 'text-gray-700',   bg: 'bg-gray-50',    border: 'border-gray-200'   },
  'truyen-tre-em':      { icon: BookHeart,    color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  'tieu-thuyet':        { icon: BookType,     color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-200' },
  'manga-comic':        { icon: Layers,       color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200' },
  'trinh-tham':         { icon: Search,       color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200'  },
  'ton-giao-tam-linh':  { icon: Church,       color: 'text-lime-700',   bg: 'bg-lime-50',    border: 'border-lime-200'   },
  'hai-huoc-giai-tri':  { icon: Smile,        color: 'text-fuchsia-600',bg: 'bg-fuchsia-50', border: 'border-fuchsia-200'},
}

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Mới nhất'         },
  { value: 'best_seller', label: 'Bán chạy nhất'    },
  { value: 'rating',      label: 'Đánh giá cao nhất'},
  { value: 'price_asc',   label: 'Giá thấp → cao'  },
  { value: 'price_desc',  label: 'Giá cao → thấp'  },
  { value: 'title_asc',   label: 'Tên A → Z'       },
]

const QUICK_TABS = [
  { id: 'newest',      label: 'Mới nhất',     icon: Clock,      sortBy: 'newest',      discount: false },
  { id: 'best_seller', label: 'Bán chạy',     icon: TrendingUp, sortBy: 'best_seller', discount: false },
  { id: 'top_rated',   label: 'Đánh giá cao', icon: Star,       sortBy: 'rating',      discount: false },
]

// icon map cho từng section (icon là React component, không để trong data file)
const SECTION_ICONS = {
  'do-dung-hoc-tap': GraduationCap,
  'thiep':           Mail,
  'gau-bong-mini':   Package,
  'qua-tang':        Gift,
}

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export default function Home() {
  const navigate  = useNavigate()
  const gridRef   = useRef(null)

  const [books, setBooks]                     = useState([])
  const [flashBooks, setFlashBooks]           = useState([])
  const [bestSellerBooks, setBestSellerBooks] = useState([])
  const [topRatedBooks, setTopRatedBooks]     = useState([])
  const [categories, setCategories]           = useState([])
  const [totalPages, setTotalPages]           = useState(0)
  const [totalElements, setTotalElements]     = useState(0)
  const [loading, setLoading]                 = useState(true)

  const [activeCatId, setActiveCatId]     = useState(null)
  const [sortBy, setSortBy]               = useState('newest')
  const [onlyDiscount, setOnlyDiscount]   = useState(false)
  const [activeTab, setActiveTab]         = useState('newest')
  const [page, setPage]                   = useState(0)
  const [catOpen, setCatOpen]             = useState(true)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)
  const [searchQ, setSearchQ]             = useState('')

  // load categories once
  useEffect(() => {
    categoriesApi.getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(console.error)
  }, [])

  // load flash sale, best seller, top rated books once
  useEffect(() => {
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

  // load books whenever filter changes
  const fetchBooks = useCallback(() => {
    setLoading(true)
    const params = { page, size: 12, sortBy }
    if (activeCatId) params.categoryId = activeCatId
    if (onlyDiscount) params.hasDiscount = true
    booksApi.filter(params)
      .then((res) => {
        const d = res.data.data || {}
        setBooks(d.content || [])
        setTotalPages(d.totalPages || 0)
        setTotalElements(d.totalElements || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeCatId, sortBy, onlyDiscount, page])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/books?q=${encodeURIComponent(searchQ.trim())}`)
  }

  const selectCat = (id) => {
    setActiveCatId(id)
    setPage(0)
    setMobileCatOpen(false)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const applyQuickTab = (tab) => {
    setActiveTab(tab.id)
    setSortBy(tab.sortBy)
    setOnlyDiscount(tab.discount)
    setPage(0)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeCatName = categories.find((c) => c.id === activeCatId)?.name

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center gap-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Khám phá <span className="text-amber-300">thế giới sách</span>
            </h1>
            <p className="text-white/70 mt-1 text-sm">
              {totalElements > 0 ? `${totalElements} đầu sách đang chờ bạn` : 'Hàng nghìn đầu sách đa thể loại'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Tìm theo tên sách, tác giả, thể loại..."
                className="w-full pl-12 pr-28 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── FLASH SALE ─────────────────────────────── */}
        {flashBooks.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  <Zap className="h-4 w-4 fill-white" /> FLASH SALE
                </span>
                <span className="text-sm text-gray-500">Ưu đãi hấp dẫn – số lượng có hạn!</span>
              </div>
              <button
                onClick={() => { setOnlyDiscount(true); setSortBy('rating'); setPage(0); gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Xem thêm →
              </button>
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
            onViewMore={() => { applyQuickTab(QUICK_TABS[1]); }}
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
            onViewMore={() => { applyQuickTab(QUICK_TABS[2]); }}
          />
        )}

        {/* ── SPOTLIGHT CATEGORIES (static products) ─── */}
        {SPOTLIGHT_SECTIONS.map(({ key, title, headerColor, subtitle, items }) => (
          <SectionRow
            key={key}
            books={items}
            title={title}
            icon={SECTION_ICONS[key]}
            headerColor={headerColor}
            subtitle={subtitle}
            cardType="generic"
            staticItems
            onViewMore={() => {}}
          />
        ))}

        {/* ── MAIN: sidebar + grid ───────────────────── */}
        <div className="py-6" ref={gridRef}>

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 text-lg">
                {activeCatName || (onlyDiscount ? 'Sách đang giảm giá' : 'Tất cả sách')}
              </h2>
              {(activeCatId || onlyDiscount) && (
                <button
                  onClick={() => { setActiveCatId(null); setOnlyDiscount(false); setActiveTab('newest'); setSortBy('newest'); setPage(0) }}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  <X className="h-3 w-3" /> Bỏ lọc
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="sm:hidden flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileCatOpen(!mobileCatOpen)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Danh mục
              </button>

              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0) }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile category drawer */}
          {mobileCatOpen && (
            <div className="sm:hidden card p-4 mb-4">
              <CategoryList
                categories={categories}
                activeCatId={activeCatId}
                onSelect={selectCat}
                open={true}
                onToggle={() => {}}
                alwaysOpen
              />
            </div>
          )}

          <div className="flex gap-6">
            {/* Desktop sidebar */}
            <aside className="w-52 shrink-0 hidden sm:block">
              <div className="card p-3 sticky top-20">
                <CategoryList
                  categories={categories}
                  activeCatId={activeCatId}
                  onSelect={selectCat}
                  open={catOpen}
                  onToggle={() => setCatOpen(!catOpen)}
                />
              </div>
            </aside>

            {/* Book grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <PageSpinner />
              ) : books.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Không có sách nào trong danh mục này.</p>
                  <button
                    onClick={() => { setActiveCatId(null); setOnlyDiscount(false) }}
                    className="mt-3 text-sm text-indigo-600 underline"
                  >
                    Xem tất cả sách
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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
      </div>
    </div>
  )
}

// ── Generic horizontal scroll row with scroll-reveal animation ─
function SectionRow({ books, title, icon: Icon, headerColor, subtitle, cardType, onViewMore, staticItems = false }) {
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
        <button
          onClick={onViewMore}
          className="text-xs text-indigo-600 hover:underline font-medium"
        >
          Xem thêm →
        </button>
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
      <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={book.imageUrl || 'https://placehold.co/300x400?text=No+Image'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
      <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
        <img
          src={book.imageUrl || 'https://placehold.co/300x400?text=No+Image'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

// ── Collapsible category list ─────────────────────────────────
function CategoryList({ categories, activeCatId, onSelect, open, onToggle, alwaysOpen }) {
  return (
    <div>
      {!alwaysOpen && (
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-2 py-2 text-sm font-bold text-gray-700 hover:text-indigo-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Danh mục
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}

      {(open || alwaysOpen) && (
        <div className="mt-1 space-y-0.5">
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              !activeCatId
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            Tất cả
          </button>

          {categories.map((cat) => {
            const meta    = CAT_META[cat.slug] || {}
            const Icon    = meta.icon || BookOpen
            const isActive = activeCatId === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : (meta.color || 'text-gray-400')}`} />
                <span className="line-clamp-1">{cat.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
