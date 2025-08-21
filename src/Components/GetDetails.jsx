"use client"

import { useState } from "react"
import { apiClient } from "../apiClient"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { IoMdCloseCircleOutline } from "react-icons/io"
import { Link, useNavigate } from "react-router-dom"
import { Users, Briefcase } from "lucide-react"

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY
const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD
const preset = import.meta.env.VITE_CLOUDINARY_PRESET

const GetDetails = () => {
  const [formData, setFormData] = useState({
    role: "",
    username: "",
    fullname: "",
    skills: [],
    languages: [],
    currentLanguage: "",
    work_experience: [],
    description: "",
    experience: 0,
    portfolio_link: "",
    hourly_rate: "",
    company_name: "",
    company_website: "",
  })

  const [usernameAvailibility, setUsernameAvailibility] = useState(false)

  // useEffect(() => {
  //   handleChange('role', localStorage.getItem('selected_role'))
  // }, [])

  const [step, setStep] = useState(0)
  const [currentSkill, setCurrentSkill] = useState("")

  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handlenext = () => {
    if (step === 1 && formData.role === "client") {
      setStep(4)
    } else setStep((prev) => prev + 1)
  }

  const handleback = () => {
    if (step === 4 && formData.role === "client") setStep(1)
    else setStep((prev) => prev - 1)
  }

  const handleAddSkill = (e) => {
    if (e.key === "," || e.key === "Enter") {
      const skill = currentSkill.trim()
      if (skill && !formData.skills.includes(skill)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
        setCurrentSkill("")
      }
    }
  }

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleCheckUsername = async (username) => {
    if (username.length === 10) {
      // const data = await apiClient('https://talentlink-nloa.onrender.com/check_username/', 'POST', { username });
      const data = await apiClient("http://localhost:8000/check_username/", "POST", { username })
      setUsernameAvailibility(data.available)
    } else {
      setUsernameAvailibility(false)
    }
  }

  const handleFormmSubmit = async () => {
    let uploadedPhotoUrl = ""

    if (photoFile) {
      const formDataImg = new FormData()
      formDataImg.append("file", photoFile)
      formDataImg.append("upload_preset", preset)

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
          method: "POST",
          body: formDataImg,
        })
        const data = await res.json()
        uploadedPhotoUrl = data.secure_url
      } catch (err) {
        console.error("Image upload failed:", err)
        return
      }
    }

    const finalData = { ...formData, profilepic: uploadedPhotoUrl }
    console.log(finalData)

    // const data = await apiClient('https://talentlink-nloa.onrender.com/create_profile/', 'POST', finalData );
    const data = await apiClient("http://localhost:8000/create_profile/", "POST", finalData)
    console.log("backend", data)
    if (data.id) {
      navigate("/profile")
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 relative overflow-hidden transition-colors duration-300">
      <Link to={'/'}>
      <div className="absolute top-7 left-12 text-3xl font-myfont">talentlink</div></Link>
      {/* Background gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[50rem] h-[50rem] rounded-full blur-[120px] animate-pulse opacity-3 dark:opacity-5 bg-gradient-to-br from-cyan-400 to-violet-500" />
        <div
          className="absolute top-1/2 -right-40 w-[45rem] h-[45rem] rounded-full blur-[120px] animate-pulse opacity-3 dark:opacity-5 bg-gradient-to-tr from-fuchsia-400 to-blue-400"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="p-6 flex items-center bg-white/80 dark:bg-white/5 backdrop-blur-xl mx-2 rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200/50 dark:border-white/10">
        {step === 0 && (
          <div className="flex flex-col gap-6 w-full">
            <div className="font-bold text-2xl text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Choose Your Role
            </div>
            <p className="text-center text-neutral-600 dark:text-neutral-400 text-sm">
              Select how you want to use TalentLink
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleChange("role", "freelancer")}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  formData.role === "freelancer"
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 shadow-lg"
                    : "border-neutral-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-600 bg-white dark:bg-white/5"
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    formData.role === "freelancer"
                      ? "bg-cyan-500 text-white"
                      : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Independent</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    I want to offer my services and find work
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleChange("role", "client")}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  formData.role === "client"
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg"
                    : "border-neutral-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-600 bg-white dark:bg-white/5"
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    formData.role === "client"
                      ? "bg-violet-500 text-white"
                      : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Client</div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    I want to hire talent for my projects
                  </div>
                </div>
              </button>
            </div>

            <div className="w-full flex justify-center">
              <button
                className="bg-gradient-to-r from-cyan-500 to-violet-600 w-full hover:opacity-90 px-6 py-3 rounded-2xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlenext}
                disabled={!formData.role}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4 w-full">
            <div className="font-bold text-2xl text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Enter your details
            </div>
            <div className="text-left space-y-4">
              <div>
                <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Full name *</div>
                <input
                  type="text"
                  className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                  value={formData.fullname}
                  onChange={(e) => handleChange("fullname", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Username * <span className="text-xs text-neutral-500">(Must be of length 10)</span>
                </div>
                <div className="w-full flex items-center rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5">
                  <input
                    type="text"
                    className="w-full p-3 rounded-2xl focus:outline-none bg-transparent text-neutral-900 dark:text-neutral-100"
                    value={formData.username}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 10) {
                        handleChange("username", value)
                        if (value.length === 10) {
                          handleCheckUsername(value)
                        } else {
                          setUsernameAvailibility(false)
                        }
                      }
                    }}
                    placeholder="Enter username"
                  />
                  <div className="pr-3">
                    {usernameAvailibility ? (
                      <IoIosCheckmarkCircleOutline size={25} className="text-green-500" />
                    ) : (
                      <IoMdCloseCircleOutline size={25} className="text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between gap-3 mt-4">
              <button
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                onClick={handleback}
              >
                Back
              </button>
              <button
                className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 px-8 py-3 rounded-2xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlenext}
                disabled={!formData.fullname || formData.username.length !== 10 || usernameAvailibility !== true}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && formData.role !== "client" && (
          <div className="flex flex-col gap-4 w-full">
            <div className="font-bold text-2xl text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Freelancer Info
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Skills</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="p-2 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-sm flex rounded-xl px-3 border border-cyan-200 dark:border-cyan-500/30"
                  >
                    <span>{skill}</span>
                    <span
                      onClick={() => removeSkill(skill)}
                      className="ml-2 cursor-pointer hover:text-red-500 transition-colors duration-200"
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Enter skills (press comma/enter)"
              />
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Languages Spoken
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.languages?.map((lang, i) => (
                  <div
                    key={i}
                    className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm flex rounded-xl px-3 border border-emerald-200 dark:border-emerald-500/30"
                  >
                    <span>{lang}</span>
                    <span
                      onClick={() =>
                        handleChange(
                          "languages",
                          formData.languages.filter((l) => l !== lang),
                        )
                      }
                      className="ml-2 cursor-pointer hover:text-red-500 transition-colors duration-200"
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={formData.currentLanguage || ""}
                onChange={(e) => handleChange("currentLanguage", e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "," || e.key === "Enter") && formData.currentLanguage?.trim()) {
                    const newLang = formData.currentLanguage.trim()
                    if (!formData.languages?.includes(newLang)) {
                      handleChange("languages", [...(formData.languages || []), newLang])
                      handleChange("currentLanguage", "")
                    }
                    e.preventDefault()
                  }
                }}
                placeholder="English, Spanish, etc."
              />
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Experience</div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="Experience (e.g., 3 years)"
              />
            </div>

            <div className="w-full flex justify-between gap-3 mt-4">
              <button
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                onClick={handleback}
              >
                Back
              </button>
              <button
                className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 px-8 py-3 rounded-2xl text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlenext}
                disabled={formData.skills.length === 0 || !formData.experience}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && formData.role !== "client" && (
          <div className="flex flex-col gap-4 w-full">
            <div className="font-bold text-2xl text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Portfolio & Rate
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Portfolio Link</div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={formData.portfolio_link}
                onChange={(e) => handleChange("portfolio_link", e.target.value)}
                placeholder="Portfolio link (optional)"
              />
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Hourly Rate</div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={formData.hourly_rate}
                onChange={(e) => handleChange("hourly_rate", e.target.value)}
                placeholder="Hourly Rate (e.g., $30/hr)"
              />
            </div>

            <div className="w-full flex justify-between gap-3 mt-4">
              <button
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                onClick={handleback}
              >
                Back
              </button>
              <button
                className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 px-8 py-3 rounded-2xl text-white font-medium transition-all duration-200"
                onClick={handlenext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4 w-full">
            <div className="font-bold text-2xl text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Company Info
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Company Name</div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="Company Name (optional)"
              />
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Company Website
              </div>
              <input
                type="text"
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                value={formData.company_website}
                onChange={(e) => handleChange("company_website", e.target.value)}
                placeholder="Company Website (optional)"
              />
            </div>

            <div className="w-full flex justify-between gap-3 mt-4">
              <button
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                onClick={handleback}
              >
                Back
              </button>
              <button
                className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 px-8 py-3 rounded-2xl text-white font-medium transition-all duration-200"
                onClick={handlenext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-4 w-full max-h-[80vh] overflow-y-auto">
            <div className="font-bold text-2xl text-center bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Final Details
            </div>

            <div>
              <div className="text-sm ml-1 font-medium text-neutral-700 dark:text-neutral-300 mb-2">Description</div>
              <textarea
                className="w-full p-3 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 min-h-[100px]"
                placeholder="Tell us about yourself..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            {/* Work Experience Section */}
            <div>
              <div className="text-sm mb-3 font-semibold text-neutral-700 dark:text-neutral-300">
                Work Experience (up to 3)
              </div>
              {(formData.work_experience || []).map((exp, i) => (
                <div
                  key={i}
                  className="border border-neutral-200 dark:border-white/10 p-4 pt-12 rounded-2xl mb-4 bg-neutral-50 dark:bg-white/5 space-y-3 relative"
                >
                  <input
                    className="w-full p-3 border border-neutral-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...formData.work_experience]
                      updated[i].company = e.target.value
                      handleChange("work_experience", updated)
                    }}
                  />
                  <input
                    className="w-full p-3 border border-neutral-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    placeholder="Position"
                    value={exp.position}
                    onChange={(e) => {
                      const updated = [...formData.work_experience]
                      updated[i].position = e.target.value
                      handleChange("work_experience", updated)
                    }}
                  />
                  <input
                    className="w-full p-3 border border-neutral-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    placeholder="Duration (e.g., 2017 - 2019)"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...formData.work_experience]
                      updated[i].duration = e.target.value
                      handleChange("work_experience", updated)
                    }}
                  />
                  <textarea
                    className="w-full p-3 border border-neutral-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    placeholder="Short description"
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...formData.work_experience]
                      updated[i].description = e.target.value
                      handleChange("work_experience", updated)
                    }}
                  />
                  <button
                    className="text-white px-3 py-2 rounded-xl hover:cursor-pointer bg-red-500 hover:bg-red-600 text-sm absolute top-3 right-3 transition-colors duration-200"
                    onClick={() => {
                      const updated = [...formData.work_experience]
                      updated.splice(i, 1)
                      handleChange("work_experience", updated)
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {formData.work_experience?.length < 3 && (
                <button
                  className="bg-cyan-100 dark:bg-cyan-500/20 px-4 py-3 rounded-2xl text-sm text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition-colors duration-200"
                  onClick={() =>
                    handleChange("work_experience", [
                      ...(formData.work_experience || []),
                      { company: "", position: "", duration: "", description: "" },
                    ])
                  }
                >
                  + Add Experience
                </button>
              )}
            </div>

            <div>
              <div className="text-sm mb-2 font-medium text-neutral-700 dark:text-neutral-300">
                Upload Photo (optional)
              </div>
              <input
                type="file"
                className="w-full border border-neutral-200 dark:border-white/10 p-3 rounded-2xl bg-white dark:bg-white/5 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                accept="image/*"
                onChange={handleFileChange}
              />
              {photoPreview && (
                <div className="mt-4">
                  <div className="text-sm mb-2 font-medium text-neutral-700 dark:text-neutral-300">Preview:</div>
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="rounded-2xl w-32 h-32 object-cover border border-neutral-200 dark:border-white/10"
                  />
                </div>
              )}
            </div>

            <div className="w-full flex justify-between gap-3 mt-6">
              <button
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
                onClick={handleback}
              >
                Back
              </button>
              <button
                onClick={handleFormmSubmit}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90 px-8 py-3 rounded-2xl text-white font-medium transition-all duration-200"
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GetDetails
