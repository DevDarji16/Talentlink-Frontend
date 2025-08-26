import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserData } from "../App";
import { apiClient } from "../apiClient";

const DraftDetail = () => {
  const { id } = useParams();
  const userData = useContext(UserData);

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  // 🔹 Fetch draft detail
  const fetchDraft = async () => {
    try {
      // const res = await apiClient(`http://localhost:8000/drafts/${id}/`, "GET");
      const res = await apiClient(`https://talentlink-nloa.onrender.com/drafts/${id}/`, "GET");
      setDraft(res.draft);
    } catch (err) {
      console.error("Error fetching draft:", err);
      toast.error("Failed to load draft details");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Accept / Reject handler
  const handleRespond = async (action) => {
    if (action === "accept") {
      if (parseFloat(userData.details.wallet_balance) < parseFloat(draft.price)) {
        toast.error("Insufficient balance in your wallet!");
        return;
      }
    }

    try {
      setIsAccepting(true);
      const res = await apiClient(
        // `http://localhost:8000/drafts/${draft.id}/respond/`,
        `https://talentlink-nloa.onrender.com/drafts/${draft.id}/respond/`,
        "POST",
        { action }
      );
      toast.success(res.message || `Draft ${action}ed successfully!`);
      fetchDraft();
    } catch (err) {
      console.error("Error responding to draft:", err);
      toast.error("Failed to respond to draft");
    } finally {
      setIsAccepting(false);
    }
  };

  useEffect(() => {
    fetchDraft();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Draft not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold">{draft.title}</h1>
        <p className="mt-2 text-gray-100">{draft.description}</p>
      </div>

      {/* Draft Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-2">💰 Price</h3>
          <p className="text-2xl font-bold text-indigo-600">${draft.price}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-2">📌 Status</h3>
          <span
            className={`text-lg font-bold ${
              draft.is_accepted ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {draft.is_accepted ? "Accepted" : "Pending"}
          </span>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-2">👥 Type</h3>
          <p className="text-lg font-medium">
            {draft.group ? `Group: ${draft.group.name}` : "Individual"}
          </p>
        </div>
      </div>

      {/* Freelancer + Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Freelancer */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">🎨 Freelancer</h3>
          <div className="flex items-center gap-4">
            <img
              src={draft.freelancer.profilepic}
              alt={draft.freelancer.fullname}
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="font-bold text-gray-800">{draft.freelancer.fullname}</p>
              <p className="text-sm text-gray-500">@{draft.freelancer.username}</p>
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">🏢 Client</h3>
          <div className="flex items-center gap-4">
            <img
              src={draft.client.profilepic}
              alt={draft.client.fullname}
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="font-bold text-gray-800">{draft.client.fullname}</p>
              <p className="text-sm text-gray-500">@{draft.client.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {userData.details.role === "client" && !draft.is_accepted && (
        <div className="flex gap-4">
          <button
            disabled={isAccepting}
            onClick={() => handleRespond("accept")}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition text-lg"
          >
            {isAccepting ? "Processing..." : "✅ Accept"}
          </button>
          <button
            disabled={isAccepting}
            onClick={() => handleRespond("reject")}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl shadow-md hover:bg-red-700 transition text-lg"
          >
            ❌ Reject
          </button>
        </div>
      )}

      {userData.details.role === "freelancer" && !draft.is_accepted && (
        <p className="text-center mt-6 text-gray-500 italic">
          ⏳ Waiting for client’s decision...
        </p>
      )}
    </div>
  );
};

export default DraftDetail;
