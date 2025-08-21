import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';

const ReviewsSection = ({ userId }) => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await apiClient(`http://localhost:8000/reviews/${userId}/`, "GET");
        setReviewsData(res);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchReviews();
  }, [userId]);

  if (loading) return <p className="text-gray-500">Loading reviews...</p>;

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <div className=" w-full p-8 mt-10 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">⭐ Reviews</h2>
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className=" w-full p-6  mt-10 shadow-md rounded-lg">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-6 ">⭐ Reviews</h2>

      {/* Avg Rating */}
      <div className="mb-6">
        <p className="text-lg font-semibold">
          Average Rating:{" "}
          <span className="text-yellow-500 font-bold">{reviewsData.avg_rating} ★</span>
        </p>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviewsData.reviews.map((rev) => (
          <div
            key={rev.id}
            className="border-b pb-6 last:border-0 last:pb-0"
          >
            <div className="flex gap-4 items-start">
              <img
                src={rev.reviewer_pic}
                alt={rev.reviewer_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <p className="font-semibold ">{rev.reviewer_name}</p>
                  <span className="text-yellow-500 text-sm font-medium">
                    {"★".repeat(rev.rating)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - rev.rating)}
                    </span>
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(rev.created_at).toLocaleDateString()}
                </p>

                {/* Comment */}
                <p className="mt-3 ">{rev.comment || "No comment provided"}</p>

                {/* Job Info */}
                {rev.job && (
                  <div className="mt-4  rounded-lg text-sm">
                    <p>
                      <span className="font-semibold">Work:</span>{" "}
                      {rev.job.is_draft && rev.job.draft ? rev.job.draft.title :
                       rev.job.is_gig && rev.job.gig ? rev.job.gig.title :
                       rev.job.is_job && rev.job.job ? rev.job.job.title :
                       "Untitled"}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> ${rev.job.price}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
