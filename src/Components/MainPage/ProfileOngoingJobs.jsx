import React, { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import { useNavigate } from "react-router-dom";

const ProfileOngoingJobs = ({ role }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url =
          role === "client"
            ? "http://localhost:8000/jobstatus/client/ongoing/"
            : "http://localhost:8000/jobstatus/freelancer/ongoing/";
        const res = await apiClient(url, "GET");
        setJobs(res.data || []);
      } catch (err) {
        console.error("Error fetching ongoing jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [role]);

  if (loading) return <p className="text-gray-500">Loading ongoing jobs...</p>;
  if (!jobs.length)
    return (
      <p className="text-gray-500 italic text-center">
        No ongoing work yet.
      </p>
    );

  return (
    <div className="space-y-6">
      {jobs.map((job) => {
        let title = "";
        let link = "";
        let price = "";
        let isGroup = false;
        let groupName = "";

        if (job.is_gig && job.gig) {
          title = job.gig.title;
          link = `/gig/${job.gig.id}`;
          price = job.price;
          isGroup = !!job.gig.group;
          groupName = job.gig.group?.name;
        } else if (job.is_job && job.job) {
          title = job.job.title;
          link = `/job/${job.job.id}`;
          price = job.job.price;
          isGroup = !!job.job.group;
          groupName = job.job.group?.name;
        } else if (job.is_draft && job.draft) {
          title = job.draft.title;
          link = `/draft/${job.draft.id}`;
          price = job.draft.price;
          isGroup = !!job.draft.group;
          groupName = job.draft.group?.name;
        }

        return (
          <div
            key={job.id}
            onClick={() => navigate(link)}
            className="p-5 bg-white border rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-indigo-600 hover:underline">
                {title}
              </h3>

              {/* Group / Individual Badge */}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  isGroup
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {isGroup ? `Group: ${groupName}` : "Individual"}
              </span>
            </div>

            {/* Status */}
            <p className="text-sm text-gray-600 mt-1">
              📌 Status:{" "}
              <span className="capitalize font-medium text-green-600">
                {job.status}
              </span>
            </p>

            {/* Price */}
            {price && (
              <p className="mt-2 text-gray-700 font-medium">
                💰 Price:{" "}
                <span className="text-indigo-600 font-semibold">${price}</span>
              </p>
            )}

            {/* Client + Freelancer */}
            <div className="mt-3 text-sm text-gray-700">
              👤 <span className="font-medium">Client:</span>{" "}
              {job.client.fullname} <br />
              👤 <span className="font-medium">Freelancer:</span>{" "}
              {job.freelancer.fullname}
            </div>

            {/* Created At */}
            {job.created_at && (
              <p className="mt-2 text-xs text-gray-500">
                📅 Started on{" "}
                {new Date(job.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileOngoingJobs;
