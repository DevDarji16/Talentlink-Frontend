import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';

const ProfileFreelancerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await apiClient(
          'http://localhost:8000/jobapplication/freelancer/pending/',
          'GET'
        );
        setApplications(res.applications || []);
        console.log(res);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading applications...</p>;
  }

  if (applications.length === 0) {
    return <p className="text-gray-500">You don’t have any pending applications.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Pending Applications</h2>

      {applications.map((app) => (
        <div 
          key={app.id} 
          className="border rounded-lg p-4 shadow-sm  space-y-2"
        >
          {/* Job Info */}
          <div>
            <p className="font-medium text-lg">{app.job.title}</p>
            <p className="text-sm ">{app.job.category}</p>
          </div>

          {/* Proposal */}
          <p className="">{app.proposal_text}</p>

          {/* Price & Timeline */}
          <div className="flex items-center justify-between text-sm ">
            <span>💰 {app.proposed_price}</span>
            <span>⏳ {app.expected_timeline}</span>
          </div>

          {/* Client Info */}
          <div className="flex items-center gap-2 text-sm ">
            <img 
              src={app.client.profilepic} 
              alt={app.client.username} 
              className="w-8 h-8 rounded-full"
            />
            <span>{app.client.fullname}</span>
          </div>

          {/* Status */}
          <p className="text-sm font-medium text-blue-600">Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileFreelancerApplications;
