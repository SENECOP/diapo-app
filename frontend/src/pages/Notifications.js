import React, { useEffect, useState } from "react";
import { FaGift, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/Header";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedDon, setSelectedDon] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      
      try {
        const response = await fetch("https://diapo-app.onrender.com/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erreur lors du chargement des notifications");

        const data = await response.json();
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch (error) {
        console.error("Erreur chargement notifications:", error.message);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`https://diapo-app.onrender.com/api/notifications/read/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erreur marquage comme lu:", error.message);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log("Notification cliquée:", notification);
    await markAsRead(notification._id);
    
    setNotifications(prev => 
      prev.map(n => n._id === notification._id ? { ...n, vu: true } : n)
    );

    if (currentUser?.pseudo === notification.emetteur?.pseudo) {
      alert("Vous êtes le donateur. Vous ne pouvez pas ouvrir cette messagerie.");
      return;
    }

    if (!notification.don?._id) {
      alert("Aucun identifiant de don trouvé.");
      return;
    }

    try {
      const res = await fetch(`https://diapo-app.onrender.com/api/dons/${notification.don._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Erreur lors de la récupération du don");
      
      const donComplet = await res.json();
      console.log("Don complet reçu:", donComplet);
      setSelectedDon(donComplet);
    } catch (error) {
      console.error("Erreur récupération du don:", error.message);
    }
  };

  const handleContactDonateur = async () => {
  if (!selectedDon || !currentUser?._id) {
    alert("Don ou utilisateur non valide");
    return;
  }

  setLoading(true);

  try {
    // 1. Vérification du donateur
    if (!selectedDon.donateur?._id) {
      const donResponse = await fetch(`https://diapo-app.onrender.com/api/dons/${selectedDon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!donResponse.ok) throw new Error("Échec de la récupération du don");
      
      const donActualisé = await donResponse.json();
      if (!donActualisé.donateur?._id) {
        throw new Error("Donateur introuvable pour ce don");
      }
      setSelectedDon(donActualisé);
    }

    // 2. Création/Récupération de la conversation
    const response = await fetch("https://diapo-app.onrender.com/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        don_id: selectedDon._id,
        utilisateur1: selectedDon.donateur._id, // Donateur
        utilisateur2: currentUser._id           // Preneur (utilisateur actuel)
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erreur lors de la création de la conversation");
    }

    const conversation = await response.json();

    // 3. Redirection vers la messagerie
    navigate(`/message/${conversation._id}`, {
      state: {
        conversation,
        currentUser,
        otherUser: conversation.participants.find(p => p._id !== currentUser._id),
        don: selectedDon
      }
    });

  } catch (error) {
    console.error("Erreur:", error);
    alert(`Erreur: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col">
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

      <div className="flex flex-1">
        {/* Colonne Notifications */}
        <div className="w-1/3 bg-gray-300 border-r">
          <div className="bg-white text-gray-900 p-4 text-lg font-semibold">
            Notifications
          </div>
          <div className="p-2 overflow-y-auto h-full">
            {notifications.length === 0 ? (
              <p className="text-gray-500">Aucune notification</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`bg-white rounded-md shadow-sm p-3 mb-2 flex items-start justify-between hover:bg-blue-50 cursor-pointer ${
                    notification.vu ? 'opacity-50' : 'opacity-100'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
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
                        Intérêt pour le don: {notification.don?.titre || ""}
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

        {/* Colonne Détails du don */}
        <div className="flex-1 p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Détail du Don</h2>
          
          {!selectedDon ? (
            <p className="text-sm text-gray-500">
              Sélectionnez une notification pour voir les détails du don.
            </p>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-6">
              <div className="flex justify-center">
                <img
                  src={selectedDon.image_url || "https://placehold.co/400x250"}
                  alt="Don"
                  className="rounded-lg shadow-lg max-h-64 object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-blue-700 mb-2">
                  {selectedDon.titre || "Titre non renseigné"}
                </h3>
                <p className="text-gray-700">
                  {selectedDon.description || "Aucune description fournie."}
                </p>
              </div>

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

              {selectedDon.createdAt && (
                <div className="text-right text-xs text-gray-400">
                  Don créé le: {new Date(selectedDon.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </div>
              )}

              <div className="text-center mt-4">
                <button
                  onClick={handleContactDonateur}
                  className={`bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Chargement...' : 'Contacter le donateur'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationPage;