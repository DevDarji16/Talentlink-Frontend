// AddProject.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { apiClient } from '../../apiClient';
import TagInput from './TagInput'
import { useNavigate } from 'react-router-dom';
const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectLink, setProjectLink] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [skill, setSkill] = useState('');
    const [skills, setSkills] = useState([]);
    const navigate = useNavigate();


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !imageFile) {
            alert("Title, description, and image are required.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('image', imageFile);

            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
            const imageUrl = res.data.data.url;

            // const data = await apiClient('http://localhost:8000/add_project/', 'POST', {
            const data = await apiClient('https://talentlink-nloa.onrender.com/add_project/', 'POST', {
                title,
                description,
                link: projectLink,
                image: imageUrl,
                skills: skills
            })
            console.log('added project', data)
            setTitle('');
            setDescription('');
            setProjectLink('');
            setSkills([]);
            setImageFile(null);
            setImagePreview('');

            // ✅ Redirect to profile
            navigate('/profile');

        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Add a New Project</h1>

            {/* Image Upload Preview */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                {imagePreview ? (
                    <div className="w-full max-h-[400px] bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-[400px] w-auto object-contain"
                        />
                    </div>
                ) : (
                    <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">
                        No image selected
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleImageChange}
                />
            </div>

            {/* Title */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <TagInput tags={skills} setTags={setSkills} />

            </div>
            {/* Project Link */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Link (optional)</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                />
            </div>

            {/* Submit Button */}
            <button
                disabled={uploading}
                onClick={handleSubmit}
                className={`bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {uploading ? 'Uploading...' : 'Add Project'}
            </button>
        </div>
    );
};

export default AddProject;
