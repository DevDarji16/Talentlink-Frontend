import React, { useContext, useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Theme } from "../../App";

const JobApplications = ({ userData }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme=useContext(Theme)
  // Modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await apiClient(
        "/jobapplication/pending/",
        // "http://localhost:8000/jobapplication/pending/",
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
        // `http://localhost:8000/applications/${selectedApp.id}/respond/`,
        `/applications/${selectedApp.id}/respond/`,
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
        // `http://localhost:8000/applications/${appId}/respond/`,
        `/applications/${appId}/respond/`,
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
              onClick={() => setSelectedApp(app)}
              className="cursor-pointer p-5 border rounded-lg shadow-md  flex flex-col lg:flex-row justify-between gap-6 hover:shadow-lg transition"
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
                    <p className="text-sm text-orange-600 font-medium">Individual</p>
                  )}
                </div>
              </div>

              {/* Job + Proposal Info */}
              <div className="flex-1">
                <Link to={`/job/${app.job.id}`}>
                  <h3 className="text-lg font-bold">{app.job.title}</h3>
                </Link>
                <p className="text-gray-600 mb-2 line-clamp-2">{app.job.description}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-2">
                  <span>Category: {app.job.category}</span>
                  <span>Budget: ${app.job.budget}</span>
                </div>
                <p className="mb-2 line-clamp-1 text-blue-500 underline hover:text-blue-600" onClick={()=>setShowModal(true)}>
                  <span className="font-medium ">Proposal:</span> {app.proposal_text}
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
                  onClick={(e) => { e.stopPropagation(); handleAccept(app); }}
                  className="px-4 py-2 bg-green-300 text-green-800 font-bold rounded-full hover:bg-green-400"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); rejectApplication(app.id); }}
                  className="px-4 py-2 bg-red-500 text-red-900 font-bold rounded-full hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Full Detail Modal */}
      {showModal && selectedApp && (
        <div onClick={()=>setShowModal(false)} className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div onClick={e=>e.stopPropagation()} className={`${theme==='dark'?'bg-black':'bg-white'} p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]`}>
            <h3 className="text-lg font-bold mb-4">{selectedApp.job.title}</h3>

            <div className="mb-3">
              <p><span className="font-semibold">Freelancer:</span> {selectedApp.freelancer.fullname}</p>
              <p><span className="font-semibold">Username:</span> @{selectedApp.freelancer.username}</p>
              {selectedApp.group && <p><span className="font-semibold">Group:</span> {selectedApp.group.name}</p>}
              {!selectedApp.group && <p><span className="font-semibold">Type:</span> Individual</p>}
            </div>

            <div className="mb-3">
              <p><span className="font-semibold">Proposal:</span> {selectedApp.proposal_text}</p>
              <p><span className="font-semibold">Proposed Price:</span> ${selectedApp.proposed_price}</p>
              <p><span className="font-semibold">Timeline:</span> {selectedApp.expected_timeline}</p>
            </div>

            <div className="mb-3">
              <p><span className="font-semibold">Job Description:</span></p>
              <p className="whitespace-pre-wrap">{selectedApp.job.description}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Close
              </button>
              <button
                onClick={confirmAccept}
                className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
              >
                Confirm Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
