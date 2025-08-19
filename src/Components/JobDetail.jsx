import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { UserData } from "../App";
import { apiClient } from "../apiClient";

const JobDetail = () => {
  const { id } = useParams();
  const userData = useContext(UserData);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // ⭐ review states
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewed, setReviewed] = useState(false);

  // Fetch Job Details
  const fetchJob = async () => {
    try {
      const res = await apiClient(`http://localhost:8000/jobstatus/${id}/`, "GET");
      console.log('data job detail', res)
      setJob(res);
    } catch (err) {
      console.error("Error fetching job:", err);
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  // ✅ Upload to Cloudinary
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return toast.error("Please select a file first");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/auto/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        setFileUrl(data.secure_url);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Submit Work
  const handleSubmitWork = async () => {
    if (!fileUrl && !message) {
      return toast.error("Please provide a message or file/link");
    }
    try {
      const res = await apiClient(
        `http://localhost:8000/job/${job.id}/submit/`,
        "POST",
        { file_url: fileUrl || null, message }
      );
      toast.success(res.message);
      fetchJob();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit work");
    }
  };

  // ✅ Client Respond
  const handleRespond = async (action) => {
    try {
      const res = await apiClient(
        `http://localhost:8000/jobstatus/${job.id}/respond/`,
        "POST",
        { action }
      );
      toast.success(res.message);
      fetchJob();
    } catch (err) {
      toast.error("Failed to respond");
    }
  };

  // ✅ Leave Review
  const handleReviewSubmit = async () => {
    if (!rating) return toast.error("Please give a rating");
    try {
      const res = await apiClient(
        `http://localhost:8000/jobstatus/${job.id}/review/`,
        "POST",
        { rating, comment: reviewComment }
      );
      console.log('review stuff',res)
      toast.success("Review submitted!");
      setReviewed(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );

  if (!job)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Job not found</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Toaster position="top-right" />

      {/* Title + Type */}
      <h1 className="text-3xl font-bold mb-2">
        {job?.gig?.title || job?.job?.job?.title || job?.job?.title || job?.draft?.title}
      </h1>
      <p className="text-gray-600 mb-6">
        {job.is_gig ? "Gig" : job.is_job ? "Job" : "Draft"}
      </p>

      {/* Job Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="font-medium">💰 Price: ${job.price}</p>
        <p>
          📌 Status:{" "}
          <span
            className={`font-semibold ${job.status === "completed"
              ? "text-green-600"
              : job.status === "submitted"
                ? "text-yellow-600"
                : "text-indigo-600"
              }`}
          >
            {job.status}
          </span>
        </p>
        {job.group ? (
          <p>👥 Group: {job.group.name}</p>
        ) : (
          <p>👤 Individual</p>
        )}
      </div>

      {/* ✅ Review Section (only if completed & not already reviewed) */}
      {job.status === "completed" && !reviewed && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            placeholder="Write your review..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />

          <button
            onClick={handleReviewSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
