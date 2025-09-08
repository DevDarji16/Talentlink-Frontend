import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Theme, ThemeSet, UserData } from '../../App';
import { apiClient } from '../../apiClient';

const Jobs = () => {
  const userData = useContext(UserData);
  const theme=useContext(Theme)
  const setTheme=useContext(ThemeSet)
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiClient('/jobs/', 'GET');
        // const data = await apiClient('http://localhost:8000/jobs/', 'GET');
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold ">Available Jobs</h2>
        <div className="flex space-x-2">
          {userData?.details?.role === 'client' && (
            <Link to={'/add_job'}>
              <button className="px-4 justify-center font-bold items-center flex gap-1 py-2 bg-indigo-600 hover:cursor-pointer text-white rounded-lg text-sm hover:bg-indigo-700 transition">
                <IoMdAdd size={20} /> Post Job
              </button>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-opacity-50"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className=" border border-gray-400 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                      <h3 className="text-xl font-semibold  hover:text-indigo-600 transition">
                        {job.title}
                      </h3>
                    <p className="mt-1 text-sm text-indigo-600 capitalize">{job.category}</p>
                    <p className="mt-3 ">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold ">${job.budget}</span>
                    <span className="text-sm  mt-1">Fixed Price</span>
                    <span className="text-xs  mt-2">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={job.client.profilepic}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm  ml-2">Client: {job.client.username}</span>
                  </div>
                  <Link
                    to={`/job/${job.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className=" border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium ">No jobs available at the moment</h3>
          <p className=" mt-2">Check back later or post a job if you're a client</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;