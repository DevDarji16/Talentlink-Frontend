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

  // submission
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(""); // cloudinary OR external link
  const [message, setMessage] = useState("");

  // reviews
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [myReview, setMyReview] = useState(null);

  const isClient = job && userData?.details?.id === job.client?.id;
  const isFreelancer = job && userData?.details?.id === job.freelancer?.id;

  const fetchJob = async () => {
    try {
      // const res = await apiClient(`http://localhost:8000/jobstatus/${id}/`, "GET");
      const res = await apiClient(`/jobstatus/${id}/`, "GET");
      setJob(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    try {
      const res = await apiClient(
        // `http://localhost:8000/reviews/job/${id}/mine/`,
        `/reviews/job/${id}/mine/`,
        "GET"
      );
      if (res && res.id) {
        setReviewed(true);
        setMyReview(res);
        setRating(res.rating);
        setReviewComment(res.comment || "");
      } else {
        setReviewed(false);
        setMyReview(null);
      }
    } catch {
      // no review yet
      setReviewed(false);
      setMyReview(null);
    }
  };

  useEffect(() => {
    fetchJob();
    fetchMyReview();
  }, [id]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    toast.success(`Selected: ${file.name}`);
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
        toast.success("File uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- Submit work (freelancer) ---
  const handleSubmitWork = async () => {
    if (!fileUrl && !message) {
      return toast.error("Please provide a message or a file/link");
    }
    try {
      const res = await apiClient(
        // `http://localhost:8000/job/${job.id}/submit/`,
        `/job/${job.id}/submit/`,
        "POST",
        { file_url: fileUrl || null, message }
      );
      toast.success(res.message || "Submitted!");
      await fetchJob();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit work");
    }
  };

  // --- Client respond (accept completes) ---
  const handleRespond = async (action) => {
    try {
      const res = await apiClient(
        // `http://localhost:8000/jobstatus/${job.id}/respond/`,
        `/jobstatus/${job.id}/respond/`,
        "POST",
        { action }
      );
      toast.success(res.message || "Updated");
      await fetchJob();
      if (action === "accept") {
        // after complete, check review status
        await fetchMyReview();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  // --- Leave review (both sides after completion) ---
  const handleReviewSubmit = async () => {
    if (!rating) return toast.error("Please give a rating");
    try {
      const res = await apiClient(
        // `http://localhost:8000/jobstatus/${job.id}/reviews/`,
        `/jobstatus/${job.id}/reviews/`,
        "POST",
        { rating, comment: reviewComment }
      );
      toast.success("Review submitted!");
      setReviewed(true);
      setMyReview(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  const title =
    job?.gig?.title ||
    job?.job?.job?.title ||
    job?.job?.title ||
    job?.draft?.title ||
    "Untitled";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{title}</h1>
          <p className="text-gray-600">
            {job.is_gig ? "Gig" : job.is_job ? "Job" : "Draft"}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full self-start ${
            job.status === "completed"
              ? "bg-green-100 text-green-700"
              : job.status === "submitted"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-indigo-100 text-indigo-700"
          }`}
        >
          {job.status}
        </span>
      </div>

      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-6 mt-4 mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Price</p>
            <p className="font-semibold">${job.price}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Mode</p>
            <p className="font-semibold">{job.group ? `Group: ${job.group.name}` : "Individual"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Created</p>
            <p className="font-semibold">
              {job.created_at
                ? new Date(job.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Client</h3>
          <div className="flex items-center gap-3">
            <img
              src={job.client.profilepic}
              alt={job.client.fullname}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{job.client.fullname}</p>
              <p className="text-sm text-gray-500">@{job.client.username}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Freelancer</h3>
          <div className="flex items-center gap-3">
            <img
              src={job.freelancer.profilepic}
              alt={job.freelancer.fullname}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{job.freelancer.fullname}</p>
              <p className="text-sm text-gray-500">@{job.freelancer.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Freelancer: Submit work (message and/or file/link) */}
      {job.status === "ongoing" && isFreelancer && (
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Submit Your Work</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Upload a file (optional)</label>
              <input type="file" onChange={handleFileSelect} className="mt-1 block w-full" />
              {selectedFile && (
                <button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Or paste a link (Drive, Dropbox)</label>
              <input
                type="url"
                placeholder="https://..."
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <label className="block text-sm text-gray-600 mt-4">Message (optional)</label>
          <textarea
            placeholder="Add a message... (File/Link optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <button
            onClick={handleSubmitWork}
            disabled={uploading}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Submit Work
          </button>

          {fileUrl && (
            <p className="mt-3 text-sm text-green-600">
              ✅ File/Link ready:{" "}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View
              </a>
            </p>
          )}
        </div>
      )}

      {/* Submission record (shows for submitted/completed) */}
      {(job.status === "submitted" || job.status === "completed") && (
        <div className="bg-white p-6 shadow rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {job.status === "completed" ? "✅ Final Submission" : "📤 Pending Review"}
          </h3>

          {job.submission_message && (
            <p className="mb-3 text-gray-700 whitespace-pre-wrap">{job.submission_message}</p>
          )}

          {job.submitted_file ? (
            <a
              href={job.submitted_file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
            >
              📎 View Submitted File/Link
            </a>
          ) : (
            <p className="text-gray-500 italic">No file/link attached</p>
          )}

          {job.status === "completed" && (
            <p className="mt-4 text-green-600 font-semibold">
              ✅ Client has accepted this submission. Job is completed!
            </p>
          )}
        </div>
      )}

      {/* Client actions: Accept / Request Changes (this completes on accept) */}
      {job.status === "submitted" && isClient && (
        <div className="bg-white p-6 shadow rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-3">Review Submission</h3>
          {job.submission_message && (
            <p className="mb-2 text-gray-700">{job.submission_message}</p>
          )}
          {job.submitted_file && (
            <a
              href={job.submitted_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline block mb-4"
            >
              📎 View Submitted File/Link
            </a>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => handleRespond("accept")}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              ✅ Accept & Complete
            </button>
            <button
              onClick={() => handleRespond("request_changes")}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              ❌ Request Changes
            </button>
          </div>
        </div>
      )}

      {/* Reviews (both sides) — only after completion */}
      {job.status === "completed" && (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>

          {reviewed && myReview ? (
            <div className="rounded border p-4 bg-gray-50">
              <p className="mb-2">
                <span className="font-semibold">Your rating:</span>{" "}
                {"★".repeat(myReview.rating)}
                {"☆".repeat(5 - myReview.rating)}
              </p>
              {myReview.comment && (
                <p className="text-gray-700">{myReview.comment}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">You’ve already reviewed this job.</p>
            </div>
          ) : (
            <>
              {/* Stars */}
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Write your review (optional)..."
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetail;
