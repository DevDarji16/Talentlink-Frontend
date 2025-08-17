import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdWork, MdAttachMoney, MdEmail } from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';
import { apiClient } from '../../apiClient';
import { UserData } from '../../App';

const JobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
const userData = useContext(UserData)
 useEffect(() => {
  const fetchJob = async () => {
    try {
      setLoading(true); // Start loading
      const data = await apiClient(`http://localhost:8000/job/${id}`, 'GET');
      setJob(data.job); // Assuming the response has a 'gig' property
      console.log('get', data);
    } catch (error) {
      console.error('Error fetching gig:', error);
      // You might want to set some error state here
    } finally {
      setLoading(false); // Stop loading whether successful or not
    }
  };

  fetchJob();
}, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      // Add your apply logic here
      console.log('Applying to job:', job.id);
      // Example: await apiClient(`/jobs/${id}/apply/`, 'POST');
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setApplying(false);
    }
  };

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
        {/* Main Job Content */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-8">
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
          </div>
        </div>

        {/* Client Info and Action Panel */}
        <div className="border rounded-lg p-6 h-fit">
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

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Budget</span>
              <span className="text-xl font-bold">${job.budget}</span>
            </div>
            {userData?.details?.role === 'client'?'':<button 
              onClick={handleApply}
              disabled={applying}
              className={`w-full py-2 text-white rounded-lg transition ${applying 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;