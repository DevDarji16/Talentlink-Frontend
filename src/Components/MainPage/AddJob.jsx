import React, { useState } from 'react';
import TagInput from './TagInput'; // Reuse your TagInput component
import { apiClient } from '../../apiClient';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddJob = async () => {
    if (!title || !description || !category) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const jobData = {
        title,
        description,
        category,
        tags,
        budget,
      };

      // const data = await apiClient('http://localhost:8000/jobs/', 'POST', jobData);
      const data = await apiClient('/jobs/', 'POST', jobData);

      if (data.id) {
        navigate('/profile');
        setTitle('');
        setDescription('');
        setTags([]);
        setBudget('');
        setCategory('');
      } else {
        alert('Failed to add job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center font-bold text-3xl mt-3">Post a New Job</div>
      <div className="max-w-3xl mx-auto py-10 px-6">

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
            className="w-full h-32 border border-gray-300 rounded-md px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Writing">Writing</option>
            <option value="Business Consulting">Business Consulting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div
          onClick={handleAddJob}
          className={`w-full cursor-pointer rounded-xl flex justify-center p-2 font-bold text-white ${
            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </div>
      </div>
    </div>
  );
};

export default AddJob;
