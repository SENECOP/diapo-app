import React, { useState, useEffect } from 'react';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`https://diapo-app.onrender.com/api/notifications/user/${user._id}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    };

    fetchNotifications();
  }, [user]);

  return (
    <div>
      <h2>Mes Notifications</h2>
      {notifications.map(notif => (
        <div key={notif._id} className="border p-2 my-2">
          <p>{notif.message}</p>
          {notif.don?.titre && <p><i>Don : {notif.don.titre}</i></p>}
          <small>{new Date(notif.date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default NotificationsPage;