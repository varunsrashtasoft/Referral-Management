import { useEffect, useState } from "react";
import { FaBuilding, FaEnvelope, FaPhone, FaUser, FaWhatsapp } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import giveService from "../services/giveService";
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useLocation } from 'react-router-dom';
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

function maskEmail(email) {
  if (!email) return "";
  const [user] = email.split("@");
  if (!user || user.length < 3) return `*@****`;
  return `*${'*'.repeat(user.length - 2)}*@****`;
}
function maskPhone(phone) {
  if (!phone) return "";
  return phone.slice(0, 2) + "****";
}

const AllGives = () => {
  const [gives, setGives] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('user') || '';
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, isSuperAdmin } = useAuth();
  const location = useLocation();
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchGives = async () => {
      setLoading(true);
      try {
        let res;
        const params = {
          page,
          page_size: pageSize,
          ...(category && { category }),
          ...(selectedUser && { user: selectedUser }),
          ...(search && { search }),
        };
        if (isSuperAdmin) {
          res = await giveService.getAllGivesAdmin(params);
        } else {
          res = await giveService.getAllGives(params);
        }
        setGives(res.data.results || res.data);
        setTotalCount(res.data.count || (res.data.results ? res.data.results.length : res.data.length));
        setTotalPages(res.data.count ? Math.ceil(res.data.count / pageSize) : 1);
      } finally {
        setLoading(false);
      }
    };
    fetchGives();
  }, [isSuperAdmin, page, pageSize, category, selectedUser, search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authService.getUsers();
        setUsers(res.data.results || res.data || []);
      } catch (err) {
        // ignore
      }
    };
    fetchUsers();
  }, []);

  // Sync selectedUser with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedUser(params.get('user') || '');
  }, [location.search]);

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

  // Prepare options for react-select
  const userOptions = [
    { value: '', label: 'All Users' },
    ...users.map(u => ({ value: u.id, label: `${u.first_name || u.username} ${u.last_name || ''}`.trim() }))
  ];
  const categoryOptions = CATEGORY_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }));

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">All Gives <span className="font-normal text-lg text-gray-500">({totalCount})</span></h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by anything..."
            className="input w-full md:w-64 rounded-lg bg-gray-100 focus:ring-2 focus:ring-primary-400"
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
          <Select
            className="w-full md:w-48"
            options={userOptions}
            value={userOptions.find(opt => String(opt.value) === String(selectedUser)) || userOptions[0]}
            onChange={opt => { setSelectedUser(opt.value); setPage(1); }}
            isSearchable
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gives.map(give => (
              <div key={give.id} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{give.name}</span>
                  <span className="text-gray-500 text-sm">({give.category})</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-700 text-sm">
                  <div className="flex items-center gap-2"><FaBuilding className="text-primary-700" /> {give.company || <span className="text-gray-400">-</span>}</div>
                  <div className="flex items-center gap-2"><FaBuilding className="text-primary-700" /> {give.city}, {give.state}</div>
                  <div className="flex items-center gap-2"><FaEnvelope className="text-primary-700" /> {isSuperAdmin ? give.email : maskEmail(give.email)}</div>
                  <div className="flex items-center gap-2"><MdCategory className="text-primary-700" /> {give.department || give.description || <span className="text-gray-400">-</span>}</div>
                  <div className="flex items-center gap-2"><FaPhone className="text-primary-700" /> {isSuperAdmin ? give.phone : maskPhone(give.phone)}</div>
                  <div className="flex items-center gap-2"><FaUser className="text-primary-700" /> {give.role || "Owner"}</div>
                </div>
                <hr className="my-2" />
                <div className="flex items-center gap-2">
                  {/* User profile icon or photo */}
                  {give.user?.profile_picture ? (
                    <img
                      src={give.user.profile_picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-base">
                      {give.user?.first_name?.[0] || give.user?.username?.[0] || "U"}
                    </div>
                  )}
                  <span className="font-semibold text-primary-700 text-sm">
                    {give.user?.first_name || give.user?.username || "User"}
                    {give.user?.last_name ? ` ${give.user.last_name}` : ""}
                  </span>
                  <div className="flex-1" />
                  {give.user?.mobile && (
                    <>
                      <a href={`tel:${give.user.mobile}`} className="bg-primary-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-primary-700 transition"><FaPhone />Call</a>
                      <a href={`https://wa.me/${give.user.mobile}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-green-600 transition"><FaWhatsapp />Chat</a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default AllGives; 