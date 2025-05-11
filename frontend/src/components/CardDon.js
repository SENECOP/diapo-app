import { useNavigate } from 'react-router-dom'; // Pour utiliser useNavigate
import { useState, useEffect } from 'react'; // Pour utiliser useState et useEffect
import { FaMapMarkerAlt, FaClock, FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Pour les icônes
import { GiSofa } from 'react-icons/gi'; // Pour l'icône Sofa
import { formatDistanceToNow } from 'date-fns'; // Pour formater le temps écoulé

const CardDon = ({ don, onReservationSuccess }) => {
  const navigate = useNavigate();
  const [favori, setFavori] = useState(false);
  const [isPris, setIsPris] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Vérifie si le don a déjà un preneur, sinon on ne marque pas le don comme "pris"
    if (don && don.preneur && don.preneur === currentUser?._id) {
      setIsPris(true); // Le don est réservé par l'utilisateur
    } else {
      setIsPris(false); // Sinon, il n'est pas pris
    }
  }, [don, currentUser]);

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

      setIsPris(true); // Met à jour l'état pour indiquer que le don a été pris
      alert("✅ Vous avez réservé ce don avec succès.");

      // 🔁 Rafraîchir les données dans le composant parent (si fourni)
      if (onReservationSuccess) onReservationSuccess();

    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
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
          <span>{formatDistanceToNow(new Date(don.createdAt), { addSuffix: true })}</span>
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
