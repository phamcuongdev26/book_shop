import { useEffect, useState, useCallback } from 'react'
import { Trash2, X, Search, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { booksApi } from '../../api/books'
import { PageSpinner, Spinner } from '../../components/ui/Spinner'
import { Pagination } from '../../components/ui/Pagination'

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

const STATUS_META = {
  ACTIVE:       { label: 'Đang bán',  color: 'bg-green-50 text-green-700' },
  INACTIVE:     { label: 'Ngừng bán', color: 'bg-gray-100 text-gray-500' },
  OUT_OF_STOCK: { label: 'Hết hàng',  color: 'bg-yellow-50 text-yellow-700' },
}

export default function ManageAdminBooks() {
  const [books,      setBooks]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total,      setTotal]      = useState(0)
  const [keyword,    setKeyword]    = useState('')
  const [search,     setSearch]     = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchBooks = useCallback(() => {
    setLoading(true)
    const req = search
      ? booksApi.search({ keyword: search, page, size: 20 })
      : booksApi.getAll({ page, size: 20 })
    req
      .then(res => {
        const d = res.data.data || {}
        setBooks(d.content || [])
        setTotalPages(d.totalPages || 0)
        setTotal(d.totalElements || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(keyword.trim())
    setPage(0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa sản phẩm này?')) return
    setDeletingId(id)
    try {
      await booksApi.deleteBook(id)
      toast.success('Đã xóa sản phẩm!')
      fetchBooks()
    } catch {
      toast.error('Không thể xóa sản phẩm')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} sản phẩm</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm tên sách, tác giả..."
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {keyword && (
            <button type="button" onClick={() => { setKeyword(''); setSearch(''); setPage(0) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
          Tìm
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <PageSpinner />
      ) : books.length === 0 ? (
        <div className="card py-20 text-center text-gray-400">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p>{search ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có sản phẩm nào'}</p>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map(book => {
                  const sm = STATUS_META[book.status] || STATUS_META.INACTIVE
                  const price = book.discountPrice ?? book.price
                  return (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.imageUrl || 'https://placehold.co/48x64?text=?'}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-lg border border-gray-100 shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x64?text=?' }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                            <p className="text-xs text-gray-400">{book.author}</p>
                            {book.isbn && <p className="text-xs text-gray-300 font-mono">{book.isbn}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{book.categoryName || '—'}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{formatPrice(price)}</p>
                        {book.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(book.price)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${sm.color}`}>
                          {sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(book.id)} disabled={deletingId === book.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40">
                          {deletingId === book.id ? <Spinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo(0, 0) }} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
