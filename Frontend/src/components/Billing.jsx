import React, { useState } from "react";
import CreateInvoice from "./CreateInvoice";

const initialInvoices = [
  { id: "#INV-00876", name: "Liam Johnson", amount: "150.00 EGP", method: "Paymob Egypt", status: "Paid" },
  { id: "#INV-00875", name: "Olivia Smith", amount: "75.50 EGP", method: "Credit Card", status: "Pending" },
  { id: "#INV-00874", name: "Noah Williams", amount: "320.00 EGP", method: "InstaPay", status: "Paid" },
  { id: "#INV-00873", name: "Emma Brown", amount: "200.00 EGP", method: "Credit Card", status: "Canceled" },
  { id: "#INV-00872", name: "James Taylor", amount: "55.00 EGP", method: "Cash", status: "Pending" },
];

const Billing = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showCreate, setShowCreate] = useState(false);

  const statusColor = {
    Paid: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Canceled: "bg-red-100 text-red-600",
  };

  const addInvoice = (newInvoice) => {
    setInvoices((prev) => [...prev, newInvoice]);
    setShowCreate(false);
  };

  return (
    <div className="p-8 flex-1">
      {!showCreate ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Billing</h1>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create Invoice
            </button>
          </div>

          <table className="w-full text-left border-collapse bg-white rounded-2xl shadow-sm overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t">
                  <td className="p-3 text-blue-600">{inv.id}</td>
                  <td className="p-3">{inv.name}</td>
                  <td className="p-3">{inv.amount}</td>
                  <td className="p-3">{inv.method}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <CreateInvoice onBack={() => setShowCreate(false)} onSave={addInvoice} />
      )}
    </div>
  );
};

export default Billing;
