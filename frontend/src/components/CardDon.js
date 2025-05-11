import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import { FaMapMarkerAlt, FaClock, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { GiSofa } from 'react-icons/gi';
import { formatDistanceToNow } from 'date-fns';

const CardDon = ({ don, onReservationSuccess }) => {
  const navigate = useNavigate();
  const [favori, setFavori] = useState(false);
  const [etatDon, setEtatDon] = useState(don.etat);
  const [preneurDon, setPreneurDon] = useState(don.preneur);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const alertReservation = localStorage.getItem("AlerteReservation");
    if (alertReservation === "true") {
      setEtatDon("réservé");
      localStorage.removeItem("AlerteReservation");
    }
  }, []);


  useEffect(() => {
    setEtatDon(don.etat);
    setPreneurDon(don.preneur);
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

      setEtatDon("réservé");
      setPreneurDon(currentUser._id);

      if (onReservationSuccess) onReservationSuccess();

      navigate("/message", {
        state: { showReservationAlert: true },
      });
      localStorage.setItem("AlerteReservation", "true");

    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("❌ Une erreur est survenue.");
    }
  };

  const estPris = etatDon === "réservé" || preneurDon === currentUser?._id;

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
          disabled={estPris}
          className={`px-4 py-2 text-white rounded ${
            estPris ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {estPris ? "Pris" : "Je prends"}
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
