import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MdWork } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import { apiClient } from "../../apiClient";
import { UserData } from "../../App";
import ApplicationModal from "../ApplicationModal";

const JobPage = () => {
  const { id } = useParams();
  const userData = useContext(UserData);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState(null); // 👈 application status
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Fetch job details + status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch job details
        const data = await apiClient(`/job/${id}`, "GET");
        // const data = await apiClient(`http://localhost:8000/job/${id}`, "GET");
        setJob(data.job);

        // Fetch application status (only if freelancer)
        if (userData?.details?.role === "freelancer") {
          const statusRes = await apiClient(
            `/jobapplication/status/${id}/`,
            // `http://localhost:8000/jobapplication/status/${id}/`,
            "GET"
          );
          setStatus(statusRes.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Job not found</p>
      </div>
    );
  }

  // UI for application status
  const renderStatus = () => {
    if (!status || status === "not_applied") {
      return (
        <button
          onClick={() => setShowApplyModal(true)}
          className="w-full py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Apply Now
        </button>
      );
    }

    let color = "bg-gray-400";
    if (status === "pending") color = "bg-yellow-500";
    if (status === "hired") color = "bg-green-500";
    if (status === "ongoing") color = "bg-blue-500";
    if (status === "rejected") color = "bg-red-500";

    return (
      <div
        className={`w-full py-2 text-center text-white rounded-lg font-semibold ${color}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Job Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="capitalize">{job.category}</span>
          <span className="mx-2">•</span>
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Client Info + Apply Section */}
        <aside className="border rounded-lg p-6 h-fit">
          {/* Client Info */}
          <div className="flex items-center mb-4">
            <img
              src={job.client.profilepic}
              alt={job.client.fullname}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{job.client.fullname}</h3>
              <p className="text-gray-600">@{job.client.username}</p>
              {job.client.company_name && (
                <p className="text-sm text-gray-500">{job.client.company_name}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <MdWork className="text-gray-500 mr-2" />
              <span>Client</span>
            </div>
            {job.client.portfolio_link && (
              <div className="flex items-center">
                <FaGlobe className="text-gray-500 mr-2" />
                <a
                  href={job.client.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Portfolio
                </a>
              </div>
            )}
          </div>

          {/* Budget + Apply/Status */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Budget</span>
              <span className="text-xl font-bold">${job.budget}</span>
            </div>

            {userData?.details?.role === "client" ? null : renderStatus()}
          </div>
        </aside>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobData={job}
        jobId={job.id}
        onSuccess={async () => {
          // re-fetch status after applying
          const statusRes = await apiClient(
            `/jobapplication/status/${job.id}/`,
            // `http://localhost:8000/jobapplication/status/${job.id}/`,
            "GET"
          );
          setStatus(statusRes.status);
        }}
      />
    </div>
  );
};

export default JobPage;
