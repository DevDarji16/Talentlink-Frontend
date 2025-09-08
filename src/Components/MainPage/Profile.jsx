import { useContext, useEffect, useState } from "react"
import { apiClient } from "../../apiClient"
import { FaGlobe } from "react-icons/fa"
import { MdOutlineWork, MdOutlineAttachMoney, MdEdit } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"
import TagInput from "./TagInput"
import { Link } from "react-router-dom"
import { Theme, ThemeSet, UserData } from "../../App"
import ProfileGroups from "./ProfileGroups"
import ProfileClientApplications from "./ProfileClientApplications"
import ProfileFreelancerApplications from "./ProfileFreelancerApplications"
import ProfileOngoingJobs from "./ProfileOngoingJobs"
import DraftModal from "../DraftModal"
import ClientApprovals from "./ClientApprovals"
import CompletedJobs from "./CompletedJobs"
import SubmittedJobs from "./SubmittedJobs"
import MyReviews from "../MyReviews"

const Profile = () => {
  const theme=useContext(Theme)
  const setTheme=useContext(ThemeSet)
  const [activeTab, setActiveTab] = useState("details")
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editField, setEditField] = useState(null) 
  const [editValue, setEditValue] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [change, setChange] = useState(true)
  const FreelancersSub = ["details", "groups", "applieds"]
  const ClientsSub = ["details", "applieds"]
  const userData = useContext(UserData)
  const [experienceModal, setExperienceModal] = useState(false)
  const [experienceData, setExperienceData] = useState({ position: "", company: "", duration: "", description: "" })
  const [experienceIndex, setExperienceIndex] = useState(null) // null = new, number = edit
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)

  const handleEditClick = (fieldName, currentValue) => {
    setEditField(fieldName)
    setEditValue(Array.isArray(currentValue) ? currentValue : currentValue.split(",").map((item) => item.trim()))
    setShowModal(true)
  }

  const handleUpdateField = async () => {
    try {
      const res = await apiClient("/update_profile/", "PATCH", {
      // const res = await apiClient("http://localhost:8000/update_profile/", "PATCH", {
        [editField]: editValue,
      })

      setChange(!change)
      setShowModal(false)
    } catch (err) {
      console.error("Failed to update", err)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient("/get_profile/", "GET")
        // const data = await apiClient("http://localhost:8000/get_profile/", "GET")
        setProfile(data.userprofile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [change])

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neutral-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-neutral-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="w-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen">
        <p className="text-lg text-neutral-600">Failed to load profile data</p>
      </div>
    )
  }

  return (
    <div className="w-full  min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className=" backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden mb-8">
          <div className="px-6 sm:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="">
                <img
                  src={profile?.profilepic || "/placeholder.svg"}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                  alt={profile.fullname}
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left: Name, Role, Description */}
                  <div>
                    <div className="flex gap-2 items-center group">
                      <h2 className="text-2xl sm:text-3xl px-1 font-bold  capitalize">
                        {profile.fullname}
                      </h2>
                      <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                        <MdEdit
                          className="text-neutral-500 hover:text-neutral-700 mt-1 transition-colors"
                          size={22}
                          onClick={() => handleEditClick("fullname", profile.fullname)}
                        />
                      </div>
                    </div>
                    <h2 className="text-[15px] mt-1 hover:cursor-pointer transition-all hover:text-neutral-600 hover:underline px-1 text-neutral-500">
                      @{profile.username}
                    </h2>
                    <p className="text-base px-1 text-neutral-600 capitalize mt-1">
                      {profile.role === "freelancer" ? "Freelancer" : profile.role}
                    </p>
                    <div className="flex group items-center gap-2">
                      <p className=" px-1 mt-2 leading-relaxed">
                        {profile.description || "No description provided yet."}
                      </p>
                      <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                        <MdEdit
                          className="text-neutral-500 hover:text-neutral-700 mt-2.5 transition-colors"
                          size={20}
                          onClick={() => handleEditClick("description", profile.description)}
                        />
                      </div>
                    </div>

                    <div className="flex mt-3 flex-wrap gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-neutral-100 px-4 py-2 rounded-full border border-neutral-200">
                          <MdOutlineWork className="text-neutral-600 mr-2" />
                          <span className="text-sm font-medium text-neutral-700">
                            {profile.experience} {profile.experience === 1 ? "year" : "years"} experience
                          </span>
                        </div>
                        <div className="flex items-center bg-neutral-100 px-4 py-2 rounded-full border border-neutral-200">
                          <MdOutlineAttachMoney className="text-neutral-600 mr-2" />
                          <span className="text-sm font-medium text-neutral-700">${profile.hourly_rate}/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Buttons */}
                  <div className="flex flex-col flex-wrap sm:flex-row gap-2 sm:items-start sm:mt-0 mt-4">
                    {userData?.details?.role !== "client" ? (
                      <div className="flex flex-wrap gap-2">
                        <Link to={"/add_gig"}>
                          <button className="px-4 justify-center font-medium items-center flex gap-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm transition-all duration-200 hover:shadow-lg">
                            <IoMdAdd size={20} />
                            Add Gig
                          </button>
                        </Link>
                        <Link to={"/add_project"}>
                          <button className="px-4 justify-center font-medium items-center flex gap-1 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-sm transition-all duration-200 hover:shadow-lg">
                            <IoMdAdd size={20} />
                            Add Projects
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <Link to={"/add_job"}>
                          <button className="px-4 justify-center font-medium items-center flex gap-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm transition-all duration-200 hover:shadow-lg">
                            <IoMdAdd size={20} />
                            Add Job
                          </button>
                        </Link>
                      </div>
                    )}
                    {userData?.details?.role === "freelancer" && (
                      <button
                        onClick={() => setIsDraftModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-neutral-800 to-neutral-700 text-white rounded-xl hover:from-neutral-700 hover:to-neutral-600 transition-all duration-200 hover:shadow-lg"
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

        <div className="flex gap-1 sm:gap-6 border-b border-neutral-200 mb-6 overflow-x-auto pb-2">
          {userData?.details?.role === "client" ? (
            <div className="flex gap-1 sm:gap-6 min-w-max">
              {["details", "applieds", "ongoing", "approval", "completed", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-3 sm:px-0 font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab
                      ? "border-b-2 border-neutral-800 text-neutral-800"
                      : "text-neutral-600 hover:text-neutral-800"
                  }`}
                >
                  {tab === "applications" ? "Gigs Applications" : tab}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-1 sm:gap-6 min-w-max">
              {["details", "groups", "applieds", "ongoing", "submitted", "completed", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-3 sm:px-0 font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab
                      ? "border-b-2 border-neutral-800 "
                      : "text-neutral-400 hover:text-neutral-500"
                  }`}
                >
                  {tab === "applications" ? "Gigs Applications" : tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        {activeTab === "details" && (
          <div>
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - About & Skills */}
              <div className="lg:col-span-2 space-y-6">
                <section className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50 group">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 ">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full text-sm font-medium capitalize border border-neutral-200 hover:bg-neutral-200 transition-colors"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-neutral-500">No skills added yet.</p>
                        )}
                      </div>
                    </div>
                    <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                      <MdEdit
                        className="text-neutral-500 hover:text-neutral-700 mt-1 transition-colors"
                        size={22}
                        onClick={() => handleEditClick("skills", profile.skills)}
                      />
                    </div>
                  </div>
                </section>

                <section className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold ">Work Experience</h3>
                    <button
                      className="text-neutral-600 text-sm font-medium hover:text-neutral-800 hover:underline transition-colors"
                      onClick={() => {
                        setExperienceData({ position: "", company: "", duration: "", description: "" })
                        setExperienceIndex(null)
                        setExperienceModal(true)
                      }}
                    >
                      + Add Experience
                    </button>
                  </div>
                  <div className="space-y-6">
                    {profile.work_experience.map((work, index) => (
                      <div key={index} className="border-l-2 border-neutral-300 pl-4 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-neutral-600 rounded-full"></div>
                        <div className="ml-2">
                          <h4 className="font-medium text-neutral-900">{work.position}</h4>
                          <p className="text-sm text-neutral-500">
                            {work.company} • {work.duration}
                          </p>
                          <p className="mt-2 text-neutral-700">{work.description}</p>

                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              className="text-sm text-neutral-600 hover:text-neutral-800 hover:underline transition-colors"
                              onClick={() => {
                                setExperienceIndex(index)
                                setExperienceData(work)
                                setExperienceModal(true)
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors"
                              onClick={async () => {
                                const newExp = profile.work_experience.filter((_, i) => i !== index)
                                await apiClient("/update_profile/", "PATCH", {
                                // await apiClient("http://localhost:8000/update_profile/", "PATCH", {
                                  work_experience: newExp,
                                })
                                setChange((prev) => !prev)
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
                <div className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
                  <h3 className="text-xl font-semibold mb-4 ">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-neutral-500">Hourly Rate</p>
                        <MdEdit
                          className="text-neutral-500 cursor-pointer hover:text-neutral-700 transition-colors"
                          size={18}
                          onClick={() => handleEditClick("hourly_rate", profile.hourly_rate)}
                        />
                      </div>
                      <p className="font-medium">${profile.hourly_rate}/hour</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-neutral-500">Languages</p>
                        <MdEdit
                          className="text-neutral-500 cursor-pointer hover:text-neutral-700 transition-colors"
                          size={18}
                          onClick={() => handleEditClick("languages", profile.languages)}
                        />
                      </div>
                      <p className="font-medium">{profile.languages.join(" , ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {profile.portfolio_link && (
                  <div className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800">Portfolio</h3>
                    <a
                      href={profile.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-neutral-600 hover:text-neutral-800 hover:underline transition-colors"
                    >
                      <FaGlobe className="mr-2" />
                      View Portfolio Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <section className=" backdrop-blur-sm p-6 mt-6 rounded-2xl shadow-lg border border-neutral-200/50">
              <h3 className="text-xl font-semibold mb-4 ">Projects</h3>

              {profile.projects && profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-neutral-50 rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-200"
                    >
                      <div className="w-full h-48 bg-neutral-200 overflow-hidden flex items-center justify-center">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="object-contain max-h-48 w-full"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-bold  mb-1">{project.title}</h4>
                        <p className="text-sm  mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project?.skills?.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-neutral-200 text-neutral-700 rounded-full border border-neutral-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-neutral-600 hover:text-neutral-800 hover:underline transition-colors"
                              >
                                View Project →
                              </a>
                            )}
                          </div>
                          <Link to={`/edit_project/${index}`}>
                            <div className="px-3 py-1.5 rounded-xl bg-neutral-800 text-white text-sm hover:bg-neutral-700 transition-colors">
                              Edit
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">No projects added yet.</p>
              )}
            </section>
          </div>
        )}

        {activeTab === "groups" && <ProfileGroups />}

        {activeTab === "applieds" && (
          <div className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
            {userData?.details?.role === "client" ? <ProfileClientApplications /> : <ProfileFreelancerApplications />}
          </div>
        )}
        {activeTab === "approval" && (
          <div className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
            <ClientApprovals />
          </div>
        )}
        {activeTab === "submitted" && (
          <div className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
            <SubmittedJobs />
          </div>
        )}

        {activeTab === "completed" && (
          <div className=" backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-neutral-200/50">
            <CompletedJobs />
          </div>
        )}

        {activeTab === "ongoing" && <ProfileOngoingJobs role={userData?.details?.role} />}
        {activeTab === "reviews" && <MyReviews />}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-neutral-200 w-96 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2 capitalize text-neutral-800">Edit {editField}</h2>

            {editField === "skills" || editField === "languages" ? (
              <TagInput tags={editValue} setTags={setEditValue} />
            ) : editField === "description" ? (
              <textarea
                className="w-full h-32 border border-neutral-300 px-4 py-2 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="w-full border border-neutral-300 px-4 py-2 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-neutral-700 bg-neutral-200 rounded-xl hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateField}
                className="px-4 py-2 text-white bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {experienceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setExperienceModal(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-neutral-200 w-[420px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4 text-neutral-800">
              {experienceIndex !== null ? "Edit Experience" : "Add Experience"}
            </h2>

            {[
              { key: "position", placeholder: "Position (e.g. Manager, SDE,..)" },
              { key: "company", placeholder: "Company Name" },
              { key: "duration", placeholder: "Duration (e.g. 2025-Present)" },
              { key: "description", placeholder: "Description (e.g. your work at company in short)" },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                type="text"
                placeholder={placeholder}
                value={experienceData[key]}
                onChange={(e) => setExperienceData({ ...experienceData, [key]: e.target.value })}
                className="w-full mb-3 border border-neutral-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-300 transition-colors"
                onClick={() => setExperienceModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors"
                onClick={async () => {
                  const updated = [...(profile.work_experience || [])]
                  if (experienceIndex !== null) {
                    updated[experienceIndex] = experienceData
                  } else {
                    updated.push(experienceData)
                  }

                  await apiClient("/update_profile/", "PATCH", {
                  // await apiClient("http://localhost:8000/update_profile/", "PATCH", {
                    work_experience: updated,
                  })
                  setExperienceModal(false)
                  setChange(!change)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <DraftModal isOpen={isDraftModalOpen} onClose={() => setIsDraftModalOpen(false)} userData={userData} />
    </div>
  )
}

export default Profile
