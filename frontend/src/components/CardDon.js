import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);
  if (isNaN(diff)) return "Date invalide";

  if (diff < 60) return `Il y a ${diff} seconde${diff > 1 ? "s" : ""}`;
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  }
  const days = Math.floor(diff / 86400);
  return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
};

const CardDon = ({ don }) => {
  const navigate = useNavigate();
  const [favori, setFavori] = useState(false);
  const [showPopup, setShowPopup] = useState(false);  // État pour gérer l'affichage du popup

  if (!don) return null;

  const handleFavoriToggle = (e) => {
    e.stopPropagation();
    setFavori((prev) => !prev);
  };

  const handleTake = async (e) => {
    console.log(don);
    e.stopPropagation();
  
    // 1. Marquer une alerte locale pour l'utilisateur qui prend le don
    localStorage.setItem("AlerteReservation", "true");
  
    try {
      // 2. Récupérer les infos nécessaires
      const currentUser = JSON.parse(localStorage.getItem('user')); 
      const donId = don._id; 
      const createurId = don.createur?._id;
  
      // 3. Appeler l'API pour envoyer une notification au créateur du don
      
      await fetch('https://diapo-app.onrender.com/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinataire: createurId,
          emetteur: currentUser._id,
          message: `${currentUser.pseudo} a exprimé son intérêt pour votre don.`,
          don: donId
        })
      });
      
      // 4. Rediriger l'utilisateur vers la page de messagerie
      localStorage.setItem("AlerteReservation", "true");

      navigate("/message");
  
    } catch (error) {
      console.error("Erreur lors de la prise de don ou de la notification :", error);
      alert("Une erreur est survenue.");
    }

    // Afficher le popup après avoir cliqué sur "Je prends"
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div
      className="border rounded-lg p-4 bg-white shadow hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
    >
      <img
        src={`https://diapo-app.onrender.com/${don.url_image}`}
        alt={don.titre || " "}
        className="w-full h-32 object-cover rounded"
      />
      <h3 className="font-semibold text-lg mt-2">
        {don.titre || "Titre inconnu"}
      </h3>
      <p className="text-sm text-gray-500">{don.categorie || "Catégorie inconnue"}</p>
      <p className="text-sm text-gray-600">
        {don.description || "Pas de description"}
      </p>

      <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500" />
          <span>{don.ville_don || "Lieu inconnu"}</span>
        </div>
        <div className="flex items-center gap-2">
          <GiSofa className="text-gray-800" />
          <span>{don.categorie || "Catégorie"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-500" />
          <span>{formatRelativeTime(don.createdAt)}</span>
        </div>
      </div>

      {/* Boutons en bas */}
      <div className="mt-4 flex justify-between items-center gap-2">
        <button
          onClick={handleTake}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Je prends
        </button>
        <button
          onClick={handleFavoriToggle}
          className="text-gray-400 text-xl p-2 hover:text-gray-800 transition cursor-pointer"
          title="Ajouter aux favoris"
        >
          {favori ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Popup de confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Vous avez pris ce don !</h3>
            <p className="mb-4">Merci pour votre générosité. Le créateur du don sera notifié.</p>
            <button
              onClick={closePopup}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDon;
