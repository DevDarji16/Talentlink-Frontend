import React, { useEffect, useState, useContext } from 'react';
import { UserData } from '../../App';
import { useNavigate } from 'react-router-dom';
import TagInput from './TagInput';
import { apiClient } from '../../apiClient';

const CreateGroup = () => {
  const userData = useContext(UserData);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData?.details?.role !== 'freelancer') {
      navigate('/profile');
    }
  }, [userData, navigate]);

  const handleCreateGroup = async () => {
    if (!name || !description || !price) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);

      const groupData = {
        name,
        description,
        price,
        skills,
      };

      const data = await apiClient('http://localhost:8000/group/create/', 'POST', groupData);
      console.log(data)
      if(data.message==='success'){
        navigate(`/groups/${data.group.id}`)
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center font-bold text-3xl mt-3">Create a New Group</div>
      <div className="max-w-3xl mx-auto py-10 px-6">

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
          <TagInput tags={skills} setTags={setSkills} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={price}
            placeholder='Hourly Rate (e.g., $30/hr)'
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div
          onClick={handleCreateGroup}
          className={`w-full cursor-pointer rounded-xl flex justify-center p-2 font-bold text-white ${
            loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
