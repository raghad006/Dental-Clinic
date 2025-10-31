import React, { useState } from "react";

const CreateInvoice = ({ onBack, onSave }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    amount: "",
    method: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Format amount to end with EGP, avoid duplicates, avoid errors
    const formattedAmount =
      form.amount && typeof form.amount === "string"
        ? form.amount.endsWith("EGP")
          ? form.amount
          : `${form.amount}EGP`
        : `${form.amount || 0}EGP`;

    const newInvoice = {
      ...form,
      amount: formattedAmount,
    };

    onSave(newInvoice);
  };

  return (
    <div className="p-8 flex-1 bg-white rounded-2xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Create New Invoice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block mb-1 font-semibold">Invoice ID</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="#INV-00900"
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Patient Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter patient name"
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Amount</label>
          <input
            type="text"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="150.00"
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Payment Method</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="InstaPay">InstaPay</option>
            <option value="Cash">Cash</option>
            <option value="Paymob Egypt">Insurance</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            ← Back
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save Invoice
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateInvoice;
