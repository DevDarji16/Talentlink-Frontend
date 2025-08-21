import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../App";
import { apiClient } from "../../apiClient";

const CompletedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useContext(UserData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const role = userData?.details?.role === "client" ? "client" : "freelancer";
        const res = await apiClient(
          `http://localhost:8000/jobstatus/${role}/completed/`,
          "GET"
        );
        setJobs(res || []);
      } catch (err) {
        console.error("Error fetching completed jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userData]);

  if (loading)
    return <p className=" text-center">Loading completed jobs...</p>;

  if (!jobs.length)
    return (
      <p className=" italic text-center">
        No completed jobs yet.
      </p>
    );

  return (
    <div className="space-y-6">
      {jobs.map((job) => {
        const title =
          job.gig?.title || job.job?.job?.title || job.draft?.title || "Untitled";
        const type = job.is_gig ? "Gig" : job.is_job ? "Job" : "Draft";
        const counterpart =
          userData.details.id === job.client.id ? job.freelancer : job.client;
        const counterpartRole =
          userData.details.id === job.client.id ? "Freelancer" : "Client";

        return (
          <div
            key={job.id}
            onClick={() => navigate(`/jobstatus/${job.id}`)}
            className="p-5  border rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-indigo-600 hover:underline">
                {title}
              </h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                {type}
              </span>
            </div>

            {/* Status */}
            <p className="text-sm  mt-1">
               Status:{" "}
              <span className="capitalize font-medium text-green-600">
                {job.status}
              </span>
            </p>

            {/* Price */}
            {job.price && (
              <p className="mt-1  font-medium">
                 Price:{" "}
                <span className="text-indigo-600 font-semibold">
                  ${job.price}
                </span>
              </p>
            )}

            {/* Counterpart */}
            <div className="flex items-center gap-3 mt-3">
              <img
                src={counterpart.profilepic}
                alt={counterpart.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{counterpart.fullname}</p>
                <p className="text-xs text-gray-500">
                  @{counterpart.username} • {counterpartRole}
                </p>
              </div>
            </div>

            {/* Completed Date */}
            {job.created_at && (
              <p className="mt-2 text-xs ">
                 Completed on{" "}
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

export default CompletedJobs;
