import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { booksApi } from '../../api/books'
import { categoriesApi } from '../../api/categories'
import { PageSpinner, Spinner } from '../../components/ui/Spinner'

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

const EMPTY_FORM = {
  title: '', author: '', price: '', discountPrice: '', stockQuantity: '',
  categoryId: '', publisher: '', publishYear: '', isbn: '',
  pageCount: '', language: 'Tiếng Việt', description: '', imageUrl: '', status: 'ACTIVE',
}

export default function ManageBooks() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchBooks = () => {
    booksApi.getAll({ size: 100 })
      .then((res) => setBooks(res.data.data?.content || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBooks()
    categoriesApi.getAll().then((r) => setCategories(r.data.data || []))
  }, [])

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true) }

  const openEdit = (book) => {
    setEditId(book.id)
    setForm({
      title: book.title || '', author: book.author || '',
      price: book.price || '', discountPrice: book.discountPrice || '',
      stockQuantity: book.stockQuantity || '', categoryId: book.categoryId || '',
      status: book.status || 'ACTIVE', imageUrl: book.imageUrl || '',
      publisher: book.publisher || '', publishYear: book.publishYear || '',
      isbn: book.isbn || '', pageCount: book.pageCount || '',
      language: book.language || 'Tiếng Việt', description: book.description || '',
    })
    setShowModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      pageCount: form.pageCount ? Number(form.pageCount) : null,
      publishYear: form.publishYear ? Number(form.publishYear) : null,
    }
    try {
      if (editId) {
        await booksApi.updateBook(editId, data)
        toast.success('Cập nhật thành công!')
      } else {
        await booksApi.createBook(data)
        toast.success('Thêm sách thành công!')
      }
      setShowModal(false)
      fetchBooks()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const deleteBook = async (id) => {
    if (!window.confirm('Xác nhận xóa sách này?')) return
    try {
      await booksApi.deleteBook(id)
      toast.success('Đã xóa')
      fetchBooks()
    } catch {
      toast.error('Không thể xóa')
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sách</h1>
        <button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" /> Thêm sách</button>
      </div>

      {books.length === 0 ? (
        <p className="text-center py-16 text-gray-400">Chưa có sách nào</p>
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
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                    <p className="text-gray-400 text-xs">{book.author}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatPrice(book.discountPrice ?? book.price)}</td>
                  <td className="px-4 py-3 text-gray-500">{book.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className={`badge px-2 py-1 text-xs rounded-full ${book.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : book.status === 'OUT_OF_STOCK' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(book)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteBook(book.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{editId ? 'Sửa sách' : 'Thêm sách mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={save} className="p-5 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Tên sách *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tác giả *</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">NXB</label>
                <input value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} className="input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Giá gốc *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input text-sm" required min={0} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Giá khuyến mãi</label>
                <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input text-sm" min={0} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tồn kho *</label>
                <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="input text-sm" required min={0} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Danh mục</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input text-sm">
                  <option value="">-- Chọn --</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input text-sm">
                  <option value="ACTIVE">Đang bán</option>
                  <option value="INACTIVE">Ngừng bán</option>
                  <option value="OUT_OF_STOCK">Hết hàng</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">URL ảnh bìa</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Năm xuất bản</label>
                <input type="number" value={form.publishYear} onChange={(e) => setForm({ ...form, publishYear: e.target.value })} className="input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Số trang</label>
                <input type="number" value={form.pageCount} onChange={(e) => setForm({ ...form, pageCount: e.target.value })} className="input text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input text-sm resize-none" rows={3} />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
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
