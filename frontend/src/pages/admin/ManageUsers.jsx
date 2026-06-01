import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, User, Shield, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { usersApi } from '../../api/users'
import { PageSpinner } from '../../components/ui/Spinner'

const ROLES = ['USER', 'SELLER', 'ADMIN']
const ROLE_LEVEL = { USER: 0, SELLER: 1, ADMIN: 2 }

const ROLE_META = {
  USER:   { label: 'Người dùng', color: 'bg-gray-100 text-gray-700',    icon: User },
  SELLER: { label: 'Người bán',  color: 'bg-blue-100 text-blue-700',    icon: Shield },
  ADMIN:  { label: 'Quản trị',   color: 'bg-purple-100 text-purple-700', icon: ShieldAlert },
}

const EMPTY = {
  username: '', email: '', password: '', fullName: '',
  phoneNumber: '', address: '', role: 'USER', isActive: true,
}

function formatDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('vi-VN')
}

// Đọc isActive an toàn — hỗ trợ cả "isActive" lẫn "active" (Lombok/Jackson)
function getActive(u) {
  if (typeof u.isActive === 'boolean') return u.isActive
  if (typeof u.active  === 'boolean') return u.active
  return true
}

export default function ManageUsers() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [originalRole, setOriginalRole] = useState('USER')
  const [saving, setSaving]         = useState(false)
  const [lockingId, setLockingId]   = useState(null)
  const [search, setSearch]         = useState('')

  const fetchUsers = () => {
    usersApi.getAll()
      .then((res) => setUsers(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const openCreate = () => { setEditId(null); setForm(EMPTY); setOriginalRole('USER'); setShowModal(true) }

  const openEdit = (u) => {
    setEditId(u.id)
    setOriginalRole(u.role || 'USER')
    setForm({
      username:    u.username    || '',
      email:       u.email       || '',
      password:    '',
      fullName:    u.fullName    || '',
      phoneNumber: u.phoneNumber || '',
      address:     u.address     || '',
      role:        u.role        || 'USER',
      isActive:    getActive(u),
    })
    setShowModal(true)
  }

  // Soft delete — chỉ set isActive = false, không xóa DB
  const softDelete = async (u) => {
    if (!window.confirm(`Khóa tài khoản "${u.username}"?`)) return
    setLockingId(u.id)
    try {
      await usersApi.update(u.id, {
        username:    u.username,
        email:       u.email,
        fullName:    u.fullName    || '',
        phoneNumber: u.phoneNumber || '',
        address:     u.address     || '',
        role:        u.role,
        isActive:    false,
        active:      false,   // gửi cả hai key để tương thích trước/sau rebuild backend
      })
      toast.success(`Đã khóa tài khoản "${u.username}"!`)
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLockingId(null)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) { toast.error('Username không được để trống'); return }
    if (!form.email.trim())    { toast.error('Email không được để trống'); return }
    if (!editId && !form.password.trim()) { toast.error('Mật khẩu không được để trống khi tạo mới'); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        active: form.isActive,   // gửi cả hai key để tương thích
      }
      if (!payload.password) delete payload.password

      if (editId) {
        await usersApi.update(editId, payload)
        toast.success('Cập nhật tài khoản thành công!')
      } else {
        await usersApi.create(payload)
        toast.success('Thêm tài khoản thành công!')
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} tài khoản</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Thêm tài khoản
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo username, email, họ tên..."
          className="w-full sm:max-w-sm px-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Tài khoản</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Không có tài khoản nào</td></tr>
            ) : filtered.map((u) => {
              const meta   = ROLE_META[u.role] || ROLE_META.USER
              const RoleIcon = meta.icon
              const active = getActive(u)
              return (
                <tr key={u.id} className={`transition-colors hover:bg-gray-50 ${!active ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                        <span className={`text-xs font-bold ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
                          {(u.fullName || u.username || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.username}</p>
                        {u.fullName && <p className="text-xs text-gray-400">{u.fullName}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                      <RoleIcon className="h-3 w-3" />{meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {active ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Nút cập nhật — luôn hiển thị */}
                      <button
                        onClick={() => openEdit(u)}
                        title="Cập nhật"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* Nút xóa (soft delete) — chỉ active khi tài khoản đang hoạt động */}
                      <button
                        onClick={() => softDelete(u)}
                        disabled={!active || lockingId === u.id}
                        title={active ? 'Khóa tài khoản' : 'Tài khoản đã bị khóa'}
                        className="p-1.5 rounded-lg transition-colors
                          enabled:text-gray-400 enabled:hover:text-red-600 enabled:hover:bg-red-50
                          disabled:text-gray-200 disabled:cursor-not-allowed">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal thêm / sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[92dvh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">{editId ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={save} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Username <span className="text-rose-500">*</span></label>
                  <input value={form.username} onChange={set('username')} disabled={!!editId}
                    placeholder="username"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email <span className="text-rose-500">*</span></label>
                  <input value={form.email} onChange={set('email')} type="email" placeholder="email@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Mật khẩu {!editId && <span className="text-rose-500">*</span>}
                  {editId && <span className="font-normal text-gray-400"> (để trống nếu không đổi)</span>}
                </label>
                <input value={form.password} onChange={set('password')} type="password" placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên</label>
                <input value={form.fullName} onChange={set('fullName')} placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
                  <input value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="0912345678"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Vai trò</label>
                  {form.role === 'ADMIN' ? (
                    <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed">
                      Quản trị viên (không thể thay đổi)
                    </div>
                  ) : (
                    <select value={form.role} onChange={set('role')}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      {['USER', 'SELLER']
                        .filter(r => !editId || ROLE_LEVEL[r] >= ROLE_LEVEL[originalRole])
                        .map(r => <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>)
                      }
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ</label>
                <input value={form.address} onChange={set('address')} placeholder="Địa chỉ..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>

              {/* Trạng thái — chỉ hiện khi edit */}
              {editId && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={set('isActive')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Tài khoản đang hoạt động
                  </label>
                </div>
              )}

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
