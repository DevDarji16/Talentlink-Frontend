import React, { useContext, useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import toast, { Toaster } from "react-hot-toast";
import { Theme, ThemeSet } from "../../App";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const theme=useContext(Theme)
  const setTheme=useContext(ThemeSet)

  // Fetch wallet details
  const fetchWallet = async () => {
    try {
      const res = await apiClient("/wallet/details/", "GET");
      // const res = await apiClient("http://localhost:8000/wallet/details/", "GET");
      setBalance(res.balance);
      setTransactions(res.transactions);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      toast.error("Failed to fetch wallet details");
    } finally {
      setLoading(false);
    }
  };

  // Add money handler
  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      const res = await apiClient("/wallet/add/", "POST", {
      // const res = await apiClient("http://localhost:8000/wallet/add/", "POST", {
        amount: parseFloat(amount),
      });
      console.log(res)
      toast.success("Money added successfully!");
      setBalance(res.balance);
      setTransactions((prev) => [res.transaction, ...prev]);
      setAmount("");
    } catch (err) {
      console.error("Error adding money:", err);
      toast.error("Failed to add money");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (loading) return <p>Loading Wallet...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-right" />

      {/* Balance Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg mb-6">
        <h2 className="text-lg">Available Balance</h2>
        <p className="text-5xl font-bold mt-2">${balance.toFixed(2)}</p>
      </div>

      {/* Add Money Section */}
      <div className="border border-gray-300 shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Money</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddMoney}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="border border-gray-300 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between items-center border-b border-gray-400 pb-2"
              >
                <div>
                  <p className="font-medium">{tx.reference}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`font-bold ${
                    tx.tx_type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.tx_type === "credit" ? "+" : "-"}${tx.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Wallet;
