import React, { useEffect, useState, useContext } from "react";
import { apiClient } from "../../apiClient";
import toast, { Toaster } from "react-hot-toast";
import { UserData } from "../../App";
import { Link } from "react-router-dom";

const DraftApplications = () => {
  const userData = useContext(UserData);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState(null);

  const fetchDrafts = async () => {
    try {
      const res = await apiClient("http://localhost:8000/drafts/for-me/", "GET");
      setDrafts(res.drafts || []);
    } catch (err) {
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const respondToDraft = async (draftId, action) => {
    try {
      const res = await apiClient(
        `http://localhost:8000/drafts/${draftId}/respond/`,
        "POST",
        { action }
      );
      toast.success(res.message);
      setSelectedDraft(null);
      fetchDrafts();
    } catch (err) {
      toast.error("Failed to update draft");
    }
  };

  if (loading) return <p>Loading draft applications...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Draft Applications</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-500">No pending drafts.</p>
      ) : (
        <ul className="space-y-4">
          {drafts.map((draft) => (
            <li
              key={draft.id}
              className="p-5 border rounded-lg shadow-md  flex flex-col lg:flex-row justify-between gap-6"
            >
              {/* Freelancer Info */}
              <div className="flex items-center gap-3">
                <img
                  src={draft.freelancer.profilepic}
                  alt={draft.freelancer.fullname}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{draft.freelancer.fullname}</p>
                  <Link to={`/freelancer/${draft.freelancer.username}`}>
                    <p className="text-sm underline text-indigo-600">
                      {draft.freelancer.username}
                    </p>
                  </Link>
                  {draft.group && (
                    <Link to={`/groups/${draft.group.id}`}>
                      <p className="text-sm underline text-indigo-600">
                        {draft.group.name}
                      </p>
                    </Link>
                  )}
                </div>
              </div>

              {/* Draft details */}
              <div className="flex-1">
                <Link to={`/draft/${draft.id}`}>
                  <h3 className="text-lg font-bold">{draft.title}</h3>
                </Link>
                <p className="text-gray-700 mb-2">{draft.description}</p>
                <p className="text-xl font-bold text-green-700">${draft.price}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  className="px-4 py-2 bg-green-300 rounded-full font-bold"
                  onClick={() => {
                    if (
                      parseFloat(userData?.details?.wallet_balance || 0) <
                      parseFloat(draft.price)
                    ) {
                      toast.error("Insufficient wallet balance");
                      return;
                    }
                    setSelectedDraft(draft);
                  }}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-full"
                  onClick={() => respondToDraft(draft.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Accept Modal */}
      {selectedDraft && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedDraft(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Acceptance</h2>
            <p className="mb-2">
              Accept draft <strong>{selectedDraft.title}</strong> from{" "}
              <strong>{selectedDraft.freelancer.fullname}</strong>?
            </p>
            <p className="text-lg font-bold mb-2">
              Price: ${selectedDraft.price}
            </p>
            <p className="text-gray-600">
              This amount will be deducted from your wallet.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setSelectedDraft(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                onClick={() => respondToDraft(selectedDraft.id, "accept")}
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftApplications;
