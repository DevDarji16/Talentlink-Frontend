import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../apiClient";

const ProfileGroups = () => {
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const my = await apiClient("http://localhost:8000/group/my_groups/", "GET");
        const joined = await apiClient("http://localhost:8000/group/joined_groups/", "GET");

        setMyGroups(my.groups || []);
        setJoinedGroups(joined.groups || []);
      } catch (err) {
        console.error("Failed to load groups", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading groups...</p>
      </div>
    );
  }

  if (!myGroups.length && !joinedGroups.length) {
    return (
      <div className="p-6">
        <p className="text-gray-500">You are not part of any groups yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* My Groups */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Groups You Created</h3>
        {myGroups.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition"
              >
                <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{group.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven’t created any groups yet.</p>
        )}
      </div>

      {/* Joined Groups */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Groups You Joined</h3>
        {joinedGroups.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition"
              >
                <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{group.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven’t joined any groups yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileGroups;
