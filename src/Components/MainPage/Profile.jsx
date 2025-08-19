import React, { useContext, useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { FaGlobe } from 'react-icons/fa';
import { MdOutlineWork, MdOutlineAttachMoney, MdEdit } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import TagInput from './TagInput';
import { Link } from 'react-router-dom';
import { UserData } from '../../App';
import ProfileGroups from './ProfileGroups';
import ProfileClientApplications from './ProfileClientApplications';
import ProfileFreelancerApplications from './ProfileFreelancerApplications';
import ProfileOngoingJobs from './ProfileOngoingJobs';
import DraftModal from '../DraftModal';
import ClientApprovals from './ClientApprovals';
import CompletedJobs from './CompletedJobs';
import SubmittedJobs from './SubmittedJobs';
const Profile = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null); // 'fullname' or 'description'
  const [editValue, setEditValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [change, setChange] = useState(true)
  let FreelancersSub = ["details", "groups", "applieds"]
  let ClientsSub = ["details", "applieds"]
  const userData = useContext(UserData)
  const [experienceModal, setExperienceModal] = useState(false);
  const [experienceData, setExperienceData] = useState({ position: '', company: '', duration: '', description: '' });
  const [experienceIndex, setExperienceIndex] = useState(null); // null = new, number = edit
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Open modal for editing
  const handleEditClick = (fieldName, currentValue) => {
    setEditField(fieldName);
    setEditValue(Array.isArray(currentValue) ? currentValue : currentValue.split(',').map(item => item.trim()));
    setShowModal(true);
  };


  // Call backend to update
  const handleUpdateField = async () => {
    try {
      const res = await apiClient('http://localhost:8000/update_profile/', 'PATCH', {
        [editField]: editValue
      });

      setChange(!change)
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update", err);
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient('http://localhost:8000/get_profile/', 'GET');
        setProfile(data.userprofile);
        console.log('user profile ', data.userprofile)
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [change]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full flex items-center justify-center bg-gray-50 min-h-screen">
        <p className="text-lg text-gray-600">Failed to load profile data</p>
      </div>
    );
  }



  return (
    <div className="w-full bg-gray-50 text-gray-900 min-h-screen">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="">
                <img
                  src={profile?.profilepic}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  alt={profile.fullname}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left: Name, Role, Description */}
                  <div>
                    <div className='flex gap-2 items-center group'>

                      <h2 className="text-3xl px-1 font-bold text-gray-900 capitalize">{profile.fullname}</h2>
                      <div className='sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer'>
                        <MdEdit
                          className='text-gray-500 mt-1'
                          size={22}
                          onClick={() => handleEditClick('fullname', profile.fullname)}
                        />
                      </div>

                    </div>
                    <h2 className="text-[15px] mt-1 hover:cursor-pointer transition-all hover:text-blue-400 hover:underline px-1 text-gray-600 ">@{profile.username}</h2>
                    <p className="text-base px-1 text-gray-600 capitalize mt-1">
                      {profile.role === 'freelancer' ? 'Freelancer' : profile.role}
                    </p>
                    <div className='flex group items-center gap-2'>

                      <p className="text-gray-700 px-1 mt-2 leading-relaxed">
                        {profile.description || 'No description provided yet.'}
                      </p>
                      <div className='sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer'>
                        <MdEdit
                          className='text-gray-500 mt-2.5'
                          size={20}
                          onClick={() => handleEditClick('description', profile.description)}
                        />
                      </div>
                    </div>

                    <div className='flex mt-2 flex-wrap'>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                          <MdOutlineWork className="text-indigo-600 mr-2" />
                          <span className="text-sm font-medium text-indigo-700">
                            {profile.experience} {profile.experience === 1 ? 'year' : 'years'} experience
                          </span>
                        </div>
                        <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                          <MdOutlineAttachMoney className="text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-700">
                            ${profile.hourly_rate}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Buttons */}
                  <div className="flex flex-col flex-wrap sm:flex-row gap-2 sm:items-start sm:mt-0 mt-4">
                    {
                      userData?.details?.role !== 'client' ?
                        <div className='flex gap-2'>

                          <Link to={'/add_gig'} >   <button className="px-4 justify-center font-bold items-center flex gap-1 py-2 bg-blue-200 hover:cursor-pointer text-blue-800 rounded-lg text-sm hover:bg-blue-300 transition">
                            <IoMdAdd size={20} />Add Gig
                          </button></Link>
                          <Link to={'/add_project'} >   <button className="px-4 justify-center font-bold items-center flex gap-1 py-2 bg-gray-200 hover:cursor-pointer text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition">
                            <IoMdAdd size={20} />Add Projects
                          </button></Link>
                        </div>
                        : <div>
                          <Link to={'/add_job'} >   <button className="px-4 justify-center font-bold items-center flex gap-1 py-2 bg-blue-200 hover:cursor-pointer text-blue-800 rounded-lg text-sm hover:bg-blue-300 transition">
                            <IoMdAdd size={20} />Add Job
                          </button></Link>
                        </div>


                    }
                    {userData?.details?.role === "freelancer" && (
                      <button
                        onClick={() => setIsDraftModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        + Create Draft
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="flex gap-6 border-b mb-6">
          {
            userData?.details?.role === 'client' ?
              <div className="flex gap-6 border-b mb-6">

                {["details", "applieds", , "ongoing",'approval','completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-semibold capitalize ${activeTab === tab
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                      }`}
                  >
                    {tab === "applications" ? "Gigs Applications" : tab}
                  </button>
                ))}
              </div>
              :
              <div className="flex gap-6 border-b mb-6">

                {["details", "groups", "applieds", "ongoing",'submitted','completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-semibold capitalize ${activeTab === tab
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                      }`}
                  >
                    {tab === "applications" ? "Gigs Applications" : tab}
                  </button>
                ))}
              </div>
          }

        </div>

        {/* Sections */}
        {activeTab === "details" && (
          <div>
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - About & Skills */}
              <div className="lg:col-span-2 space-y-6">



                {/* Skills Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm group">
                  <div className='flex justify-between'>

                    <div>

                      <h3 className="text-xl font-semibold mb-4 text-gray-800">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium capitalize"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills added yet.</p>
                        )}
                      </div>
                    </div>
                    <div className='sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer'>
                      <MdEdit
                        className='text-gray-500 mt-1'
                        size={22}
                        onClick={() => handleEditClick('skills', profile.skills)}
                      />
                    </div>
                  </div>
                </section>

                {/* Experience Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
                    <button
                      className="text-indigo-600 text-sm font-medium hover:underline"
                      onClick={() => {
                        setExperienceData({ position: '', company: '', duration: '', description: '' });
                        setExperienceIndex(null);
                        setExperienceModal(true);
                      }}
                    >
                      + Add Experience
                    </button>
                  </div>
                  <div className="space-y-6">
                    {profile.work_experience.map((work, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-4 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                        <div className="ml-2">
                          <h4 className="font-medium text-gray-900">{work.position}</h4>
                          <p className="text-sm text-gray-500">{work.company} • {work.duration}</p>
                          <p className="mt-2 text-gray-700">{work.description}</p>

                          {/* 👇 Insert this block here */}
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              className="text-sm text-blue-600 hover:underline"
                              onClick={() => {
                                setExperienceIndex(index);
                                setExperienceData(work);
                                setExperienceModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm text-red-600 hover:underline"
                              onClick={async () => {
                                const newExp = profile.work_experience.filter((_, i) => i !== index);
                                await apiClient('http://localhost:8000/update_profile/', 'PATCH', {
                                  work_experience: newExp
                                });
                                setChange((prev) => !prev);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}



                  </div>
                </section>
              </div>

              {/* Right Column - Details & Jobs */}
              <div className="space-y-6">
                {/* Quick Details Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                        <MdEdit
                          className="text-gray-500 cursor-pointer hover:text-indigo-600"
                          size={18}
                          onClick={() => handleEditClick('hourly_rate', profile.hourly_rate)}
                        />
                      </div>
                      <p className="font-medium">${profile.hourly_rate}/hour</p>
                    </div>


                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Languages</p>
                        <MdEdit
                          className="text-gray-500 cursor-pointer hover:text-indigo-600"
                          size={18}
                          onClick={() => handleEditClick('languages', profile.languages)}
                        />
                      </div>
                      <p className="font-medium">
                        {profile.languages.join(' , ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Portfolio Links */}
                {profile.portfolio_link && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Portfolio</h3>
                    <a
                      href={profile.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:underline"
                    >
                      <FaGlobe className="mr-2" />
                      View Portfolio Website
                    </a>
                  </div>
                )}


              </div>
            </div>



            {/* Projects Section */}
            <section className="bg-white p-6 mt-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Projects</h3>

              {profile.projects && profile.projects.length > 0 ? (
                <div className="flex flex-wrap  gap-6">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg w-92 shadow-sm overflow-hidden">
                      <div className="w-full h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="object-contain max-h-48 w-full"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project?.skills?.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className='flex justify-between'>
                          <div>

                            {project.link && (

                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:underline"
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                          <Link to={`/edit_project/${index}`}>
                            <div className='p-1.5 rounded-full bg-blue-400'>Edit project</div></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No projects added yet.</p>
              )}
            </section>
          </div>
        )}

        {activeTab === "groups" && (
          <ProfileGroups />
        )}




        {activeTab === "applieds" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            {userData?.details?.role === 'client' ?
              <ProfileClientApplications />
              :
              <ProfileFreelancerApplications />}
          </div>
        )}
        {activeTab === "approval" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
              <ClientApprovals />
              
          </div>
        )}
        {activeTab === "submitted" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
              <SubmittedJobs />
              
          </div>
        )}
        
        {activeTab === "completed" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
              <CompletedJobs />
              
          </div>
        )}

        {activeTab === "ongoing" && (
          <ProfileOngoingJobs role={userData?.details?.role} />
        )}






      </div>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setShowModal(false)} // Click anywhere outside to close
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking *inside* modal
          >
            <h2 className="text-lg font-bold mb-2 capitalize">Edit {editField}</h2>

            {
              (editField === 'skills' || editField === 'languages') ? (
                <TagInput
                  tags={editValue}
                  setTags={setEditValue}
                />
              )
                :
                editField === 'description' ? (
                  <textarea
                    className="w-full h-32 border border-gray-300 px-4 py-2 rounded-md mb-4"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateField}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {experienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50" onClick={() => setExperienceModal(false)}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-[420px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{experienceIndex !== null ? 'Edit Experience' : 'Add Experience'}</h2>

            {[
              { key: 'position', placeholder: 'Position (e.g. Manager, SDE,..)' },
              { key: 'company', placeholder: 'Company Name' },
              { key: 'duration', placeholder: 'Duration (e.g. 2025-Present)' },
              { key: 'description', placeholder: 'Description (e.g. your work at company in short)' }
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                type="text"
                placeholder={placeholder}
                value={experienceData[key]}
                onChange={(e) => setExperienceData({ ...experienceData, [key]: e.target.value })}
                className="w-full mb-3 border border-gray-300 px-3 py-2 rounded-md"
              />
            ))}


            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md" onClick={() => setExperienceModal(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={async () => {
                  const updated = [...(profile.work_experience || [])];
                  if (experienceIndex !== null) {
                    updated[experienceIndex] = experienceData;
                  } else {
                    updated.push(experienceData);
                  }

                  await apiClient('http://localhost:8000/update_profile/', 'PATCH', {
                    work_experience: updated
                  });
                  setExperienceModal(false);
                  setChange(!change);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <DraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        userData={userData}
      />

    </div>
  );
};

export default Profile;