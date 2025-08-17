import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../apiClient';
import { MdWork } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';
import { UserData } from '../../App';
import HireModal from '../HireModal';
// import EditGigModal from '../EditGigModal'; // create this

import toast, { Toaster } from "react-hot-toast";
import EditGigModal from '../EditGigModal';

const GigPage = () => {
  const userData = useContext(UserData);
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const handleHire = async (message) => {
    try {
      const res = await apiClient(
        `http://localhost:8000/gigs/${gig.id}/apply/`,
        "POST",
        { message }
      );
      if (res.data) {
        toast.success("Application submitted successfully!");
        setHasApplied(true);
      } else {
        toast.error("Application failed");
      }
    } catch (err) {
      console.error("Error applying:", err);
      toast.error("Failed to apply. Try again.");
    } finally {
      setIsHireModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);

        const data = await apiClient(`http://localhost:8000/gig/${id}`, "GET");
        console.log('og', data.gig)
        setGig(data.gig);

        // fetch application status
        if (userData?.details?.role === "client") {
          const statusRes = await apiClient(
            `http://localhost:8000/gigs/${id}/application-status/`,
            "GET"
          );
          setApplicationStatus(statusRes); // { applied: true/false, status, application_id }
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id, userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Gig not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Toaster position="top-right" />

      {/* Gig Images */}
      <div className="mb-8">
        <div className="flex overflow-x-auto gap-2 mb-2">
          {gig.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`flex-shrink-0 w-20 h-20 ${activeImage === index
                ? "ring-2 ring-indigo-500"
                : "opacity-70"
                }`}
            >
              <img
                src={image}
                alt={`Gig preview ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
        <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={gig.images[activeImage]}
            alt={gig.title}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Gig Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
          <p className="text-gray-600 mb-4">{gig.description}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About This Gig</h2>
            <p className="text-gray-700">{gig.freelancer.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {gig.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Freelancer Info */}
        <div className="border rounded-lg p-6 h-fit">
          <div className="flex items-center mb-4">
            <img
              src={gig.freelancer.profilepic}
              alt={gig.freelancer.fullname}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <Link
                to={`/freelancer/${gig.freelancer.username}`}
                className="text-lg font-semibold hover:underline"
              >
                {gig.freelancer.fullname}
              </Link>
              <p className="text-gray-600">@{gig.freelancer.username}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <MdWork className="text-gray-500 mr-2" />
              <span>{gig.freelancer.experience} years experience</span>
            </div>
            {gig.freelancer.portfolio_link && (
              <div className="flex items-center">
                <FaGlobe className="text-gray-500 mr-2" />
                <a
                  href={gig.freelancer.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Portfolio
                </a>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Price</span>
              <span className="text-xl font-bold">${gig.price}</span>
            </div>

            {userData?.details?.username === gig.freelancer.username ? (
              <div className="mt-4 space-y-2">
                {/* Edit Button */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  ✏️ Edit Gig
                </button>

                {gig.is_active ? (
                  // Disable Button
                  <button
                    onClick={async () => {
                      try {
                        await apiClient(
                          `http://localhost:8000/gigs/${gig.id}/disable/`,
                          "POST"
                        );
                        toast.success("Gig disabled successfully");
                        setGig({ ...gig, is_active: false });
                      } catch (err) {
                        console.error("Error disabling gig:", err);
                        toast.error("Failed to disable gig");
                      }
                    }}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    🚫 Disable Gig
                  </button>
                ) : (
                  // Enable Button
                  <button
                    onClick={async () => {
                      try {
                        await apiClient(
                          `http://localhost:8000/gigs/${gig.id}/enable/`,
                          "POST"
                        );
                        toast.success("Gig enabled successfully");
                        setGig({ ...gig, is_active: true });
                      } catch (err) {
                        console.error("Error enabling gig:", err);
                        toast.error("Failed to enable gig");
                      }
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    ✅ Enable Gig
                  </button>
                )}
              </div>
            ) : (
              <div>
                {gig.is_active ? (
                  <>
                    {userData?.details?.role === "client" && (
                      applicationStatus?.applied ? (
                        <div className="w-full mb-1 text-center py-2 rounded-lg bg-green-100 text-green-600 font-semibold">
                          Application Sent ✅
                        </div>
                      ) : (
                        <button
                          className="w-full mb-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                          onClick={() => setIsHireModalOpen(true)}
                        >
                          Hire
                        </button>
                      )
                    )}
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                      Message
                    </button>
                  </>
                ) : (
                  <div className="w-full mb-1 text-center py-2 rounded-lg bg-red-100 text-red-600 font-semibold">
                    ❌ This gig is no longer available
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <HireModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onSubmit={handleHire}
        userData={userData}
        gig={gig}
      />
      <EditGigModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        gig={gig}

        setGig={setGig}
      />
    </div>
  );
};

export default GigPage;
