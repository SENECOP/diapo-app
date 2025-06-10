import React, { useEffect, useState } from "react";
import { FaGift, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedDon, setSelectedDon] = useState(null);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
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
          setNotifications([]);
        }
      } catch (error) {
        console.error("Erreur chargement notifications :", error.message);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`https://diapo-app.onrender.com/api/notifications/read/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Échec lors de la mise à jour de la notification.");
      }
    } catch (error) {
      console.error("Erreur lors du marquage comme lu :", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header />

      {/* BANNIÈRE */}
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

      {/* CONTENU PRINCIPAL */}
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
                  className={`bg-white rounded-md shadow-sm p-3 mb-2 flex items-start justify-between hover:bg-blue-50 cursor-pointer ${
                    notification.vu ? 'opacity-50' : 'opacity-100'
                  }`}
                  onClick={async () => {
                  await markAsRead(notification._id);
                  setNotifications(prev =>
                    prev.map(n => n._id === notification._id ? { ...n, vu: true } : n)
                  );

                  const isDonateur = currentUser?.pseudo === notification.emetteur?.pseudo;
                  if (isDonateur) {
                    alert("Vous êtes le donateur. Vous ne pouvez pas ouvrir cette messagerie.");
                    return;
                  }

                  const donId = notification.don?._id;
                  if (!donId) {
                    alert("Aucun identifiant de don trouvé.");
                    return;
                  }

                  try {
                    const res = await fetch(`https://diapo-app.onrender.com/api/dons/${donId}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    if (!res.ok) throw new Error("Erreur lors de la récupération du don");

                    const donComplet = await res.json(); 
                    setSelectedDon(donComplet);          
                  } catch (error) {
                    console.error("Erreur récupération du don :", error.message);
                  }
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
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne Droite : Détails du don sélectionné */}
        <div className="flex-1 p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Détail du Don</h2>
          {!selectedDon ? (
            <p className="text-sm text-gray-500">
              Sélectionnez une notification pour voir les détails du don.
            </p>
          ) : (
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-6">
            {/* Image du don */}
            <div className="flex justify-center">
              <img
                src={selectedDon.image_url || "https://placehold.co/400x250"}
                alt="Don"
                className="rounded-lg shadow-lg max-h-64 object-cover"
              />
            </div>

            {/* Titre */}
            <div>
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {selectedDon.titre || "Titre non renseigné"}
              </h3>
              <p className="text-gray-700">{selectedDon.description || "Aucune description fournie."}</p>
            </div>

            {/* Détails du don en grille */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Ville</p>
                <p>{selectedDon.ville_don || "Non précisée"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Catégorie</p>
                <p>{selectedDon.categorie || "Non précisée"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">État</p>
                <p>{selectedDon.statut || "Non précisé"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Donateur</p>
                <p>{selectedDon.donateur?.pseudo || "Non identifié"}</p>
              </div>
            </div>

            {/* Date de création du don (optionnel) */}
            {selectedDon.createdAt && (
              <div className="text-right text-xs text-gray-400">
                Don créé le : {new Date(selectedDon.createdAt).toLocaleDateString("fr-FR", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </div>
            )}
          </div>
          )}
          {selectedDon && (
  <div className="text-center mt-4">
    <button
      onClick={async () => {
  try {
    const response = await fetch("https://diapo-app.onrender.com/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        don_id: selectedDon._id,
        utilisateur_1: currentUser?.pseudo,
        utilisateur_2: selectedDon.donateur?.pseudo,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création ou récupération de la conversation");
    }

    const data = await response.json();
    console.log("Conversation trouvée/créée :", data);

    // Redirige vers la messagerie si un ID est retourné
    if (data?._id) {
      navigate(`/messages/${data._id}`);
    } else {
      alert("Impossible de rediriger vers la messagerie.");
    }
  } catch (error) {
    console.error("Erreur création conversation :", error.message);
    alert("Impossible de démarrer la conversation.");
  }
}}

      className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
    >
      Contacter le donateur
    </button>
  </div>
)}

        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default NotificationPage;
