import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../apiClient";

const ClientApprovals = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // const res = await apiClient("http://localhost:8000/jobstatus/client/submitted/", "GET");
      const res = await apiClient("https://talentlink-nloa.onrender.com/jobstatus/client/submitted/", "GET");
      setJobs(res || []);
    };
    fetchData();
  }, []);

  if (!jobs.length)
    return <p className="text-gray-500 italic text-center">No submissions pending your approval.</p>;

  return (
    <div className="space-y-5">
      {jobs.map((job) => {
        const title = job.gig?.title || job.job?.job?.title || job.draft?.title || "Untitled";
        const type = job.is_gig ? "Gig" : job.is_job ? "Job" : "Draft";

        return (
          <div
            key={job.id}
            onClick={() => navigate(`/jobstatus/${job.id}`)}
            className="p-5 bg-white border rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-indigo-600 hover:underline">{title}</h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                {type}
              </span>
            </div>

            {/* Submission Info */}
            <p className="text-gray-700 text-sm mb-2">
              📌 Status: <span className="font-medium text-yellow-600">{job.status}</span>
            </p>
            <p className="text-sm text-gray-600 mb-2">
              💬 Message: <span className="italic">{job.submission_message || "No message"}</span>
            </p>
            {job.submitted_file && (
              <a
                href={job.submitted_file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                📂 View File
              </a>
            )}

            {/* Participants */}
            <div className="flex items-center gap-3 mt-3">
              <img
                src={job.freelancer.profilepic}
                alt={job.freelancer.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{job.freelancer.fullname}</p>
                <p className="text-xs text-gray-500">@{job.freelancer.username}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClientApprovals;
