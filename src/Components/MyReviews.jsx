import React, { useEffect, useState, useContext } from "react";
import { UserData } from "../App";
import { apiClient } from "../apiClient";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const MyReviews = () => {
  const userData = useContext(UserData);
  const userId = userData?.details?.id;
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      // const res = await apiClient(`http://localhost:8000/reviews/${userId}/`, "GET");
      const res = await apiClient(`https://talentlink-nloa.onrender.com/reviews/${userId}/`, "GET");
      setReviewsData(res);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchReviews();
  }, [userId]);

  const resolveJobTitle = (job) => {
    if (!job) return "Untitled";

    if (job.is_draft && job.draft) return job.draft.title;
    if (job.is_gig && job.gig) return job.gig.title;
    if (job.is_job && job.job) return job.job.title;

    return "Untitled";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <div className="p-6">
        <Toaster position="top-right" />
        <h2 className="text-2xl font-bold mb-4"> My Reviews</h2>
        <p className="text-gray-500">You have not received any reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl  p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4">⭐ My Reviews</h2>

      {/* Avg Rating */}
      <div className=" p-4 shadow rounded-lg mb-6">
        <p className="text-lg font-semibold">
          Average Rating:{" "}
          <span className="text-yellow-500 font-bold">
            {reviewsData.avg_rating} ★
          </span>
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewsData.reviews.map((review) => (
          <div
            key={review.id}
            className=" shadow p-5 rounded-lg border border-gray-100"
          >
            {/* Reviewer Info */}
            <div className="flex items-start gap-4">
              <img
                src={review.reviewer_pic}
                alt={review.reviewer_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{review.reviewer_name}</p>
                  <span className="text-yellow-500 font-bold">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                <p className=" mb-3">
                  {review.comment || "No comment"}
                </p>
              </div>
            </div>

            {/* Job / Draft / Gig Info */}
            {review.job && (
              <div className="mt-3  p-3 rounded-lg text-sm">
                <p>
                  <span className="font-semibold">Title:</span>{" "}
                  {resolveJobTitle(review.job)}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> $
                  {review.job.price}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`${
                      review.job.status === "completed"
                        ? "text-green-600"
                        : "text-indigo-600"
                    } font-medium`}
                  >
                    {review.job.status}
                  </span>
                </p>
                {review.job.submitted_file && (
                  <p>
                    <span className="font-semibold">File:</span>{" "}
                    <a
                      href={review.job.submitted_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View Submission
                    </a>
                  </p>
                )}

                <Link
                  to={`/jobstatus/${review.job.id}`}
                  className="inline-block mt-2 text-indigo-600 hover:underline"
                >
                  🔗 View Job Details
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;
