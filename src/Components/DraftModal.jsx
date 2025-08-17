import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "../apiClient";

const DraftModal = ({ isOpen, onClose, userData }) => {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [groupId, setGroupId] = useState("individual");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  if (!isOpen) return null;

  // 🔎 Search clients by username
  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2 || selectedClient) return; // stop if already selected
    try {
      const res = await apiClient(
        `http://localhost:8000/drafts/search-clients/?username=${value}`,
        "GET"
      );
      setClients(res.results || []);
    } catch (err) {
      console.error("Error searching clients:", err);
    }
  };

  // ✅ Create draft
  const handleSubmit = async () => {
    if (!selectedClient) {
      toast.error("Select a client first!");
      return;
    }

    try {
      await apiClient("http://localhost:8000/drafts/create/", "POST", {
        client_id: selectedClient.id,
        group_id: groupId !== "individual" ? groupId : null,
        title,
        description,
        price,
      });

      toast.success("Draft created successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating draft:", err);
      toast.error("Failed to create draft");
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Create Draft</h2>

        {/* Search client */}
        <input
          type="text"
          placeholder="Search client by username..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={!!selectedClient}
          className={`w-full border rounded-lg p-2 mb-2 ${
            selectedClient ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />

        {/* If client selected, show card */}
        {selectedClient ? (
          <div className="flex items-center gap-3 p-2 border rounded-lg bg-indigo-50 mb-3">
            <img
              src={selectedClient.profilepic || "/default-avatar.png"}
              alt={selectedClient.fullname}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">{selectedClient.fullname}</p>
              <p className="text-sm text-gray-500">@{selectedClient.username}</p>
            </div>
            <button
              onClick={() => {
                setSelectedClient(null);
                setSearch("");
                setClients([]);
              }}
              className="text-red-500 font-bold px-2"
            >
              ✕
            </button>
          </div>
        ) : (
          clients.length > 0 && (
            <ul className="max-h-32 overflow-y-auto border rounded mb-3">
              {clients.map((client) => (
                <li
                  key={client.id}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedClient(client)}
                >
                  <img
                    src={client.profilepic || "/default-avatar.png"}
                    alt={client.fullname}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{client.fullname}</p>
                    <p className="text-sm text-gray-500">@{client.username}</p>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}

        {/* Draft type dropdown */}
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        >
          <option value="individual">Individual</option>
          {userData?.details?.leader_of?.map((group) => (
            <option key={group.id} value={group.id}>
              Group: {group.name}
            </option>
          ))}
        </select>

        {/* Title */}
        <input
          type="text"
          placeholder="Draft title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        />

        {/* Description */}
        <textarea
          placeholder="Draft description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          rows="3"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;
