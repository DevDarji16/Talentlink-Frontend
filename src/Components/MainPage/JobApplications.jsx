import React, { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const JobApplications = ({ userData }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await apiClient(
        "http://localhost:8000/jobapplication/pending/",
        "GET"
      );
      setApplications(res || []);
    } catch (err) {
      toast.error("Failed to load job applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAccept = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const confirmAccept = async () => {
    if (!selectedApp) return;

    const price = parseFloat(selectedApp.proposed_price);
    const balance = parseFloat(userData?.details?.wallet_balance);

    if (balance < price) {
      toast.error("❌ Insufficient wallet balance!");
      return;
    }

    try {
      await apiClient(
        `http://localhost:8000/applications/${selectedApp.id}/respond/`,
        "POST",
        { action: "accept" }
      );
      toast.success("✅ Application accepted!");
      setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id));
    } catch (err) {
      toast.error("Failed to accept application");
    } finally {
      setShowModal(false);
      setSelectedApp(null);
    }
  };

  const rejectApplication = async (appId) => {
    try {
      await apiClient(
        `http://localhost:8000/applications/${appId}/respond`,
        "POST",
        { action: "reject" }
      );
      toast.success("🚫 Application rejected!");
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (err) {
      toast.error("Failed to reject application");
    }
  };

  if (loading) return <p>Loading job applications...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Job Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-500">No pending applications.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="p-5 border rounded-lg shadow-md bg-white flex flex-col lg:flex-row justify-between gap-6"
            >
              {/* Freelancer Info */}
              <div className="flex items-center gap-3">
                <img
                  src={app.freelancer.profilepic}
                  alt={app.freelancer.fullname}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{app.freelancer.fullname}</p>
                  <Link to={`/freelancer/${app.freelancer.username}`}>
                    <p className="text-sm underline font-medium text-indigo-600">
                      @{app.freelancer.username}
                    </p>
                  </Link>
                  {app.group ? (
                    <Link to={`/groups/${app.group.id}`}>
                      <p className="text-sm text-green-700 font-medium">
                        Group: {app.group.name}
                      </p>
                    </Link>
                  ) : (
                    <p className="text-sm text-orange-600 font-medium">
                      Individual
                    </p>
                  )}
                </div>
              </div>

              {/* Job + Proposal Info */}
              <div className="flex-1">
                <Link to={`/job/${app.job.id}`}>
                  <h3 className="text-lg font-bold">{app.job.title}</h3>
                </Link>
                <p className="text-gray-600 mb-2">{app.job.description}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                  <span>Category: {app.job.category}</span>
                  <span>Budget: ${app.job.budget}</span>
                </div>
                <p className="mb-2">
                  <span className="font-medium">Proposal:</span>{" "}
                  {app.proposal_text}
                </p>
                <p className="text-green-700 font-bold">
                  Proposed Price: ${app.proposed_price}
                </p>
                <p className="text-sm text-gray-500">
                  Timeline: {app.expected_timeline}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAccept(app)}
                  className="px-4 py-2 bg-green-300 text-green-800 font-bold rounded-full hover:bg-green-400"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectApplication(app.id)}
                  className="px-4 py-2 bg-red-500 text-red-900 font-bold rounded-full hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Accept Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Confirm Application Acceptance
            </h3>
            <p className="mb-2">
              <span className="font-semibold">Job:</span> {selectedApp.job.title}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Proposed Price:</span> $
              {selectedApp.proposed_price}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Your Wallet Balance:</span> $
              {userData?.details?.wallet_balance}
            </p>

            {parseFloat(userData?.details?.wallet_balance) >=
            parseFloat(selectedApp.proposed_price) ? (
              <p className="text-green-600 mb-4">
                ✅ You have enough balance to proceed.
              </p>
            ) : (
              <p className="text-red-600 mb-4">
                ❌ Insufficient balance. Please recharge wallet.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAccept}
                className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
