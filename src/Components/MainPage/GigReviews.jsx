// components/GigReviews.jsx
import React, { useContext, useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import { Theme, ThemeSet } from "../../App";

const GigReviews = ({ gigId,reviews,setReviews }) => {
  const theme=useContext(Theme)
  const setTheme=useContext(ThemeSet)
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await apiClient(
          `http://localhost:8000/reviews/gig/${gigId}/`,
          "GET"
        );
        setReviews(res.reviews || []);
        console.log(res.reviews)
        setAvgRating(res.avg_rating || 0);
      } catch (err) {
        console.error("Error fetching gig reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [gigId]);

  if (loading) {
    return <p className="text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className={`mt-10  shadow rounded-lg p-6 `}>
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>

      {/* Average rating */}
      <div className="flex items-center mb-6">
        <span className="text-yellow-500 text-2xl mr-2">★</span>
        <span className="text-lg font-medium">{avgRating}/5</span>
        <span className="ml-2 text-gray-500">({reviews.length} reviews)</span>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet for this gig.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 flex items-start gap-4"
            >
              <img
                src={review.reviewer_pic}
                alt={review.reviewer_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{review.reviewer_name}</p>
                <div className="flex items-center text-yellow-400 mb-1">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigReviews;
