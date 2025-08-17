import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../apiClient";
import { UserData } from "../../App";

const GroupDetailed = () => {
  const userdata = useContext(UserData);
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Invite modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmInvite, setConfirmInvite] = useState(null); // { user, groupName }

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await apiClient(`http://localhost:8000/group/${id}/`, "GET");
        setGroup(data);
      } catch (err) {
        console.error("Error fetching group:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await apiClient(`http://localhost:8000/search/?q=${value}`, "GET");
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!group) {
    return <div className="text-center mt-10">Group not found</div>;
  }

  const { name, description, price, skills, leader, members, created_at } = group;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between mt-4">
        <div>
          {/* Group Name */}
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
          <p className="text-gray-500 mb-6">
            Created on {new Date(created_at).toLocaleDateString()}
          </p>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{description}</p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Price</h2>
            <p>${price}</p>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {userdata?.details?.username === leader?.username && (
            <div>
              <button
                className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer px-4 p-2 rounded-lg text-white max-w-[100px] w-full"
                onClick={() => setIsModalOpen(true)}
              >
                + Invite
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leader */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Leader</h2>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <img
            src={leader.profilepic}
            alt={leader.username}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-bold">{leader.fullname}</p>
            <p className="text-gray-500">@{leader.username}</p>
            <p>{leader.description}</p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <img
                src={member.profilepic}
                alt={member.username}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-bold">{member.fullname}</p>
                <p className="text-gray-500">@{member.username}</p>
                <p>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10  px-10 flex justify-center items-center pt-20 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Invite Member</h2>
            <input
              type="text"
              placeholder="Search username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            />

            {searchLoading && <p>Searching...</p>}

            <ul className="max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilepic}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.fullname}</p>
                      <p className="text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <button className="bg-green-500 hover:cursor-pointer text-white px-3 py-1 rounded-lg hover:bg-green-600"
                    onClick={() =>
                      setConfirmInvite({ user, groupName: name }) // name is group name from state
                    }>
                    Invite
                  </button>
                </li>
              ))}
            </ul>

            {searchResults.length === 0 && searchQuery && !searchLoading && (
              <p className="text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      )}
      {confirmInvite && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to invite{" "}
              <span className="text-blue-600">@{confirmInvite.user.username}</span> to{" "}
              <span className="text-blue-600">{confirmInvite.groupName}</span>?
            </h2>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={async () => {
                  try {
                    await apiClient(
                      `http://localhost:8000/group/${id}/invite`, // id from useParams
                      "POST",
                      { receiver_id: confirmInvite.user.id }
                    );
                    
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setConfirmInvite(null);
                    setIsModalOpen(false); // close main search modal too
                  }
                }}
                className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmInvite(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailed;
