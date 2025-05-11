import { useState, useEffect } from "react";
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
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minute${diff > 1 ? "s" : ""}`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heure${diff > 1 ? "s" : ""}`;
  return `Il y a ${Math.floor(diff / 86400)} jour${diff > 1 ? "s" : ""}`;
};

const CardDon = ({ don }) => {
  const navigate = useNavigate();
  const [favori, setFavori] = useState(false);
  const [isPris, setIsPris] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const donsPris = JSON.parse(localStorage.getItem("donsPris")) || [];
    if (don && donsPris.includes(don._id)) {
      setIsPris(true);
    }
  }, [don]);

  if (!don) return null;

  const handleFavoriToggle = (e) => {
    e.stopPropagation();
    setFavori((prev) => !prev);
  };

  const handleTake = async (e) => {
    e.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // Réserver le don
      const res = await fetch(`https://diapo-app.onrender.com/api/dons/${don._id}/reserver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preneur: currentUser._id }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Erreur réservation :", error);
        return;
      }

      // Notification
      const donateurId = don.user?._id || don.user;
      if (!donateurId) {
        console.error("ID du donateur introuvable");
        return;
      }

      const notifRes = await fetch("https://diapo-app.onrender.com/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emetteur: currentUser._id,
          destinataire: donateurId,
          message: `${currentUser.pseudo} a cliqué sur "Je prends" pour votre don "${don.titre}".`,
          don: don._id,
        }),
      });

      if (!notifRes.ok) {
        const error = await notifRes.text();
        console.error("Erreur envoi notification :", error);
        return;
      }

      // Marquer le don comme pris localement
      const donsPris = JSON.parse(localStorage.getItem("donsPris")) || [];
      if (!donsPris.includes(don._id)) {
        donsPris.push(don._id);
        localStorage.setItem("donsPris", JSON.stringify(donsPris));
      }

      setIsPris(true);

      // ✅ Alerte utilisateur
      alert("✅ Notification envoyée au donateur.\nVous pouvez continuer à consulter les autres dons.");

    } catch (error) {
      console.error("Erreur lors de la réservation ou de la notification :", error);
      alert("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
      <img
        src={`https://diapo-app.onrender.com/${don.url_image}`}
        alt={don.titre || "Titre de l'image"}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="font-semibold text-lg mt-2">{don.titre || "Titre inconnu"}</h3>
      <p className="text-sm text-gray-500">{don.categorie || "Catégorie inconnue"}</p>
      <p className="text-sm text-gray-600">{don.description || "Pas de description"}</p>

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

      <div className="mt-4 flex justify-between items-center gap-2">
        <button
          onClick={handleTake}
          disabled={isPris}
          className={`flex-1 py-2 rounded transition ${
            isPris ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isPris ? "Pris" : "Je prends"}
        </button>
        <button
          onClick={handleFavoriToggle}
          className="text-gray-400 text-xl p-2 hover:text-gray-800 transition cursor-pointer"
          title="Ajouter aux favoris"
        >
          {favori ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
    </div>
  );
};

export default CardDon;
