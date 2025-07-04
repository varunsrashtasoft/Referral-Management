import React, { useEffect, useState, useRef } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    chapter: '',
    profile_picture: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      setProfile(res.data);
      setForm({
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
        mobile: res.data.mobile || '',
        chapter: res.data.chapter || '',
        profile_picture: res.data.profile_picture || '',
      });
      setImagePreview(res.data.profile_picture || null);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profile_picture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    fetchProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (form.profile_picture && form.profile_picture instanceof File) {
        data = new FormData();
        data.append('first_name', form.first_name);
        data.append('last_name', form.last_name);
        data.append('email', form.email);
        data.append('mobile', form.mobile);
        data.append('chapter', form.chapter);
        data.append('profile_picture', form.profile_picture);
      } else {
        data = {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          mobile: form.mobile,
          chapter: form.chapter,
        };
      }
      await authService.updateProfile(data);
      toast.success('Profile updated');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Update Profile</h1>
        {!editMode && (
          <button type="button" className="btn btn-primary px-6 py-2 text-base font-semibold rounded-lg shadow hover:bg-primary-700 hover:scale-105 transition-transform" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary-400 shadow"
            />
            {editMode && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-primary-500 text-white px-3 py-1 rounded shadow hover:bg-primary-600 text-sm"
                onClick={() => fileInputRef.current.click()}
              >
                Edit
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="first_name"
                className="input w-full bg-gray-100"
                value={form.first_name}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="input w-full bg-gray-100"
                value={form.last_name}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="input w-full bg-gray-100"
                value={form.email}
                onChange={handleChange}
                disabled={!editMode ? true : false}
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobile</label>
              <input
                type="text"
                name="mobile"
                className="input w-full bg-gray-100"
                value={form.mobile}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Mobile Number"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chapter</label>
              <input
                type="text"
                name="chapter"
                className="input w-full bg-gray-100"
                value={form.chapter}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Chapter"
              />
            </div>
          </div>
        </div>
        {editMode && (
          <div className="col-span-2 flex gap-3 mt-4">
            <button type="submit" className="btn btn-primary px-6 py-2 text-base font-semibold rounded-lg shadow hover:bg-primary-700 hover:scale-105 transition-transform" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
            <button type="button" className="btn btn-outline px-6 py-2 text-base font-semibold rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile; 