import { useEffect, useState } from "react";
import { FaBuilding, FaEnvelope, FaPhone, FaUser, FaWhatsapp } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import giveService from "../services/giveService";

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    giveService.getAllGives().then(res => {
      setGives(res.data.results || res.data); // handle paginated or flat
      setLoading(false);
    });
  }, []);

  const filtered = gives.filter(give => {
    const searchText = search.toLowerCase();
    const matches = [
      give.name,
      give.company,
      give.city,
      give.state,
      give.email,
      give.phone,
      give.category,
      give.department,
      give.description
    ].some(field => (field || '').toLowerCase().includes(searchText));
    const matchesCategory = !category || give.category === category;
    return matches && matchesCategory;
  });

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">All Gives <span className="font-normal text-lg text-gray-500">({filtered.length})</span></h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            className="input w-full md:w-64 rounded-lg bg-gray-100 focus:ring-2 focus:ring-primary-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input w-full md:w-48 rounded-lg bg-gray-100 focus:ring-2 focus:ring-primary-400"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10 text-lg text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(give => (
            <div key={give.id} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg">{give.name}</span>
                <span className="text-gray-500 text-sm">({give.category})</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-700 text-sm">
                <div className="flex items-center gap-2"><FaBuilding className="text-primary-700" /> {give.company || <span className="text-gray-400">-</span>}</div>
                <div className="flex items-center gap-2"><FaBuilding className="text-primary-700" /> {give.city}, {give.state}</div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-primary-700" /> {maskEmail(give.email)}</div>
                <div className="flex items-center gap-2"><MdCategory className="text-primary-700" /> {give.department || give.description || <span className="text-gray-400">-</span>}</div>
                <div className="flex items-center gap-2"><FaPhone className="text-primary-700" /> {maskPhone(give.phone)}</div>
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
      )}
    </div>
  );
};

export default AllGives; 