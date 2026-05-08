import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { booksApi } from '../../api/books'
import { categoriesApi } from '../../api/categories'
import { PageSpinner, Spinner } from '../../components/ui/Spinner'
import type { BookSummary, BookDetail, CategoryResponse } from '../../types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

type BookForm = Partial<Omit<BookDetail, 'id' | 'categoryName' | 'sellerId' | 'sellerName' | 'avgRating' | 'totalSold'>>

const EMPTY_FORM: BookForm = {
  title: '', author: '', price: 0, stockQuantity: 0, categoryId: undefined,
  publisher: '', publishYear: undefined, isbn: '', pageCount: undefined,
  language: 'Tiếng Việt', description: '', imageUrl: '', discountPrice: undefined,
  status: 'ACTIVE',
}

export default function ManageBooks() {
  const [books, setBooks] = useState<BookSummary[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<BookForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchBooks = () => {
    booksApi.getAll({ size: 100 })
      .then((res) => setBooks(res.data.result.content))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    Promise.all([fetchBooks(), categoriesApi.getAll().then((r) => setCategories(r.data.result))])
  }, [])

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (book: BookSummary) => {
    setEditId(book.id)
    setForm({ title: book.title, author: book.author, price: book.price, discountPrice: book.discountPrice, imageUrl: book.imageUrl, categoryId: book.categoryId, status: book.status })
    setShowModal(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await booksApi.updateBook(editId, form)
        toast.success('Cập nhật thành công')
      } else {
        // For create we send JSON directly
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)) })
        await booksApi.createBook(fd)
        toast.success('Thêm sách thành công')
      }
      setShowModal(false)
      fetchBooks()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const deleteBook = async (id: number) => {
    if (!confirm('Xác nhận xóa sách này?')) return
    try {
      await booksApi.deleteBook(id)
      toast.success('Đã xóa')
      fetchBooks()
    } catch {
      toast.error('Không thể xóa')
    }
  }

  const f = (k: keyof BookForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = ['price', 'discountPrice', 'stockQuantity', 'pageCount', 'publishYear', 'categoryId'].includes(k)
      ? (e.target.value === '' ? undefined : Number(e.target.value))
      : e.target.value
    setForm((prev) => ({ ...prev, [k]: val }))
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sách</h1>
        <button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" /> Thêm sách</button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Chưa có sách nào</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Sách</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                      <p className="text-gray-400 text-xs">{book.author}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatPrice(book.discountPrice ?? book.price)}</td>
                  <td className="px-4 py-3 text-gray-500">{book.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className={`badge px-2 py-1 text-xs ${book.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : book.status === 'OUT_OF_STOCK' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(book)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteBook(book.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{editId ? 'Sửa sách' : 'Thêm sách mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tên sách *</label>
                  <input value={form.title || ''} onChange={f('title')} className="input text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tác giả *</label>
                  <input value={form.author || ''} onChange={f('author')} className="input text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">NXB</label>
                  <input value={form.publisher || ''} onChange={f('publisher')} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Giá gốc *</label>
                  <input type="number" value={form.price || ''} onChange={f('price')} className="input text-sm" required min={0} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                  <input type="number" value={form.discountPrice ?? ''} onChange={f('discountPrice')} className="input text-sm" min={0} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tồn kho *</label>
                  <input type="number" value={form.stockQuantity ?? ''} onChange={f('stockQuantity')} className="input text-sm" required min={0} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Danh mục</label>
                  <select value={form.categoryId ?? ''} onChange={f('categoryId')} className="input text-sm">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
                  <select value={form.status || 'ACTIVE'} onChange={f('status')} className="input text-sm">
                    <option value="ACTIVE">Đang bán</option>
                    <option value="INACTIVE">Ngừng bán</option>
                    <option value="OUT_OF_STOCK">Hết hàng</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">URL ảnh bìa</label>
                  <input value={form.imageUrl || ''} onChange={f('imageUrl')} className="input text-sm" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Năm xuất bản</label>
                  <input type="number" value={form.publishYear ?? ''} onChange={f('publishYear')} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số trang</label>
                  <input type="number" value={form.pageCount ?? ''} onChange={f('pageCount')} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ISBN</label>
                  <input value={form.isbn || ''} onChange={f('isbn')} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ngôn ngữ</label>
                  <input value={form.language || ''} onChange={f('language')} className="input text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
                  <textarea value={form.description || ''} onChange={f('description')} className="input text-sm resize-none" rows={3} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Hủy</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <Spinner size="sm" /> : editId ? 'Lưu thay đổi' : 'Thêm sách'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
