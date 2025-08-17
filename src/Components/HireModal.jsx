import React, { useState } from "react";

const HireModal = ({ isOpen, onClose, onSubmit, gig,userData }) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(message);
    setMessage("");
  };

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs bg-opacity-50 z-50">
      <div onClick={e => { e.stopPropagation() }} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Apply to Hire</h2>
        <p className="text-gray-600 mb-3">
          You are applying for: <strong>{gig.title}</strong>
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message to the freelancer..."
          className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-500"
          rows="4"
        />
        Price:
        <input
          type="number"
          value={gig.price}
          disabled
          className="w-full border rounded-lg p-2 mb-4 bg-gray-100 text-gray-600 cursor-not-allowed"
        />
        <div>Your Wallet Balance: {userData?.details?.wallet_balance}</div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HireModal;
