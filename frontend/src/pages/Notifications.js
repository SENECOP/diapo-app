import React, { useEffect, useState } from "react";
import { FaGift } from "react-icons/fa";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://diapo-app.onrender.com/api/notifications/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erreur lors du chargement des notifications");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Erreur chargement notifications :", error.message);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]); // 

  const handleIgnore = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    // Optionnel : faire un PUT /notifications/:id/lire ici
  };

  const handleVoir = (donId) => {
    window.location.href = `/dons/${donId}`;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification pour l’instant.</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaGift className="text-blue-600" />
                <h3 className="font-semibold text-gray-800 text-sm">Intérêt pour un Don</h3>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(notif.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{notif.emetteur?.pseudo}</span> a exprimé son intérêt
              pour votre don <strong>“{notif.don?.titre}”</strong>.
            </p>

            <div className="mt-3 flex justify-end gap-3">
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={() => handleIgnore(notif._id)}
              >
                Ignorer
              </button>
              <button
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => handleVoir(notif.don?._id)}
              >
                Voir
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;
