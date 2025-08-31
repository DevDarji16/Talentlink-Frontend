import React, { useState } from "react";
import { apiClient } from "../apiClient";
import toast from "react-hot-toast";

const EditGigModal = ({ isOpen, onClose, gig, setGig }) => {
  const [title, setTitle] = useState(gig.title);
  const [description, setDescription] = useState(gig.description);
  const [price, setPrice] = useState(gig.price);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const res = await apiClient(
        // `http://localhost:8000/gigs/${gig.id}/edit/`,
        `/gigs/${gig.id}/edit/`,
        "POST",
        { title, description, price }
      );
      console.log(res.gig)
      setGig(res.gig)

      toast.success("Gig updated successfully!");
      
      onClose();
    } catch (err) {
      console.error("Error updating gig:", err);
      toast.error("Failed to update gig.");
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm bg-opacity-40 z-50">
      <div onClick={e=>e.stopPropagation()} className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Gig</h2>
        <input
          type="text"
          className="w-full border p-2 mb-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          className="w-full border p-2 mb-3 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGigModal;
