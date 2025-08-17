import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../apiClient";
import { MoreVertical } from "lucide-react";

export default function CanvasList() {
  const [canvases, setCanvases] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [renameTitle, setRenameTitle] = useState("");
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const navigate = useNavigate();

  // Fetch canvases
  useEffect(() => {
    const fetchCanvases = async () => {
      const data = await apiClient("http://localhost:8000/canvases/");
      setCanvases(data.canvases);
    };
    fetchCanvases();
  }, []);

  // Create new canvas
  const createCanvas = async () => {
    const canvasData = { title: newTitle };
    const data = await apiClient(
      "http://localhost:8000/canvas/create/",
      "POST",
      canvasData
    );
    setShowCreateModal(false);
    setNewTitle("");
    navigate(`/canvas/${data.id}`);
  };

  // Rename canvas
  const renameCanvas = async () => {
    if (!selectedCanvas) return;
    await apiClient(
      `http://localhost:8000/canvas/${selectedCanvas.id}/update/`,
      "PUT",
      { title: renameTitle }
    );
    setCanvases((prev) =>
      prev.map((c) =>
        c.id === selectedCanvas.id ? { ...c, title: renameTitle } : c
      )
    );
    setShowRenameModal(false);
    setSelectedCanvas(null);
    setRenameTitle("");
  };

  // Delete canvas
  const deleteCanvas = async () => {
    if (!selectedCanvas) return;
    await apiClient(
      `http://localhost:8000/canvas/${selectedCanvas.id}/delete/`,
      "DELETE"
    );
    setCanvases((prev) => prev.filter((c) => c.id !== selectedCanvas.id));
    setShowDeleteModal(false);
    setSelectedCanvas(null);
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Add Canvas Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        + Add Canvas
      </button>

      {/* Canvas List */}
      {canvases.length > 0 && (
        <div className="space-y-3">
          {canvases.map((canvas) => (
            <div
              key={canvas.id}
              className="relative p-4 border rounded-lg flex justify-between items-start hover:bg-gray-50 transition"
            >
              <div
                onClick={() => navigate(`/canvas/${canvas.id}`)}
                className="cursor-pointer flex-1"
              >
                <h3 className="font-medium">{canvas.title}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(canvas.created_at).toLocaleString()}
                </p>
              </div>

              {/* 3-dot menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === canvas.id ? null : canvas.id)
                  }
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <MoreVertical size={20} />
                </button>

                {menuOpenId === canvas.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={() => {
                        setSelectedCanvas(canvas);
                        setRenameTitle(canvas.title);
                        setShowRenameModal(true);
                        setMenuOpenId(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCanvas(canvas);
                        setShowDeleteModal(true);
                        setMenuOpenId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-10 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Canvas</h2>
            <input
              type="text"
              placeholder="Canvas Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={createCanvas}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-10 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Rename Canvas</h2>
            <input
              type="text"
              placeholder="New Title"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={renameCanvas}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCanvas && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-10 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Canvas</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCanvas.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteCanvas}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
