import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Calendar,
  PackageOpen,
  Layers,
  ChevronDown,
  Save,
  X,
  CheckCircle,
  Clock
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.warn("No access token found, redirecting to login");
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
  if (Object.keys(headers).length === 0) {
    return null;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    console.warn("Token expired or invalid, redirecting to login");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_first_name");
    localStorage.removeItem("user_last_name");
    window.location.href = "/login";
    return null;
  }

  return response;
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
  
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    low_stock_threshold: 10,
    expiry_date: "",
    supplier: "",
    price: 0,
    unit: ""
  });

  const categories = [
    "Medications",
    "Supplies",
    "Equipment", 
    "Vaccines",
    "Lab Equipment",
    "Consumables",
    "Personal Protective Equipment"
  ];

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
      const response = await authFetch(`${API_BASE}/stock/`);
      if (!response) return;
      if (!response.ok) throw new Error("Failed to fetch stock");
      const data = await response.json();
      setStock(data);
    } catch (err) {
      console.error("Error fetching stock:", err);
      setErrorMessage("Failed to load stock items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = stock.filter(item => item.quantity <= item.low_stock_threshold);
  const criticalStockItems = stock.filter(item => item.quantity <= 5);
  const totalStockValue = stock.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const uniqueCategories = [...new Set(stock.map(item => item.category))];

  const handleAddItem = async () => {
    try {
      const response = await authFetch(`${API_BASE}/stock/`, {
        method: "POST",
        body: JSON.stringify(newItem),
      });
      
      if (!response) return;
      if (!response.ok) throw new Error("Failed to add item");
      
      await fetchStock();
      setShowAddModal(false);
      setSuccessMessage("Stock item added successfully!");
      setNewItem({
        name: "",
        category: "",
        quantity: 0,
        low_stock_threshold: 10,
        expiry_date: "",
        supplier: "",
        price: 0,
        unit: ""
      });
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding item:", err);
      setErrorMessage("Failed to add item. Please try again.");
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    
    try {
      const response = await authFetch(`${API_BASE}/stock/${selectedItem.id}/`, {
        method: "PUT",
        body: JSON.stringify(selectedItem),
      });
      
      if (!response) return;
      if (!response.ok) throw new Error("Failed to update item");
      
      await fetchStock();
      setShowEditModal(false);
      setSelectedItem(null);
      setSuccessMessage("Stock item updated successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating item:", err);
      setErrorMessage("Failed to update item. Please try again.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await authFetch(`${API_BASE}/stock/${id}/`, {
        method: "DELETE",
      });
      
      if (!response) return;
      if (!response.ok) throw new Error("Failed to delete item");
      
      await fetchStock();
      setSuccessMessage("Stock item deleted successfully!");
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting item:", err);
      setErrorMessage("Failed to delete item. Please try again.");
    }
  };

  const getStockStatusColor = (quantity, threshold) => {
    if (quantity <= 5) return "bg-gradient-to-r from-red-500 to-red-600 text-white";
    if (quantity <= threshold) return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
    return "bg-gradient-to-r from-green-500 to-green-600 text-white";
  };

  const getStockStatusIcon = (quantity, threshold) => {
    const iconClass = "w-[18px] h-[18px] flex-shrink-0";
    if (quantity <= 5) return <AlertTriangle className={iconClass} />;
    if (quantity <= threshold) return <Clock className={iconClass} />;
    return <CheckCircle className={iconClass} />;
  };

  const getStockStatusText = (quantity, threshold) => {
    if (quantity <= 5) return "Critical";
    if (quantity <= threshold) return "Low";
    return "Adequate";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success/Error Messages */}
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
              <p className="text-blue-600 mt-1">
                Manage clinic inventory and supplies
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stock.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Critical Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {criticalStockItems.length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-gray-800">
                    EGP {totalStockValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {uniqueCategories.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Layers className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
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

            {/* Category Filter */}
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
                  <ChevronDown className={`text-blue-500 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} size={16} />
                </button>

                {showCategoryMenu && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-48 overflow-y-auto">
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm"
                      onClick={() => {
                        setSelectedCategory("all");
                        setShowCategoryMenu(false);
                      }}
                    >
                      <span className="font-medium text-blue-600">All Categories</span>
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

            {/* Actions */}
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
                    {/* Item Name */}
                    <div className="col-span-3">
                      <div className="font-bold text-gray-800">{item.name}</div>
                      {item.supplier && (
                        <div className="text-xs text-blue-600">{item.supplier}</div>
                      )}
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
                        <div>
                          <div className="font-medium text-gray-800">{item.quantity} {item.unit}</div>
                          <div className="text-xs text-gray-500">Threshold: {item.low_stock_threshold}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-2">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${getStockStatusColor(item.quantity, item.low_stock_threshold)}`}>
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
                  <span>Adequate: {stock.filter(item => item.quantity > item.low_stock_threshold).length}</span>
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
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
            <div className="p-6">
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
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                    placeholder="Enter item name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Low Stock Alert</label>
                    <input
                      type="number"
                      value={newItem.low_stock_threshold}
                      onChange={(e) => setNewItem({...newItem, low_stock_threshold: parseInt(e.target.value) || 0})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      min="0"
                      placeholder="Alert at"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={newItem.expiry_date}
                    onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      placeholder="Supplier name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Unit</label>
                    <input
                      type="text"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      placeholder="pcs, ml, mg"
                    />
                  </div>
                </div>
              </div>
              
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
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Item Name</label>
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Category</label>
                  <select
                    value={selectedItem.category}
                    onChange={(e) => setSelectedItem({...selectedItem, category: e.target.value})}
                    className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={selectedItem.quantity}
                      onChange={(e) => setSelectedItem({...selectedItem, quantity: parseInt(e.target.value) || 0})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-blue-800 mb-2">Low Stock Alert</label>
                    <input
                      type="number"
                      value={selectedItem.low_stock_threshold}
                      onChange={(e) => setSelectedItem({...selectedItem, low_stock_threshold: parseInt(e.target.value) || 0})}
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={selectedItem.expiry_date}
                    onChange={(e) => setSelectedItem({...selectedItem, expiry_date: e.target.value})}
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
  );
};

export default Stock;