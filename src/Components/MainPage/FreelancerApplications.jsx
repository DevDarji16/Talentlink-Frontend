import React, { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FreelancerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch applications for freelancer
  const fetchApplications = async () => {
    try {
      const res = await apiClient("https://talentlink-nloa.onrender.com/applications/freelancer/", "GET");
      // const res = await apiClient("http://localhost:8000/applications/freelancer/", "GET");
      console.log("Freelancer Applications:", res);
      setApplications(res || []);
    } catch (err) {
      console.error("Error fetching freelancer applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Respond to an application
const handleResponse = async (id, action) => {
  try {
    await apiClient(
      `https://talentlink-nloa.onrender.com/gigapplications/${id}/respond/`,
      // `http://localhost:8000/gigapplications/${id}/respond/`,
      "POST",
      { action }, // body
      { "Content-Type": "application/json" } // headers
    );

    toast.success(`Application ${action}ed successfully`);
    fetchApplications(); // refresh list
  } catch (err) {
    console.error("Error responding to application:", err);
    toast.error("Failed to update application.");
  }
};


  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="p-6">
        <p className="text-gray-500">You don’t have any applications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6  mx-2 p-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
        >
          {/* Gig Info */}
          <div className="flex justify-between items-center mb-2">
            <h3
              onClick={() => navigate(`/gig/${app.gig.id}`)}
              className="text-lg font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              {app.gig.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                app.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : app.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {app.status}
            </span>
          </div>

          {/* Client Info */}
          <div
            onClick={() => navigate(`/client/${app.client.username}`)}
            className="flex items-center gap-3 mb-3 cursor-pointer"
          >
            <img
              src={app.client.profilepic}
              alt={app.client.fullname}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{app.client.fullname}</p>
              <p className="text-sm text-gray-500">@{app.client.username}</p>
            </div>
          </div>

          {/* Message & Price */}
          <p className="text-gray-700 mb-2">💬 {app.message}</p>
          <p className="font-semibold text-gray-900">💵 ${app.price}</p>

          {/* Accept / Reject Buttons */}
          {app.status === "pending" && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleResponse(app.id, "accepted")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleResponse(app.id, "rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FreelancerApplications;
