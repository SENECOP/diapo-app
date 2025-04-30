import React, { useEffect, useState } from 'react';


function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userId'); // ou autre méthode pour récupérer l'utilisateur

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://diapo-app.onrender.com/api/notifications/${userId}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Erreur récupération des notifications', err);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div>
      <h2>Mes notifications</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id}>
            <strong>{notif.message}</strong><br />
            {notif.don?.titre && <em>Don : {notif.don.titre}</em>}<br />
            <span>{new Date(notif.date).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
