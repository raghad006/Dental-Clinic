import React, { useState } from "react";
import CreateInvoice from "./CreateInvoice";
import {
  FileText, Search, Filter, Plus, Download, Eye,
  CheckCircle, Clock, XCircle, DollarSign, CreditCard,
  ChevronDown, Calendar, User, Receipt, TrendingUp
} from "lucide-react";

const initialInvoices = [
  { 
    id: "#INV-00876", 
    name: "Liam Johnson", 
    amount: "150.00", 
    method: "Paymob Egypt", 
    status: "Paid",
    date: "2024-01-15",
    treatment: "Dental Cleaning"
  },
  { 
    id: "#INV-00875", 
    name: "Olivia Smith", 
    amount: "75.50", 
    method: "Credit Card", 
    status: "Pending",
    date: "2024-01-14",
    treatment: "Consultation"
  },
  { 
    id: "#INV-00874", 
    name: "Noah Williams", 
    amount: "320.00", 
    method: "InstaPay", 
    status: "Paid",
    date: "2024-01-13",
    treatment: "Root Canal"
  },
  { 
    id: "#INV-00873", 
    name: "Emma Brown", 
    amount: "200.00", 
    method: "Credit Card", 
    status: "Canceled",
    date: "2024-01-12",
    treatment: "Teeth Whitening"
  },
  { 
    id: "#INV-00872", 
    name: "James Taylor", 
    amount: "55.00", 
    method: "Cash", 
    status: "Pending",
    date: "2024-01-11",
    treatment: "X-Ray"
  },
  { 
    id: "#INV-00871", 
    name: "Sophia Clark", 
    amount: "450.00", 
    method: "Bank Transfer", 
    status: "Paid",
    date: "2024-01-10",
    treatment: "Braces Installation"
  },
  { 
    id: "#INV-00870", 
    name: "Michael Lee", 
    amount: "180.00", 
    method: "Credit Card", 
    status: "Paid",
    date: "2024-01-09",
    treatment: "Filling"
  },
  { 
    id: "#INV-00869", 
    name: "Isabella Martinez", 
    amount: "95.00", 
    method: "Cash", 
    status: "Pending",
    date: "2024-01-08",
    treatment: "Checkup"
  },
];

const Billing = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusOptions = ["all", "Paid", "Pending", "Canceled"];

  const statusColor = {
    Paid: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    Pending: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    Canceled: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  };

  const statusIcon = {
    Paid: <CheckCircle className="w-[18px] h-[18px]" />,
    Pending: <Clock className="w-[18px] h-[18px]" />,
    Canceled: <XCircle className="w-[18px] h-[18px]" />,
  };

  const methodIcon = {
    "Credit Card": <CreditCard className="w-4 h-4 text-blue-500" />,
    "Cash": <DollarSign className="w-4 h-4 text-green-500" />,
    "Paymob Egypt": <Receipt className="w-4 h-4 text-purple-500" />,
    "InstaPay": <TrendingUp className="w-4 h-4 text-orange-500" />,
    "Bank Transfer": <CreditCard className="w-4 h-4 text-indigo-500" />,
  };

  const addInvoice = (newInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    setShowCreate(false);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const paidInvoices = invoices.filter(inv => inv.status === "Paid");
  const pendingInvoices = invoices.filter(inv => inv.status === "Pending");
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {!showCreate ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <FileText className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Billing & Invoices
                  </h1>
                  <p className="text-blue-600 mt-1">
                    Manage patient invoices and payments
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-800">
                        EGP {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>

                {/* Paid Invoices */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Paid Invoices</p>
                      <p className="text-2xl font-bold text-green-600">{paidInvoices.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CheckCircle className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>

                {/* Pending Amount */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Pending Amount</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        EGP {pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="text-yellow-600" size={24} />
                    </div>
                  </div>
                </div>

                {/* Total Invoices */}
                <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Invoices</p>
                      <p className="text-2xl font-bold text-gray-800">{invoices.length}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search, Filter, Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {/* Search */}
                <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    <Search className="inline mr-2" size={16} />
                    Search Invoices
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by ID, patient name, or treatment..."
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 pl-10 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-blue-400" size={16} />
                  </div>
                </div>

                {/* Filter by Status */}
                <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    <Filter className="inline mr-2" size={16} />
                    Filter by Status
                  </label>
                  <div className="relative">
                    <button
                      className="w-full border border-blue-200 rounded-lg px-3 py-2.5 text-left flex justify-between items-center hover:border-blue-400 transition-all bg-white text-sm"
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                    >
                      <span className="text-gray-700 truncate">
                        {selectedStatus === "all" ? "All Statuses" : selectedStatus}
                      </span>
                      <ChevronDown className={`text-blue-500 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} size={16} />
                    </button>
                    {showStatusMenu && (
                      <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl border border-blue-200 max-h-48 overflow-y-auto">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            className="block w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-blue-100 transition-all text-sm capitalize"
                            onClick={() => {
                              setSelectedStatus(status);
                              setShowStatusMenu(false);
                            }}
                          >
                            {status === "all" ? "All Statuses" : status}
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
                    <button className="flex-1 border border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center justify-center gap-1">
                      <Download size={14} /> Export
                    </button>
                    <button
                      onClick={() => setShowCreate(true)}
                      className="flex-1 border border-blue-200 text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-all text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Plus size={14} /> New Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
              <div className="rounded-2xl overflow-hidden border border-blue-100 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-blue-800">
                    <div className="col-span-2">Invoice ID</div>
                    <div className="col-span-2">Patient</div>
                    <div className="col-span-2">Treatment</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>

                <div className="divide-y divide-blue-50">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-blue-50/50 transition-all duration-200 items-center text-sm">
                        {/* Invoice ID */}
                        <div className="col-span-2">
                          <div className="font-bold text-blue-600">{invoice.id}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Calendar size={12} />
                            {new Date(invoice.date).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Patient */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 rounded-lg">
                              <User className="text-blue-600" size={14} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{invoice.name}</div>
                            </div>
                          </div>
                        </div>

                        {/* Treatment */}
                        <div className="col-span-2">
                          <div className="text-gray-700">{invoice.treatment}</div>
                        </div>

                        {/* Amount & Payment Method */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-green-500" size={14} />
                            <div>
                              <div className="font-bold text-gray-800">EGP {parseFloat(invoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                {methodIcon[invoice.method]}
                                {invoice.method}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${statusColor[invoice.status]}`}>
                            {statusIcon[invoice.status]}
                            {invoice.status}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2">
                          <div className="flex gap-2 justify-end">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <FileText size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl inline-block mb-4">
                        <FileText className="text-blue-500" size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Invoices Found</h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm || selectedStatus !== "all" 
                          ? "Try changing your search or filter criteria" 
                          : "No invoices in the system yet"}
                      </p>
                      {!searchTerm && selectedStatus === "all" && (
                        <button
                          onClick={() => setShowCreate(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus size={20} /> Create First Invoice
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
                    <span className="font-semibold">{filteredInvoices.length}</span> invoices found
                    {selectedStatus !== "all" && ` with status: ${selectedStatus}`}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Paid: {paidInvoices.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Pending: {pendingInvoices.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>Canceled: {invoices.filter(inv => inv.status === "Canceled").length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <CreateInvoice onBack={() => setShowCreate(false)} onSave={addInvoice} />
        )}
      </div>
    </div>
  );
};

export default Billing;