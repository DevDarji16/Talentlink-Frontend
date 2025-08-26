import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../apiClient';
import axios from 'axios';
import TagInput from './TagInput';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [skills, setSkills] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const imgbbAPIKey = '6acd75fd8da87694a92f14cbea945b4d';

  useEffect(() => {
    const getProject = async () => {
      const data = await apiClient('https://talentlink-nloa.onrender.com/get_profile/', 'GET');
      // const data = await apiClient('http://localhost:8000/get_profile/', 'GET');
      const p = data.userprofile.projects[parseInt(id)];
      setProject(p);
      setTitle(p.title);
      setDescription(p.description);
      setProjectLink(p.link || '');
      setSkills(p.skills || []);
      setImagePreview(p.image);
    };
    getProject();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = project.image;
      if (newImageFile) {
        const formData = new FormData();
        formData.append('image', newImageFile);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
        imageUrl = res.data.data.url;
      }

      const updatedProject = {
        title,
        description,
        link: projectLink,
        image: imageUrl,
        skills
      };

      // const data = await apiClient('http://localhost:8000/edit_project/', 'PATCH', {
      const data = await apiClient('https://talentlink-nloa.onrender.com/edit_project/', 'PATCH', {
        index: parseInt(id),
        project: updatedProject
      });

      alert('Project updated!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };


  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      // await apiClient('http://localhost:8000/delete_project/', 'DELETE', {
      await apiClient('https://talentlink-nloa.onrender.com/delete_project/', 'DELETE', {
        index: parseInt(id)
      });
      alert("Deleted successfully");
      navigate('/profile');
    }
  };

  if (!project) return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Project</h1>

      {/* Image Preview */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
        <div className="w-full max-h-[400px] bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-[400px] w-auto object-contain"
          />
        </div>
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

      {/* Skills */}
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

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          disabled={uploading}
          onClick={handleSaveChanges}
          className={`bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {uploading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
};

export default EditProject;
