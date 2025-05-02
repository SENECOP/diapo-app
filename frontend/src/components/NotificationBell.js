import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://diapo-app.onrender.com/api/notifications/user/${currentUser._id}`);
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error);
      }
    };

    if (currentUser?._id) {
      fetchNotifications();
    }
  }, [currentUser]);

  return (
    <div className="relative">
      <button
        onClick={() => setVisible(!visible)}
        className="relative text-2xl text-gray-700 hover:text-blue-600"
        title="Notifications"
      >
        <FaBell />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {visible && (
        <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg p-2 z-50">
          <h4 className="text-sm font-semibold mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune notification</p>
          ) : (
            notifications.map((notif, index) => (
              <div key={index} className="text-sm text-gray-700 border-b py-1">
                {notif.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
