import React, { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import { useNavigate } from "react-router-dom";

const ProfileClientApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await apiClient(
          "http://localhost:8000/applications/client/",
          "GET"
        );
        console.log("Client Applications:", res);
        setApplications(res || []);
      } catch (err) {
        console.error("Error fetching client applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading your applications...</p>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="p-6">
        <p className="text-gray-500">You haven’t applied for any gigs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((app) => (
        <div
          key={app.id}
          className="p-4  border rounded-lg shadow-sm hover:shadow-md transition"
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

          {/* Freelancer Info */}
          <div
            onClick={() => navigate(`/freelancer/${app.freelancer.username}`)}
            className="flex items-center gap-3 mb-3 cursor-pointer"
          >
            <img
              src={app.freelancer.profilepic}
              alt={app.freelancer.fullname}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{app.freelancer.fullname}</p>
              <p className="text-sm text-gray-500">@{app.freelancer.username}</p>
            </div>
          </div>

          {/* Message & Price */}
          <p className="text-gray-700 mb-2">💬 {app.message}</p>
          <p className="font-semibold text-gray-900">💵 ${app.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileClientApplications;
