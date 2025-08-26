import React, { useState, useContext } from "react";
import { apiClient } from "../apiClient";
import { Theme, ThemeSet, UserData } from "../App";
import { Sparkles, Loader2, Users, X } from "lucide-react";

const ApplicationModal = ({ isOpen, onClose, jobId, jobData, onSuccess }) => {
  const userData = useContext(UserData);
  const theme = useContext(Theme)
  const [applyAs, setApplyAs] = useState("individual");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [proposal, setProposal] = useState("");
  const [timeline, setTimeline] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const groups = userData?.details?.leader_of || [];

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        proposal_text: proposal,
        expected_timeline: timeline,
        proposed_price: price,
        apply_as: applyAs,
        ...(applyAs === "group" && selectedGroup ? { group: selectedGroup } : {}),
      };

      await apiClient(
        // `http://localhost:8000/jobapplication/apply/${jobId}/`,
        `https://talentlink-nloa.onrender.com/jobapplication/apply/${jobId}/`,
        "POST",
        payload
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("❌ Failed to apply. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // AI Assist
  const generateProposal = async () => {
    if (!jobData) return;
    setAiLoading(true);

    try {
      const res = await puter.ai.chat(
        [
          {
            role: "system",
            content:
              "You are an AI assistant helping freelancers write professional, concise proposals (under 150 words).",
          },
          {
            role: "user",
            content: `Write a short and compelling proposal (2–3 short paragraphs) for job "${jobData.title}" in category "${jobData.category}". 
      Description: ${jobData.description}. 
      Client: ${jobData.client?.fullname || "Unknown Client"}. 
      Budget: $${jobData.budget}.`,
          },
        ],
        { model: "gpt-4o-mini" }
      );


      const reply =
        res.message?.content.replace(/[#*]{1,3}/g, "") ||
        "⚠️ Couldn’t generate proposal.";
      setProposal(reply);
    } catch {
      alert("AI failed to generate proposal.");
    } finally {
      setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-3">
      <div onClick={e => e.stopPropagation()} className={`${theme === 'light' ? 'bg-white' : 'bg-black'} rounded-2xl shadow-2xl sm:p-6 p-4 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="sm:text-2xl text-xl font-bold  flex flex-wrap items-center gap-2">
            Apply for:{" "}
            <span className="text-indigo-600">{jobData?.title}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {jobData?.category} • Budget:{" "}
            <span className="font-medium ">${jobData?.budget}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Apply As */}
          <div className=" ">
            <label className="block font-medium mb-1 text-gray-700 text-sm sm:text-base">
              Apply As
            </label>
            <select
              value={applyAs}
              onChange={(e) => setApplyAs(e.target.value)}
              className={`${theme === 'dark' ? 'text-white' : 'text-black'} w-full  border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base border border-gray-400`}
            >
              <option value={`individual`} className={` ${theme === 'light' ? 'text-white' : 'text-black'}`}>Individual</option>
              {groups.length > 0 && <option value="group">Group</option>}
            </select>
          </div>

          {/* Group Select */}
          {applyAs === "group" && (
            <div>
              <label className="block font-medium mb-1 text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                <Users size={16} /> Select Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                required
              >
                <option value="">-- Choose Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Proposal */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm sm:text-base">
              Proposal
            </label>
            <div className="relative">
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                required
                rows="6"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                placeholder="Write your proposal here..."
              />
              <button
                type="button"
                onClick={generateProposal}
                disabled={aiLoading}
                className="absolute bottom-3 right-3 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-lg shadow hover:opacity-90 transition text-xs sm:text-sm"
              >
                {aiLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Sparkles size={16} />
                )}
                {aiLoading ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm sm:text-base">
              Expected Timeline
            </label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="e.g. 2 weeks"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 text-sm sm:text-base">
              Proposed Price ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="Enter your price"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 text-white rounded-lg shadow-md transition text-sm sm:text-base ${loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
