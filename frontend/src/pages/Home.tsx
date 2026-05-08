import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { booksApi } from '../api/books'
import { categoriesApi } from '../api/categories'
import { BookCard } from '../components/ui/BookCard'
import { PageSpinner } from '../components/ui/Spinner'
import type { BookSummary, CategoryResponse } from '../types'

export default function Home() {
  const [books, setBooks] = useState<BookSummary[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      booksApi.getAll({ page: 0, size: 8 }),
      categoriesApi.getAll(),
    ]).then(([booksRes, catsRes]) => {
      setBooks(booksRes.data.result.content)
      setCategories(catsRes.data.result.filter((c) => c.active))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
            Khám phá thế giới <br />
            <span className="text-gray-500">tri thức qua từng trang sách</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md">
            Hàng nghìn đầu sách đa thể loại, giao hàng nhanh, giá tốt nhất.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/books" className="btn-primary px-6 py-2.5">
              Xem tất cả sách <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="btn-outline px-6 py-2.5">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Danh mục</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/books?categoryId=${cat.id}`}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-full text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors bg-white"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sách nổi bật</h2>
          <Link to="/books" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            Xem thêm <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Chưa có sách nào.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
