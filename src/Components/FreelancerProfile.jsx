import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../apiClient';
import { FaGlobe, FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { MdWork, MdAttachMoney, MdLocationOn } from 'react-icons/md';
import ReviewsSection from './MainPage/ReviewsSection';
import { Theme, ThemeSet } from '../App';

const FreelancerProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme=useContext(Theme)
  const setTheme=useContext(ThemeSet)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const data = await apiClient(`http://localhost:8000/freelancer/${username}/`, 'GET');
        const data = await apiClient(`/freelancer/${username}/`, 'GET');
        console.log(data)
        setProfile(data.userprofile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className={`${theme==='dark'?'bg-black':''} min-h-screen `}>
      {/* Profile Header */}
      <div className='flex justify-center'>
      <div className="border rounded-lg max-w-6xl w-full shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <img
                src={profile.profilepic}
                alt={profile.fullname}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold ">{profile.fullname}</h1>
                  <p className="text-gray-400 mt-1">@{profile.username}</p>
                </div>

                <div className="flex items-center space-x-4">
                  {profile.hourly_rate && (
                    <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                      <MdAttachMoney className="text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700">
                        ${profile.hourly_rate}/hr
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-4 ">{profile.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {profile.location && (
                  <div className="flex items-center text-gray-600">
                    <MdLocationOn className="mr-2" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.experience && (
                  <div className="flex items-center ">
                    <MdWork className="mr-2" />
                    <span>{profile.experience} {profile.experience > 1 ? 'years' : 'year'} experience</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mt-4">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-gray-500 hover:text-indigo-600 transition"
                    aria-label="Email"
                  >
                    <FaEnvelope className="text-xl" />
                  </a>
                )}
                {profile.portfolio_link && (
                  <a
                    href={profile.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-indigo-600 transition"
                    aria-label="Portfolio"
                  >
                    <FaGlobe className="text-xl" />
                  </a>
                )}
                {profile.github_link && (
                  <a
                    href={profile.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800 transition"
                    aria-label="GitHub"
                  >
                    <FaGithub className="text-xl" />
                  </a>
                )}
                {profile.linkedin_link && (
                  <a
                    href={profile.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-700 transition"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                )}
                {profile.twitter_link && (
                  <a
                    href={profile.twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-400 transition"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div></div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid  grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2  space-y-8">
            {/* Skills Section */}
            {profile.skills?.length > 0 && (
              <div className=" p-6 rounded-lg border border-gray-400 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 ">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {profile.work_experience?.length > 0 && (
              <div className="border border-gray-400 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 ">Work Experience</h2>
                <div className="space-y-6">
                  {profile.work_experience.map((exp, i) => (
                    <div key={i} className="border-l-2 border-indigo-200 pl-4 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                      <div className="ml-2">
                        <h4 className="font-medium ">{exp.position}</h4>
                        <p className="text-sm text-gray-500">
                          {exp.company} • {exp.duration}
                        </p>
                        <p className="mt-2 text-gray-700">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {profile.projects?.length > 0 && (
              <div className="border border-gray-400 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 ">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.projects.map((project, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold ">{project.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>

                        {project.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.skills.map((s, j) => (
                              <span
                                key={j}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 text-indigo-600 hover:underline text-sm font-medium"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Languages */}
            {profile.languages?.length > 0 && (
              <div className="border border-gray-400 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-3 ">Languages</h2>
                <div className=" flex flex-wrap gap-2">
                  {profile.languages.map((lang, i) => (

                    <span
                      key={i}
                      className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>
            <ReviewsSection  userId={profile.id} />
      </div>
    </div>
  );
};

export default FreelancerProfile;