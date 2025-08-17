import React, { useEffect, useState } from 'react';
import { apiClient } from '../apiClient';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;
const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD;
const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
const GetDetails = () => {
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    fullname: '',
    skills: [],
    languages: [],
    currentLanguage: '',
    work_experience: [],
    description: '',
    experience: 0,
    portfolio_link: '',
    hourly_rate: '',
    company_name: '',
    company_website: '',
  });

  const [usernameAvailibility, setUsernameAvailibility] = useState(false)

  useEffect(() => {

    handleChange('role', localStorage.getItem('selected_role'))
  }, [])





  const [step, setStep] = useState(0);
  const [currentSkill, setCurrentSkill] = useState('');

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate()
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlenext = () => {
    if (step === 0 && formData.role === 'client') {
      setStep(3);
    }
    else setStep(prev => prev + 1);
  };

  const handleback = () => {
    if (step === 3 && formData.role === 'client') setStep(0);
    else setStep(prev => prev - 1);
  };

  const handleAddSkill = (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      const skill = currentSkill.trim();
      if (skill && !formData.skills.includes(skill)) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        setCurrentSkill('');
      }
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleCheckUsername = async (username) => {
    if (username.length === 10) {
      // const data = await apiClient('https://talentlink-nloa.onrender.com/check_username/', 'POST', { username });
      const data = await apiClient('http://localhost:8000/check_username/', 'POST', { username });
      setUsernameAvailibility(data.available);
    } else {
      setUsernameAvailibility(false);
    }
  };

  const handleFormmSubmit = async () => {
    let uploadedPhotoUrl = '';

    if (photoFile) {
      const formDataImg = new FormData();
      formDataImg.append("file", photoFile);
      formDataImg.append("upload_preset", preset);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
          method: "POST",
          body: formDataImg,
        });
        const data = await res.json();
        uploadedPhotoUrl = data.secure_url;
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }
    // if (photoFile) {
    //   const formDataImg = new FormData();
    //   formDataImg.append("image", photoFile); // Must be "image", not "file"

    //   try {
    //     const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
    //       method: "POST",
    //       body: formDataImg,
    //     });
    //     const data = await res.json();
    //     uploadedPhotoUrl = data.data?.url; // This is the direct image URL
    //   } catch (err) {
    //     console.error("Image upload failed:", err);
    //     return;
    //   }
    // }

    const finalData = { ...formData, profilepic: uploadedPhotoUrl };
    console.log(finalData)

    // const data = await apiClient('https://talentlink-nloa.onrender.com/create_profile/', 'POST', finalData );
    const data = await apiClient('http://localhost:8000/create_profile/', 'POST', finalData);
    console.log('backend', data)
    if (data.id) {
      navigate('/profile')
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 flex items-center bg-white mx-2 rounded-2xl w-full max-w-md shadow-lg">


        {/* Step 1: Basic Details */}
        {step === 0 && (
          <div className="flex flex-col gap-2 w-full">
            <div className="font-bold text-xl text-center">Enter your details</div>
            <div className="text-left my-4 space-y-2">
              <div>
                <div className="text-sm ml-1">Full name *</div>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border"
                  value={formData.fullname}
                  onChange={e => handleChange('fullname', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <div className="text-sm ml-1">Username * <span className='text-xs'> (Must be of length than 10)</span></div>
                <div className='w-full flex items-center rounded-xl border '>

                  <input
                    type="text"
                    className="w-full p-2.5 rounded-xl focus:outline-none  "
                    value={formData.username}
                    onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 10) {
                        handleChange('username', value);
                        if (value.length === 10) {
                          handleCheckUsername(value);
                        } else {
                          setUsernameAvailibility(false);
                        }
                      }
                    }}
                    placeholder="Enter username"
                  />
                  <div className='pr-2'>{usernameAvailibility ? <IoIosCheckmarkCircleOutline size={25} className='text-green-500' /> : <IoMdCloseCircleOutline size={25} className='text-red-500' />}</div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between gap-3">
              <button
                className="bg-blue-400 w-full hover:bg-blue-500 px-6 p-2 rounded-xl text-white"
                onClick={handlenext}
                disabled={
                  !formData.fullname ||
                  formData.username.length !== 10 ||
                  usernameAvailibility !== true
                }
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Freelancer Info */}
        {step === 1 && formData.role !== 'client' && (
          <div className="flex flex-col gap-2 w-full">
            <div className="font-bold text-xl text-center">Freelancer Info</div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, i) => (
                <div key={i} className="p-1 bg-blue-100 text-sm flex rounded-xl px-2">
                  <span>{skill}</span>
                  <span onClick={() => removeSkill(skill)} className="ml-2 cursor-pointer">×</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={currentSkill}
              onChange={e => setCurrentSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Enter skills (press comma/enter)"
            />
            {/* Languages Spoken */}
            <div className="text-sm ml-1 mt-3">Languages Spoken (comma/enter to add)</div>
            <div className="flex flex-wrap gap-2">
              {formData.languages?.map((lang, i) => (
                <div key={i} className="p-1 bg-green-100 text-sm flex rounded-xl px-2">
                  <span>{lang}</span>
                  <span onClick={() => handleChange('languages', formData.languages.filter(l => l !== lang))} className="ml-2 cursor-pointer">×</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={formData.currentLanguage || ''}
              onChange={e => handleChange('currentLanguage', e.target.value)}
              onKeyDown={e => {
                if ((e.key === ',' || e.key === 'Enter') && formData.currentLanguage?.trim()) {
                  const newLang = formData.currentLanguage.trim();
                  if (!formData.languages?.includes(newLang)) {
                    handleChange('languages', [...(formData.languages || []), newLang]);
                    handleChange('currentLanguage', '');
                  }
                  e.preventDefault();
                }
              }}
              placeholder="English, Spanish, etc."
            />

            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={formData.experience}
              onChange={e => handleChange('experience', e.target.value)}
              placeholder="Experience (e.g., 3 years)"
            />
            <div className="w-full flex justify-between gap-3">
              <button className="hover:underline text-blue-400" onClick={handleback}>Back</button>
              <button
                className="bg-blue-400 hover:bg-blue-500 px-6 p-2 rounded-xl text-white"
                onClick={handlenext}
                disabled={formData.skills.length === 0 || !formData.experience}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Portfolio & Rate */}
        {step === 2 && formData.role !== 'client' && (
          <div className="flex flex-col gap-2 w-full">
            <div className="font-bold text-xl text-center">Portfolio & Rate</div>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={formData.portfolio_link}
              onChange={e => handleChange('portfolio_link', e.target.value)}
              placeholder="Portfolio link (optional)"
            />
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={formData.hourly_rate}
              onChange={e => handleChange('hourly_rate', e.target.value)}
              placeholder="Hourly Rate (e.g., $30/hr)"
            />
            <div className="w-full flex justify-between gap-3">
              <button className="hover:underline text-blue-400" onClick={handleback}>Back</button>
              <button className="bg-blue-400 hover:bg-blue-500 px-6 p-2 rounded-xl text-white" onClick={handlenext}>Next</button>
            </div>
          </div>
        )}

        {/* Step 4: Company Info */}
        {step === 3 && (
          <div className="flex flex-col gap-2 w-full">
            <div className="font-bold text-xl text-center">Company Info</div>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={formData.company_name}
              onChange={e => handleChange('company_name', e.target.value)}
              placeholder="Company Name (optional)"
            />
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border"
              value={formData.company_website}
              onChange={e => handleChange('company_website', e.target.value)}
              placeholder="Company Website (optional)"
            />
            <div className="w-full flex justify-between gap-3">
              <button className="hover:underline text-blue-400" onClick={handleback}>Back</button>
              <button className="bg-blue-400 hover:bg-blue-500 px-6 p-2 rounded-xl text-white" onClick={handlenext}>Next</button>
            </div>
          </div>
        )}

        {/* Step 5: Final Step */}
        {step === 4 && (
          <div className="flex flex-col gap-2 w-full">
            <div className="font-bold text-xl text-center">Final Details</div>
            <textarea
              className="w-full p-2.5 rounded-xl border"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {/* Work Experience Section */}
            <div className="mt-4">
              <div className="text-sm mb-2 font-semibold">Work Experience (up to 3)</div>
              {(formData.work_experience || []).map((exp, i) => (
                <div key={i} className="border p-3 pt-12 rounded-xl mb-3 bg-gray-50 space-y-2 relative">
                  <input
                    className="w-full p-2 border rounded-xl"
                    placeholder="Company"
                    value={exp.company}
                    onChange={e => {
                      const updated = [...formData.work_experience];
                      updated[i].company = e.target.value;
                      handleChange('work_experience', updated);
                    }}
                  />
                  <input
                    className="w-full p-2 border rounded-xl"
                    placeholder="Position"
                    value={exp.position}
                    onChange={e => {
                      const updated = [...formData.work_experience];
                      updated[i].position = e.target.value;
                      handleChange('work_experience', updated);
                    }}
                  />
                  <input
                    className="w-full p-2 border rounded-xl"
                    placeholder="Duration (e.g., 2017 - 2019)"
                    value={exp.duration}
                    onChange={e => {
                      const updated = [...formData.work_experience];
                      updated[i].duration = e.target.value;
                      handleChange('work_experience', updated);
                    }}
                  />
                  <textarea
                    className="w-full p-2 border rounded-xl"
                    placeholder="Short description"
                    value={exp.description}
                    onChange={e => {
                      const updated = [...formData.work_experience];
                      updated[i].description = e.target.value;
                      handleChange('work_experience', updated);
                    }}
                  />
                  <button
                    className="text-white p-2 rounded-xl hover:cursor-pointer bg-red-600 text-sm absolute top-2 right-3"
                    onClick={() => {
                      const updated = [...formData.work_experience];
                      updated.splice(i, 1);
                      handleChange('work_experience', updated);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {formData.work_experience?.length < 3 && (
                <button
                  className="bg-blue-100 px-4 py-2 rounded-xl text-sm text-blue-600"
                  onClick={() => handleChange('work_experience', [...(formData.work_experience || []), { company: '', position: '', duration: '', description: '' }])}
                >
                  + Add Experience
                </button>
              )}
            </div>

            <div>
              <div className="text-sm mb-1">Upload Photo (optional)</div>
              <input
                type="file"
                className="w-full border p-2 rounded-xl"
                accept="image/*"
                onChange={handleFileChange}
              />
              {photoPreview && (
                <div className="mt-3">
                  <div className="text-sm mb-1">Preview:</div>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="rounded-xl w-32 h-32 object-cover border"
                  />
                </div>
              )}
            </div>
            <div className="w-full flex justify-between gap-3 mt-4">
              <button className="hover:underline text-blue-400" onClick={handleback}>Back</button>
              <button onClick={handleFormmSubmit} className="bg-green-600 hover:bg-green-700 px-6 p-2 rounded-xl text-white">
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetDetails;
