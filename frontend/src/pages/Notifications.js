import React, { useEffect, useState } from "react";
import { FaGift } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from "../components/Footer";
import Header from "../components/Header"; // adapte le chemin si besoin

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    console.log("Utilisateur non connecté, pas de récupération des notifications.");
    return; 
  }

    const fetchNotifications = async () => {
      try {
        const response = await fetch("https://diapo-app.onrender.com/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur lors du chargement des notifications");

        const data = await response.json();
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        } else {
          setNotifications([]); // fallback sécurisé
        }
      } catch (error) {
        console.error("Erreur chargement notifications :", error.message);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER EN HAUT */}
      <Header />
      
      <div className="bg-blue-700 text-white px-10 py-10 flex items-center h-[250px] space-x-4">
         <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full bg-white text-blue-700 hover:bg-gray-100 shadow"
              title="Retour au tableau de bord"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-semibold">Notifications</h1>
        </div>
      
      </div>

      {/* CONTENU PRINCIPAL EN DESSOUS */}
      <div className="flex flex-1">
        {/* Colonne Gauche : Notifications */}
        <div className="w-1/3 bg-gray-300 border-r">
          <div className="bg-white text-gray-900 p-4 text-lg font-semibold">
            Notifications
          </div>
          <div className="p-2 overflow-y-auto h-full">
            {notifications.length === 0 ? (
              <p className="text-gray-500">Aucune notification</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="bg-white rounded-md shadow-sm p-3 mb-2 flex items-start justify-between hover:bg-blue-50 cursor-pointer"
                   onClick={() => {
                    navigate('/message', {
                      state: {
                        user: {
                          pseudo: notification.emetteur?.pseudo || "Utilisateur",
                          avatar: notification.emetteur?.avatar || "https://via.placeholder.com/50"
                        },
                        messageInitial: {
                          image: notification.don?.image_url || "https://via.placeholder.com/150",
                          description: notification.don?.description || "Aucune description fournie"
                        }
                      }
                    });
                  }}
                 >
                  <div className="flex gap-2">
                    <div className="p-2 bg-gray-200 rounded-full">
                      <FaGift className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {notification.emetteur?.pseudo || "Utilisateur"}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        Intérêt pour le don : {notification.don?.titre || ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleString("fr-FR", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne Droite : Contenu statique ou détail */}
        <div className="flex-1 p-6 bg-white ">
          <h2 className="text-xl font-bold mb-2">Liste des Dons</h2>
          <p className="text-sm text-gray-500">Subheading</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationPage;
