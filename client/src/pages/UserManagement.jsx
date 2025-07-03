import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { giveService } from '../services/giveService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '', mobile: '', chapter: '', is_superadmin: false, profile_picture: null });
  const [loading, setLoading] = useState(false);
  const [gives, setGives] = useState([]);
  const [showGivesModal, setShowGivesModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.useRef();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authService.getUsers();
      console.log('Fetched users:', res.data);
      setUsers(res.data.results || []);
    } catch (err) {
      toast.error('Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profile_picture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (form.password !== form.password_confirm) {
      setFormError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      let data;
      if (form.profile_picture) {
        data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (value !== null && value !== undefined) data.append(key, value);
        });
      } else {
        data = form;
      }
      const createRes = await authService.createUser(data);
      toast.success('User created');
      setShowCreateModal(false);
      setForm({ username: '', email: '', first_name: '', last_name: '', password: '', password_confirm: '', mobile: '', chapter: '', is_superadmin: false, profile_picture: null });
      setImagePreview(null);
      fetchUsers();
    } catch (err) {
      setFormError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);
    try {
      await authService.updateUser(selectedUser.id, form);
      toast.success('User updated');
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      setFormError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      await authService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleShowGives = async (userId) => {
    setLoading(true);
    try {
      const res = await giveService.getUserGives(userId);
      setGives(res.data);
      setShowGivesModal(true);
    } catch (err) {
      toast.error('Failed to fetch gives');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>+ Create User</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading users...</td></tr>
            ) : Array.isArray(users) && users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No users found.</td></tr>
            ) : Array.isArray(users) && users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.first_name} {u.last_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{u.chapter}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button className="btn btn-sm btn-secondary" onClick={() => { setSelectedUser(u); setForm(u); setShowUserModal(true); }}>Edit</button>
                  <button className="btn btn-sm btn-outline" onClick={() => handleDelete(u.id)}>Delete</button>
                  <button className="btn btn-sm btn-primary" onClick={() => handleShowGives(u.id)}>View Gives</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative" onSubmit={handleCreate}>
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowCreateModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Create User</h2>
            {formError && <div className="mb-4 text-red-600 text-sm text-center">{formError}</div>}
            <div className="mb-4 flex flex-col items-center">
              <div className="relative">
                <img
                  src={imagePreview || '/default-avatar.png'}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-primary-500 text-white px-2 py-1 rounded shadow hover:bg-primary-600 text-xs"
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input className="input w-full" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="input w-full" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-4 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input className="input w-full" placeholder="First Name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input className="input w-full" placeholder="Last Name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input className="input w-full" placeholder="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <input className="input w-full" placeholder="Chapter" value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })} />
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input className="input w-full" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input className="input w-full" type="password" placeholder="Confirm Password" value={form.password_confirm} onChange={e => setForm({ ...form, password_confirm: e.target.value })} required />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative" onSubmit={handleEdit}>
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowUserModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>
            {formError && <div className="mb-4 text-red-600 text-sm text-center">{formError}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input className="input w-full" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required disabled />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="input w-full" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="mb-4 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input className="input w-full" placeholder="First Name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input className="input w-full" placeholder="Last Name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input className="input w-full" placeholder="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <input className="input w-full" placeholder="Chapter" value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })} />
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <input type="checkbox" id="is_superadmin" checked={!!form.is_superadmin} onChange={e => setForm({ ...form, is_superadmin: e.target.checked })} />
              <label htmlFor="is_superadmin" className="text-sm font-medium text-gray-700">Super Admin</label>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" className="btn btn-outline" onClick={() => setShowUserModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Gives Modal */}
      {showGivesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Gives for {selectedUser?.username}</h2>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {gives.map(give => (
                    <tr key={give.id}>
                      <td className="py-2 px-4 border-b">{give.id}</td>
                      <td className="py-2 px-4 border-b">{give.title}</td>
                      <td className="py-2 px-4 border-b">{give.status}</td>
                      <td className="py-2 px-4 border-b">{new Date(give.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-outline" onClick={() => setShowGivesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 