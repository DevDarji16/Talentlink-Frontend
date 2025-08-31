import React, { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import { Link } from "react-router-dom";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await apiClient("/groups/", "GET");
        // const data = await apiClient("http://localhost:8000/groups/", "GET");
        setGroups(data.groups || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading groups...</div>;
  }

  if (!groups.length) {
    return <div className="text-center mt-10">No groups found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Groups</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg shadow-sm p-4 flex flex-col"
          >
            {/* Group Name */}
            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
            <p className="text-gray-500 mb-4 line-clamp-2">
              {group.description}
            </p>

            {/* Leader Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={group.leader.profilepic}
                alt={group.leader.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{group.leader.fullname}</p>
                <p className="text-sm text-gray-500">
                  @{group.leader.username}
                </p>
              </div>
            </div>

            {/* Skills */}
            {group.skills && group.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {group.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <p className="mb-4 font-semibold">💰 ${group.price}</p>

            {/* View Details Button */}
            <Link
              to={`/groups/${group.id}`}
              className="mt-auto inline-block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
