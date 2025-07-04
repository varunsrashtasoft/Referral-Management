import React, { useState, useEffect } from 'react';
import { giveService } from '../services/giveService';
import toast from 'react-hot-toast';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Select from 'react-select';

const CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  { value: "advertising_marketing", label: "Advertising & Marketing" },
  { value: "agriculture", label: "Agriculture" },
  { value: "animals", label: "Animals" },
  { value: "architecture_engineering", label: "Architecture & Engineering" },
  { value: "art_entertainment", label: "Art & Entertainment" },
  { value: "car_motorcycle", label: "Car & Motorcycle" },
  { value: "computer_programming", label: "Computer & Programming" },
  { value: "construction", label: "Construction" },
  { value: "consulting", label: "Consulting" },
  { value: "employment_activities", label: "Employment Activities" },
  { value: "event_business_service", label: "Event & Business Service" },
  { value: "finance_insurance", label: "Finance & Insurance" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "health_wellness", label: "Health & Wellness" },
  { value: "legal_accounting", label: "Legal & Accounting" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "organizations_others", label: "Organizations & Others" },
  { value: "personal_services", label: "Personal Services" },
  { value: "real_estate_services", label: "Real Estate Services" },
  { value: "repair", label: "Repair" },
  { value: "retail", label: "Retail" },
  { value: "security_investigation", label: "Security & Investigation" },
  { value: "sports_leisure", label: "Sports & Leisure" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "training_coaching", label: "Training & Coaching" },
  { value: "transport_shipping", label: "Transport & Shipping" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" },
  { value: "auto_tech_startup", label: "Auto Tech Startup" },
];

const STATE_OPTIONS = [
  { value: '', label: 'Select State' },
  { value: 'Andaman and Nicobar Islands - AN', label: 'Andaman and Nicobar Islands - AN' },
  { value: 'Andhra Pradesh - AP', label: 'Andhra Pradesh - AP' },
  { value: 'Arunachal Pradesh - AR', label: 'Arunachal Pradesh - AR' },
  { value: 'Assam - AS', label: 'Assam - AS' },
  { value: 'Bihar - BR', label: 'Bihar - BR' },
  { value: 'Chandigarh - CH', label: 'Chandigarh - CH' },
  { value: 'Chhattisgarh - CT', label: 'Chhattisgarh - CT' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu - DH', label: 'Dadra and Nagar Haveli and Daman and Diu - DH' },
  { value: 'Delhi - DL', label: 'Delhi - DL' },
  { value: 'Goa - GA', label: 'Goa - GA' },
  { value: 'Gujarat - GJ', label: 'Gujarat - GJ' },
  { value: 'Haryana - HR', label: 'Haryana - HR' },
  { value: 'Himachal Pradesh - HP', label: 'Himachal Pradesh - HP' },
  { value: 'Jammu and Kashmir - JK', label: 'Jammu and Kashmir - JK' },
  { value: 'Jharkhand - JH', label: 'Jharkhand - JH' },
  { value: 'Karnataka - KA', label: 'Karnataka - KA' },
  { value: 'Kerala - KL', label: 'Kerala - KL' },
  { value: 'Ladakh - LA', label: 'Ladakh - LA' },
  { value: 'Lakshadweep - LD', label: 'Lakshadweep - LD' },
  { value: 'Madhya Pradesh - MP', label: 'Madhya Pradesh - MP' },
  { value: 'Maharashtra - MH', label: 'Maharashtra - MH' },
  { value: 'Manipur - MN', label: 'Manipur - MN' },
  { value: 'Meghalaya - ML', label: 'Meghalaya - ML' },
  { value: 'Mizoram - MZ', label: 'Mizoram - MZ' },
  { value: 'Nagaland - NL', label: 'Nagaland - NL' },
  { value: 'Odisha - OR', label: 'Odisha - OR' },
  { value: 'Puducherry - PY', label: 'Puducherry - PY' },
  { value: 'Punjab - PB', label: 'Punjab - PB' },
  { value: 'Rajasthan - RJ', label: 'Rajasthan - RJ' },
  { value: 'Sikkim - SK', label: 'Sikkim - SK' },
  { value: 'Tamil Nadu - TN', label: 'Tamil Nadu - TN' },
  { value: 'Telangana - TG', label: 'Telangana - TG' },
  { value: 'Tripura - TR', label: 'Tripura - TR' },
  { value: 'Uttar Pradesh - UP', label: 'Uttar Pradesh - UP' },
  { value: 'Uttarakhand - UT', label: 'Uttarakhand - UT' },
  { value: 'West Bengal - WB', label: 'West Bengal - WB' },
];

const initialForm = {
  name: '',
  category: '',
  department: '',
  company: '',
  state: '',
  city: '',
  phone: '',
  email: '',
  description: '',
  website: '',
  is_active: true,
};

const MyGives = () => {
  const [gives, setGives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [category, setCategory] = useState("");
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categoryOptions = CATEGORY_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }));

  useEffect(() => {
    fetchGives();
  }, [page, pageSize, category, search]);

  const fetchGives = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...(category && { category }),
        ...(search && { search }),
      };
      const res = await giveService.getMyGives(params);
      setGives(res.data.results || res.data || []);
      setTotalCount(res.data.count || (res.data.results ? res.data.results.length : res.data.length));
      setTotalPages(res.data.count ? Math.ceil(res.data.count / pageSize) : 1);
    } catch (err) {
      toast.error('Failed to fetch gives');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (give) => {
    setForm({
      name: give.name || '',
      category: give.category || '',
      department: give.department || '',
      company: give.company || '',
      state: give.state || '',
      city: give.city || '',
      phone: give.phone || '',
      email: give.email || '',
      description: give.description || '',
      website: give.website || '',
      is_active: typeof give.is_active === 'boolean' ? give.is_active : true,
    });
    setEditId(give.id);
    setShowModal(true);
  };

  const handleDelete = (give) => {
    toast('Delete feature coming soon!');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await giveService.updateGive(editId, form);
        toast.success('Give updated');
      } else {
        await giveService.createGive(form);
        toast.success('Give created');
      }
      setShowModal(false);
      setForm(initialForm);
      setEditId(null);
      fetchGives();
    } catch (err) {
      toast.error(editId ? 'Failed to update give' : 'Failed to create give');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };

  const filteredGives = gives.filter(give =>
    [
      give.name,
      give.company,
      give.city,
      give.state,
      give.email,
      give.phone,
      give.category,
      give.department,
      give.description
    ].some(field => (field || '').toLowerCase().includes(search.toLowerCase())) &&
    (!category || give.category === category)
  );

  // Pagination bar logic
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxPageLinks = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxPageLinks - 1);
    if (end - start < maxPageLinks - 1) {
      start = Math.max(1, end - maxPageLinks + 1);
    }
    if (start > 1) pages.push(<span key="start-ellipsis" className="px-2">...</span>);
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 rounded ${i === page ? 'bg-primary-600 text-white font-bold' : 'bg-gray-100 text-gray-700'} mx-1`}
          onClick={() => setPage(i)}
          disabled={i === page}
        >
          {i}
        </button>
      );
    }
    if (end < totalPages) pages.push(<span key="end-ellipsis" className="px-2">...</span>);
    return (
      <div className="flex justify-center items-center mt-8 gap-1">
        <button
          className="px-3 py-1 rounded bg-gray-100 text-gray-700 mx-1"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >Prev</button>
        {pages}
        <button
          className="px-3 py-1 rounded bg-gray-100 text-gray-700 mx-1"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >Next</button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">My Gives ({gives.length})</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          className="input w-full md:w-64 mb-2 md:mb-0"
          placeholder="Search by anything..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          className="w-full md:w-48"
          options={categoryOptions}
          value={categoryOptions.find(opt => opt.value === category) || categoryOptions[0]}
          onChange={opt => { setCategory(opt.value); setPage(1); }}
          isSearchable
        />
      </div>
      <div className="mb-4 text-right">
        <button
          className="inline-flex items-center gap-2 btn btn-primary px-5 py-2 text-base font-semibold rounded-lg shadow hover:bg-primary-700 hover:scale-105 transition-transform"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="text-lg" /> Add Give
        </button>
      </div>
      {/* Gives List as Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-lg text-gray-400">Loading...</div>
        ) : filteredGives.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No gives found.</div>
        ) : filteredGives.map((give) => (
          <div key={give.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-lg text-gray-900">{give.name}</span>
                {give.category && <span className="ml-2 text-sm text-gray-500">({give.category})</span>}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-500 hover:text-primary-600" onClick={() => handleEdit(give)}><FaEdit /></button>
                <button className="text-gray-500 hover:text-red-600" onClick={() => handleDelete(give)}><FaTrash /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-800 mt-1">
              {give.company && <div className="flex items-center gap-1"><FaBuilding /> {give.company}</div>}
              {(give.city || give.state) && <div className="flex items-center gap-1"><FaMapMarkerAlt />{give.city}{give.city && give.state ? ',' : ''} {give.state}</div>}
            </div>
            <div className="flex flex-wrap gap-4 text-gray-800 mt-1">
              {give.phone && <div className="flex items-center gap-1"><FaPhone /> {give.phone}</div>}
              {give.email && <div className="flex items-center gap-1"><FaEnvelope /> {give.email}</div>}
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
      {/* Add Give Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form className="bg-white p-0 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-fadeIn" onSubmit={handleCreate}>
            <div className="bg-primary-600 text-white px-8 py-5 text-center">
              <h2 className="text-2xl font-bold">{editId ? 'Edit Give' : 'Add Give'}</h2>
            </div>
            <button type="button" className="absolute top-3 right-4 text-gray-300 hover:text-gray-600 text-2xl" onClick={handleModalClose}>&times;</button>
            <div className="px-8 py-6 grid gap-4 bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department (Optional)</label>
                  <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                  <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required>
                    <option value="">Select State</option>
                    {STATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                  <input className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input w-full rounded-lg focus:ring-2 focus:ring-primary-400" placeholder="Enter Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              {/* <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-primary-600"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active Give</label>
              </div> */}
              <div className="flex justify-end mt-4">
                <button type="button" className="btn btn-outline mr-2 px-6 py-2 rounded-lg" onClick={handleModalClose}>Cancel</button>
                <button type="submit" className="btn btn-primary px-6 py-2 text-base font-semibold rounded-lg shadow hover:bg-primary-700 hover:scale-105 transition-transform" disabled={loading}>{loading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Give')}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyGives; 