import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, Search, Filter, Plus, Edit, Trash2, AlertTriangle,
  RefreshCw, BarChart3, Calendar, PackageOpen, Layers,
  ChevronDown, Save, X, CheckCircle, Clock, Image as ImageIcon
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/login";
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const authFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  if (!Object.keys(headers).length) return null;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return null;
    }

    return response;
  } catch (err) {
    console.error("Network error:", err);
    return null;
  }
};

const Stock = () => {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noExpiryAdd, setNoExpiryAdd] = useState(false);   // For Add Item modal
  const [noExpiryEdit, setNoExpiryEdit] = useState(false); // For Edit Item modal


  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    low_stock_threshold: 10,
    expiry_date: "",
    supplier: "",
    price: 0,
    unit: "",
    image: null,
  });

  const categories = [
    "Medications", "Supplies", "Equipment", 
    "Vaccines" , "Consumables", 
    "Personal Protective Equipment" , "Others"
  ];

  const itemsByCategory = {
    Medications: [  
      { name: "Paracetamol 500mg", unit: "Packx" },
      { name: "Amoxicillin 500mg", unit: "Pack" },
      { name: "Ibuprofen 400mg", unit: "Pack" },
      { name: "Chlorhexidine Mouthwash 0.12%", unit: "Pack" },
      { name: "Lidocaine 2% Injection", unit: "Pack" },
    ],

    Supplies: [
      { name: "Gloves (Latex)", unit: "pcs" },
      { name: "Face Masks", unit: "pcs" },
      { name: "Cotton Rolls", unit: "pcs" },
      { name: "Gauze Pads", unit: "pcs" },
      { name: "Suction Tips", unit: "pcs" },
    ],

    Equipment: [
      { name: "Dental Chair", unit: "pcs" },
      { name: "Dental X-Ray Machine", unit: "pcs" },
      { name: "Autoclave", unit: "pcs" },
      { name: "Ultrasonic Scaler", unit: "pcs" },
    ],

    Vaccines: [
      { name: "Hepatitis B Vaccine", unit: "ml" },
      { name: "Td Vaccine", unit: "ml" },
    ],

    Consumables: [
      { name: "Disposable Syringes", unit: "pcs" },
      { name: "Needles", unit: "pcs" },
    ],

    PPE: [
      { name: "Safety Goggles", unit: "pcs" },
      { name: "Face Shields", unit: "pcs" },
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchStock();
  }, [navigate]);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`${API_BASE}/stock-items/`);
      if (!response) return;

      if (!response.ok) throw new Error("Failed to fetch stock items");

      const data = await response.json();
      setStock(data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load stock items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.unit) {
      setErrorMessage("Please fill in all required fields: Name, Category, Unit");
      return;
    }

    try {
      const imagePath = `/images/${newItem.name}.jpg`;

      const response = await authFetch(`${API_BASE}/stock-items/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          quantity: newItem.quantity,
          low_stock_threshold: newItem.low_stock_threshold,
          expiry_date: noExpiryAdd ? null : newItem.expiry_date,
          supplier: newItem.supplier,
          unit: newItem.unit,
          price: newItem.price,
          image: imagePath,
        }),
      });

      if (!response) return;

      if (response.ok) {
        setSuccessMessage("Item added successfully!");
        setShowAddModal(false);
        setNewItem({
          name: "",
          category: "",
          quantity: 0,
          low_stock_threshold: 10,
          expiry_date: "",
          supplier: "",
          price: 0,
          unit: "",
          image: null,
        });

        fetchStock();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await response.json();
        console.error("Add item error:", data);
        const errorText = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join(" | ");
        setErrorMessage("Failed to add item: " + errorText);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to add item. Please try again.");
    }
  };

  const handleUpdateItem = async () => {
  if (!selectedItem) return;

  const payload = {
    ...selectedItem,
    expiry_date: noExpiryEdit ? null : selectedItem.expiry_date || null,
  };

  try {
    const response = await authFetch(
      `${API_BASE}/stock-items/${selectedItem.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response) return;

    if (response.ok) {
      setShowEditModal(false);
      setSelectedItem(null);
      setNoExpiryEdit(false);
      fetchStock();
    } else {
      const data = await response.json();
      console.error(data);
    }
  } catch (err) {
    console.error(err);
  }
};
const handleDeleteItem = async (id) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;

  try {
    const response = await authFetch(
      `${API_BASE}/stock-items/${id}/`,
      { method: "DELETE" }
    );

    if (response?.ok) {
      fetchStock();
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

const getStockStatusColor = (quantity, threshold) => {
  if (quantity <= 5) return "bg-red-500 text-white";
  if (quantity <= threshold) return "bg-yellow-500 text-white";
  return "bg-green-500 text-white";
};

const getStockStatusIcon = (quantity, threshold) => {
  const className = "w-4 h-4 flex-shrink-0";
  if (quantity <= 5) return <AlertTriangle className={className} />;
  if (quantity <= threshold) return <Clock className={className} />;
  return <CheckCircle className={className} />;
};

// Text for status
const getStockStatusText = (quantity, threshold) => {
  if (quantity <= 5) return "Critical";
  if (quantity <= threshold) return "Low";
  return "Adequate";
};
// ===== Derived Stock Data =====
const filteredStock = stock.filter((item) => {
  const matchesSearch =
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "all" || item.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

const lowStockItems = stock.filter(
  (item) => item.quantity <= item.low_stock_threshold
);

const criticalStockItems = stock.filter(
  (item) => item.quantity <= 5
);

const totalStockValue = stock.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

const uniqueCategories = [...new Set(stock.map((item) => item.category))];

  const getItemImage = (item) => {
  const images = {
    "Paracetamol 500mg": "/images/Paracetamol 500mg.jpg",
    "Amoxicillin 500mg": "/images/Amoxicillin 500mg.jpg",
    "Ibuprofen 400mg": "/images/Ibuprofen 400mg.jpg",
    "Chlorhexidine Mouthwash 0.12%": "/images/Chlorhexidine Mouthwash 0.12%.jpg",
    "Lidocaine 2% Injection": "/images/Lidocaine 2% Injection.jpg",

    "Gloves (Latex)": "/images/Gloves (Latex).jpg",
    "Face Masks": "/images/Face Masks.jpg",
    "Cotton Rolls": "/images/Cotton Rolls.jpg",
    "Gauze Pads": "/images/Gauze Pads.jpg",
    "Suction Tips": "/images/Suction Tips.jpg",

    "Dental Chair": "/images/Dental Chair.jpg",
    "Dental X-Ray Machine": "/images/Dental X-Ray Machine.jpg",
    "Autoclave": "/images/Autoclave.jpg",
    "Ultrasonic Scaler": "/images/Ultrasonic Scaler.jpg",

    "Hepatitis B Vaccine": "/images/Hepatitis B Vaccine.jpg",
    "Td Vaccine": "/images/Td Vaccine.jpg",

    "Dental Impression Material": "/images/Dental Impression Material.jpg",
    "Alginate Powder": "/images/Alginate Powder.jpg",

    "Disposable Syringes": "/images/Disposable Syringes.jpg",
    "Needles": "/images/Needles.jpg",

    "Safety Goggles": "/images/Safety Goggles.jpg",
    "Face Shields": "/images/Face Shields.jpg",
  };

  return images[item.name] || "/images/default-item.jpg";
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Stock Management
              </h1>
              <p className="text-blue-600 mt-1">Manage clinic inventory and supplies</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Items */}
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800">{stock.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            {/* Critical Items */}
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Critical Items</p>
                  <p className="text-2xl font-bold text-red-600">{criticalStockItems.length}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
            {/* Categories */}
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-gray-800">{uniqueCategories.length}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Layers className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter, Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Search className="inline mr-2" size={16} />
                Search Stock Items
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, category, or supplier..."
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 pl-10 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-blue-400" size={16} />
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                <Filter className="inline mr-2" size={16} />
                Filter by Category
              </label>
              <div className="relative">
                <button
                  className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white text-sm"
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                >
                  <span className="text-gray-700 truncate">
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </span>
                  <ChevronDown
                    className={`text-blue-500 transition-transform ${
                      showCategoryMenu ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
                {showCategoryMenu && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-48 overflow-y-auto">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm font-medium text-blue-600"
                      onClick={() => {
                        setSelectedCategory("all");
                        setShowCategoryMenu(false);
                      }}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryMenu(false);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
              <label className="block text-sm font-semibold text-blue-800 mb-2">
                Quick Actions
              </label>
              <div className="flex gap-2">
                <button
                  onClick={fetchStock}
                  className="flex-1 border border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center justify-center gap-1"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex-1 border border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div className="rounded-2xl overflow-hidden border border-blue-100 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-blue-800">
                <div className="col-span-3">Item Name</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Expiry Date</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-blue-50">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-600">Loading stock items...</p>
                </div>
              ) : filteredStock.length > 0 ? (
                filteredStock.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-blue-50/50 transition-all duration-200 items-center text-sm"
                  >
                    {/* Item Name with Image */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        {/* Item Image */}
                        <div className="relative flex-shrink-0">
                          {item.image ? (
                            <img
  src={item.image || getItemImage(item)}
  alt={item.name}
  onError={(e) => { e.target.src = getItemImage(item); }}
/>

                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
                              <ImageIcon className="text-blue-400" size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{item.name}</div>
                          {item.supplier && <div className="text-xs text-blue-600">{item.supplier}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2">
                    <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-lg">
                    <PackageOpen className="text-blue-600" size={14} />
                    </div>
                    <div className="font-medium text-gray-800">
                        {item.quantity} {item.unit}
    </div>
  </div>
</div>

                    {/* Status */}
                    <div className="col-span-2">
                    <div
    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${getStockStatusColor(
      item.quantity,
      item.low_stock_threshold
    )}`}
  >
    {getStockStatusIcon(item.quantity, item.low_stock_threshold)}
    {getStockStatusText(item.quantity, item.low_stock_threshold)}
  </div>
</div>


                    {/* Expiry Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-blue-500" size={14} />
                        <span className="text-gray-700">
                          {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "Not set"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl inline-block mb-4">
                    <Package className="text-blue-500" size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Stock Items Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== "all"
                      ? "Try changing your search or filter criteria"
                      : "No stock items in the system yet"}
                  </p>
                  {!searchTerm && selectedCategory === "all" && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus size={20} /> Add First Item
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary Footer */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between text-sm text-blue-800">
              <div>
                <span className="font-semibold">{filteredStock.length}</span> items found
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>
                    Adequate: {stock.filter((item) => item.quantity > item.low_stock_threshold).length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Low: {lowStockItems.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Critical: {criticalStockItems.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Add New Stock Item</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => {
                        const category = e.target.value;
                        setNewItem({ ...newItem, category, name: "", unit: "" });
                      }}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                    >
                      <option value="">Select category</option>
                      {Object.keys(itemsByCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  {newItem.category && (
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">Item</label>
                      <select
                        value={newItem.name}
                        onChange={(e) => {
                          const selected = itemsByCategory[newItem.category].find(
                            (item) => item.name === e.target.value
                          );
                          setNewItem({
                            ...newItem,
                            name: selected.name,
                            unit: selected.unit,
                          });
                        }}
                        className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      >
                        <option value="">Select item</option>
                        {itemsByCategory[newItem.category].map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity & Low Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })
                        }
                        className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">Low Stock Alert</label>
                      <input
                        type="number"
                        min="0"
                        value={newItem.low_stock_threshold}
                        onChange={(e) =>
                          setNewItem({ ...newItem, low_stock_threshold: parseInt(e.target.value) || 0 })
                        }
                        className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                 <div>
  <label className="block text-sm font-semibold text-blue-800 mb-2">Expiry Date</label>
  <div className="flex items-center gap-2">
    <input
  type="date"
  value={noExpiryAdd ? "" : newItem.expiry_date}
  onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
  disabled={noExpiryAdd}
/>
<label className="flex items-center gap-1 text-sm">
  <input
    type="checkbox"
    checked={noExpiryAdd}
    onChange={(e) => {
      setNoExpiryAdd(e.target.checked);
      if (e.target.checked) setNewItem({ ...newItem, expiry_date: "" });
    }}
  />
  None
</label>

  </div>
</div>


                  {/* Supplier */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      placeholder="Supplier name"
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                    />
                  </div>
                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Unit</label>
                    <input
                      type="text"
                      value={newItem.unit}
                      readOnly
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 bg-gray-100 text-gray-700 text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-blue-200">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {showEditModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Edit Stock Item</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="text-gray-500" size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Item Name (read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Item Name</label>
                    <div className="flex items-center gap-3">
                      {selectedItem.image && (
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.name}
                          className="w-10 h-10 rounded-lg object-cover border border-blue-200"
                          onError={(e) => {
                            e.target.src = getItemImage(selectedItem);
                          }}
                        />
                      )}
                      <div className="flex-1 border border-blue-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700">
                        {selectedItem.name}
                      </div>
                    </div>
                  </div>

                  {/* Category (read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Category</label>
                    <input
                      type="text"
                      value={selectedItem.category}
                      readOnly
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm"
                    />
                  </div>

                  {/* Quantity and Low Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">Quantity</label>
                      <input
  type="number"
  min="0"
  value={selectedItem.quantity}
  onChange={(e) =>
    setSelectedItem({
      ...selectedItem,
      quantity: parseInt(e.target.value) || 0
    })
  }
/>

                    </div>
                    {/* Low Stock Alert */}
<div>
  <label className="block text-sm font-semibold text-blue-800 mb-2">
    Low Stock Alert
  </label>
  <input
  type="number"
  min="0"
  value={selectedItem.low_stock_threshold}
  onChange={(e) =>
    setSelectedItem({
      ...selectedItem,
      low_stock_threshold: parseInt(e.target.value) || 0
    })
  }
/>
</div>

                  </div>

                  <div>
  <label>Expiry Date</label>

  <div style={{ display: "flex", gap: "8px" }}>
    <input
      type="date"
      value={noExpiryEdit ? "" : selectedItem.expiry_date || ""}
      disabled={noExpiryEdit}
      onChange={(e) =>
        setSelectedItem({
          ...selectedItem,
          expiry_date: e.target.value
        })
      }
    />

    <label>
      <input
        type="checkbox"
        checked={noExpiryEdit}
        onChange={(e) => {
          setNoExpiryEdit(e.target.checked);
          if (e.target.checked) {
            setSelectedItem({
              ...selectedItem,
              expiry_date: null
            });
          }
        }}
      />
      None
    </label>
  </div>
</div>

                  {/* Supplier */}
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={selectedItem.supplier || ""}
                      onChange={(e) => setSelectedItem({...selectedItem, supplier: e.target.value})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-blue-200">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                    }}
                    className="px-5 py-2.5 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateItem}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    <Save size={16} /> Update Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;