import React, { useContext, useState } from "react";
import DraftApplications from "./DraftApplications";
import JobApplications from "./JobApplications";
import { UserData } from "../../App";

const Applications = () => {
  const [activeTab, setActiveTab] = useState("draft"); // default = draft
  const userData=useContext(UserData)
  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("draft")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "draft"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Draft Applications
        </button>
        <button
          onClick={() => setActiveTab("job")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "job"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Job Applications
        </button>
      </div>

      {/* Render section based on tab */}
      {activeTab === "draft" && <DraftApplications />}
      {activeTab === "job" && <JobApplications userData={userData} />}
    </div>
  );
};

export default Applications;
