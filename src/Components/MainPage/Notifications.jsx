import React, { useEffect, useState } from "react";
import { apiClient } from "../../apiClient";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient("/notifications/", "GET");
      // const data = await apiClient("http://localhost:8000/notifications/", "GET");
      setNotifications(data);
    } catch (err) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteResponse = async (inviteId, n_id,action) => {
    
    try {
      await apiClient(`/group/${inviteId}/respond`, "POST", {n_id,action} );
      // await apiClient(`http://localhost:8000/group/${inviteId}/respond`, "POST", {n_id,action} );
      fetchNotifications();
    } catch (err) {
      console.error("Failed to respond:", err);
    }
  };

  if (loading) return <p>Loading invites...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="m-1">
      <h2 className="text-2xl  font-bold mb-4">Group Invites</h2>
      {notifications.length === 0 ? (
        <p>No Invites</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{n.message}</p>
                <small className="text-gray-500">
                  {new Date(n.created_at).toLocaleString()}
                </small>
                {n.related_group && (
                  <div>
                    <Link
                      to={`/groups/${n.related_group}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Group
                    </Link>
                  </div>
                )}
              </div>

              {/* Show Accept/Decline only for invite type */}
              {n.type === "group_invite" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInviteResponse(n.related_invite,n.id, "accept")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleInviteResponse(n.related_invite,n.id, "decline")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
