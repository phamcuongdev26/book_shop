import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Tag,
  BookMarked, Lightbulb, BarChart2, FlaskConical, Globe,
  Baby, Brain, Palette, Heart, Languages, Ghost, BookHeart,
  BookType, Layers, Search, Church, Smile, GraduationCap,
  Mail, Package, Gift, BookOpen,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { categoriesApi } from '../../api/categories'
import { PageSpinner } from '../../components/ui/Spinner'

// Icon + màu theo slug (giống Home.jsx)
const SLUG_META = {
  'van-hoc':            { icon: BookMarked,    bg: 'bg-violet-100',  text: 'text-violet-600'  },
  'ky-nang-song':       { icon: Lightbulb,     bg: 'bg-amber-100',   text: 'text-amber-600'   },
  'kinh-te-kinh-doanh': { icon: BarChart2,     bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'khoa-hoc-cong-nghe': { icon: FlaskConical,  bg: 'bg-sky-100',     text: 'text-sky-600'     },
  'lich-su-dia-ly':     { icon: Globe,         bg: 'bg-teal-100',    text: 'text-teal-600'    },
  'thieu-nhi':          { icon: Baby,          bg: 'bg-pink-100',    text: 'text-pink-600'    },
  'tam-ly-hoc':         { icon: Brain,         bg: 'bg-indigo-100',  text: 'text-indigo-600'  },
  'nghe-thuat':         { icon: Palette,       bg: 'bg-rose-100',    text: 'text-rose-600'    },
  'suc-khoe-the-thao':  { icon: Heart,         bg: 'bg-red-100',     text: 'text-red-600'     },
  'ngoai-ngu':          { icon: Languages,     bg: 'bg-cyan-100',    text: 'text-cyan-600'    },
  'truyen-kinh-di':     { icon: Ghost,         bg: 'bg-gray-100',    text: 'text-gray-600'    },
  'truyen-tre-em':      { icon: BookHeart,     bg: 'bg-yellow-100',  text: 'text-yellow-600'  },
  'tieu-thuyet':        { icon: BookType,      bg: 'bg-purple-100',  text: 'text-purple-600'  },
  'manga-comic':        { icon: Layers,        bg: 'bg-orange-100',  text: 'text-orange-600'  },
  'trinh-tham':         { icon: Search,        bg: 'bg-slate-100',   text: 'text-slate-600'   },
  'ton-giao-tam-linh':  { icon: Church,        bg: 'bg-lime-100',    text: 'text-lime-700'    },
  'hai-huoc-giai-tri':  { icon: Smile,         bg: 'bg-fuchsia-100', text: 'text-fuchsia-600' },
  'do-dung-hoc-tap':    { icon: GraduationCap, bg: 'bg-blue-100',    text: 'text-blue-600'    },
  'thiep':              { icon: Mail,          bg: 'bg-pink-100',    text: 'text-pink-600'    },
  'gau-bong-mini':      { icon: Package,       bg: 'bg-amber-100',   text: 'text-amber-600'   },
  'qua-tang':           { icon: Gift,          bg: 'bg-red-100',     text: 'text-red-600'     },
}

const DEFAULT_META = { icon: BookOpen, bg: 'bg-gray-100', text: 'text-gray-500' }

const EMPTY = { name: '', description: '', imageUrl: '' }

function CategoryIcon({ cat, size = 'md' }) {
  const meta   = SLUG_META[cat.slug] || DEFAULT_META
  const Icon   = meta.icon
  const sz     = size === 'lg' ? 'w-16 h-16' : 'w-11 h-11'
  const iconSz = size === 'lg' ? 'h-8 w-8'   : 'h-5 w-5'

  if (cat.imageUrl) {
    return (
      <img
        src={cat.imageUrl}
        alt={cat.name}
        className={`${sz} rounded-xl object-cover border border-gray-200 shrink-0`}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
    )
  }
  return (
    <div className={`${sz} ${meta.bg} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon className={`${iconSz} ${meta.text}`} />
    </div>
  )
}

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchCategories = () => {
    categoriesApi.getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => { setEditId(null); setForm(EMPTY); setShowModal(true) }

  const openEdit = (cat) => {
    setEditId(cat.id)
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
    })
    setShowModal(true)
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Tên danh mục không được để trống'); return }
    setSaving(true)
    try {
      if (editId) {
        await categoriesApi.update(editId, form)
        toast.success('Cập nhật danh mục thành công!')
      } else {
        await categoriesApi.create(form)
        toast.success('Thêm danh mục thành công!')
      }
      setShowModal(false)
      fetchCategories()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Xác nhận xóa danh mục này?')) return
    setDeletingId(id)
    try {
      await categoriesApi.delete(id)
      toast.success('Đã xóa danh mục!')
      setCategories(c => c.filter(x => x.id !== id))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại — danh mục đang có sách liên kết')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} danh mục</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Thêm danh mục
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="card py-20 text-center text-gray-400">
          <Tag className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p>Chưa có danh mục nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const meta = SLUG_META[cat.slug] || DEFAULT_META
            return (
              <div key={cat.id}
                className="card p-4 flex items-start gap-4 hover:shadow-md transition-shadow group">

                {/* Ảnh hoặc icon màu */}
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className={`w-16 h-16 ${meta.bg} rounded-xl items-center justify-center shrink-0 ${cat.imageUrl ? 'hidden' : 'flex'}`}>
                  <meta.icon className={`h-8 w-8 ${meta.text}`} />
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {cat.description || 'Chưa có mô tả'}
                  </p>
                  {cat.slug && (
                    <span className={`inline-block mt-1.5 text-xs font-mono px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                      {cat.slug}
                    </span>
                  )}
                </div>

                {/* Thao tác */}
                <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} disabled={deletingId === cat.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal thêm / sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[90dvh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">
                {editId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={save} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <input value={form.name} onChange={set('name')} placeholder="VD: Văn học, Kỹ năng sống..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả</label>
                <textarea value={form.description} onChange={set('description')} rows={3}
                  placeholder="Mô tả ngắn về danh mục..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">URL ảnh đại diện</label>
                <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

                {/* Preview ảnh hoặc icon */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-gray-400">Xem trước:</span>
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="preview"
                      className="h-14 w-14 rounded-xl object-cover border border-gray-200"
                      onError={(e) => { e.target.style.display = 'none' }} />
                  ) : (
                    <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Tag className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors">
                  {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
