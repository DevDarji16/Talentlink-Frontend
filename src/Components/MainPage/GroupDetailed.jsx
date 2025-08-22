"use client"

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { apiClient } from "../../apiClient"
import { UserData } from "../../App"

const GroupDetailed = () => {
  const userdata = useContext(UserData)
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)

  // Invite modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [confirmInvite, setConfirmInvite] = useState(null) // { user, groupName }
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    skills: [],
  })

  // Inside GroupDetailed component

  // Open edit modal and fill current data
  const handleEditClick = () => {
    setEditData({
      name: group.name,
      description: group.description,
      price: group.price,
      skills: group.skills || [],
    })
    setIsEditModalOpen(true)
  }

  // Handle input changes
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const saveGroupEdits = async () => {
    try {
      await apiClient(`http://localhost:8000/group/${id}/update/`, "PATCH", editData)

      // Refetch updated group
      const updatedGroup = await apiClient(`http://localhost:8000/group/${id}/`, "GET")
      setGroup(updatedGroup)
    } catch (err) {
      console.error("Error updating group:", err)
    } finally {
      setIsEditModalOpen(false)
    }
  }

  // Member selected for removal
  const [memberToRemove, setMemberToRemove] = useState(null)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await apiClient(`http://localhost:8000/group/${id}/`, "GET")
        setGroup(data)
      } catch (err) {
        console.error("Error fetching group:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroup()
  }, [id])

  const handleSearch = async (value) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    try {
      const data = await apiClient(`http://localhost:8000/search/?q=${value}`, "GET")
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>
  }

  if (!group) {
    return <div className="text-center mt-10">Group not found</div>
  }

  const { name, description, price, skills, leader, members, created_at } = group

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between mt-4">
          <div className="flex-1">
            {/* Group Name */}
            <h1 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">{name}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Created on {new Date(created_at).toLocaleDateString()}
            </p>

            {/* Description */}
            <div className="mb-6 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Description</h2>
              <p className="text-neutral-700 dark:text-neutral-300">{description}</p>
            </div>

            {/* Price */}
            <div className="mb-6 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Price</h2>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${price}</p>
            </div>

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="mb-6 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium border border-neutral-200 dark:border-neutral-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userdata?.details?.username === leader?.username && (
              <div className="flex gap-3 mb-6">
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Invite Member
                </button>
                <button
                  className="bg-neutral-600 hover:bg-neutral-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
                  onClick={handleEditClick}
                >
                  Edit Group
                </button>
              </div>
            )}
          </div>
        </div>

        {userdata?.details?.username === leader?.username && members.length > 0 && (
          <button
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 mb-6"
            onClick={() => setIsManageModalOpen(true)}
          >
            Manage Members
          </button>
        )}

        {/* Leader */}
        <div className="mb-8 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Group Leader</h2>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
            <img
              src={leader?.profilepic || "/placeholder.svg"}
              alt={leader?.username}
              className="w-16 h-16 rounded-full object-cover border-2 border-neutral-300 dark:border-neutral-600"
            />
            <div>
              <p className="font-bold text-neutral-900 dark:text-neutral-100">{leader?.fullname}</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium">@{leader?.username}</p>
              <p className="text-neutral-600 dark:text-neutral-400">{leader?.description}</p>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Team Members</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
              >
                <img
                  src={member.profilepic || "/placeholder.svg"}
                  alt={member.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-neutral-300 dark:border-neutral-600"
                />
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">{member.fullname}</p>
                  <p className="text-neutral-600 dark:text-neutral-400">@{member.username}</p>
                  <p className="text-neutral-500 dark:text-neutral-500 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 px-10 flex justify-center items-center pt-20 z-50">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg relative border border-neutral-200 dark:border-neutral-700 shadow-2xl">
              <button
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xl"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Invite Member</h2>
              <input
                type="text"
                placeholder="Search username..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl mb-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />

              {searchLoading && <p className="text-neutral-600 dark:text-neutral-400">Searching...</p>}

              <ul className="max-h-64 overflow-y-auto">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilepic || "/placeholder.svg"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{user.fullname}</p>
                        <p className="text-neutral-500 dark:text-neutral-400">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                      onClick={() => setConfirmInvite({ user, groupName: name })}
                    >
                      Invite
                    </button>
                  </li>
                ))}
              </ul>

              {searchResults.length === 0 && searchQuery && !searchLoading && (
                <p className="text-neutral-500 dark:text-neutral-400">No users found.</p>
              )}
            </div>
          </div>
        )}

        {/* Manage Members Modal */}
        {isManageModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50 px-4">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-lg relative border border-neutral-200 dark:border-neutral-700 shadow-2xl">
              <button
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xl"
                onClick={() => setIsManageModalOpen(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Manage Members</h2>
              <ul className="max-h-64 overflow-y-auto">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.profilepic || "/placeholder.svg"}
                        alt={member.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{member.fullname}</p>
                        <p className="text-neutral-500 dark:text-neutral-400">@{member.username}</p>
                      </div>
                    </div>
                    {member.id !== leader.id && (
                      <button
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200"
                        onClick={() => setMemberToRemove(member)}
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Confirm Invite Modal */}
        {confirmInvite && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-neutral-200 dark:border-neutral-700 shadow-2xl">
              <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                Are you sure you want to invite{" "}
                <span className="text-blue-600 dark:text-blue-400">@{confirmInvite.user.username}</span> to{" "}
                <span className="text-neutral-700 dark:text-neutral-300">{confirmInvite.groupName}</span>?
              </h2>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={async () => {
                    try {
                      await apiClient(`http://localhost:8000/group/${id}/invite`, "POST", {
                        receiver_id: confirmInvite.user.id,
                      })
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setConfirmInvite(null)
                      setIsModalOpen(false)
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
                >
                  Yes, Invite
                </button>
                <button
                  onClick={() => setConfirmInvite(null)}
                  className="bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500 px-6 py-3 rounded-xl text-neutral-700 dark:text-neutral-200 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Member Modal */}
        {memberToRemove && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50 px-4">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-neutral-200 dark:border-neutral-700 shadow-2xl">
              <h2 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                Are you sure you want to remove{" "}
                <span className="text-red-600 dark:text-red-400">@{memberToRemove.username}</span> from{" "}
                <span className="text-neutral-700 dark:text-neutral-300">{name}</span>?
              </h2>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={async () => {
                    try {
                      const res = await apiClient(`http://localhost:8000/group/${id}/remove_member/`, "POST", {
                        member_id: memberToRemove.id,
                      })
                      console.log("remove", res)
                      setGroup((prev) => ({
                        ...prev,
                        members: prev.members.filter((m) => m.id !== memberToRemove.id),
                      }))
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setMemberToRemove(null)
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => setMemberToRemove(null)}
                  className="bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500 px-6 py-3 rounded-xl text-neutral-700 dark:text-neutral-200 font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Group Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50 px-4">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full border border-neutral-200 dark:border-neutral-700 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Edit Group</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={editData.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Description"
                  value={editData.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-24 resize-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editData.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  className="p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  value={editData.skills.join(", ")}
                  onChange={(e) =>
                    handleEditChange(
                      "skills",
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  className="p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500 px-6 py-3 rounded-xl text-neutral-700 dark:text-neutral-200 font-medium transition-all duration-200"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
                  onClick={saveGroupEdits}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetailed
