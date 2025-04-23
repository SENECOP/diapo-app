import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { useNavigate } from "react-router-dom";


const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // en secondes

  if (isNaN(diff)) return "Date invalide";

  if (diff < 60) return `Il y a ${diff} seconde${diff > 1 ? 's' : ''}`;
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  const days = Math.floor(diff / 86400);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};


const CardDon = ({ don }) => {
  const navigate = useNavigate(); 

  if (!don) return null; 

  return (
    <div
      onClick={() => navigate(`/don/${don._id}`)}
      className="border rounded-lg p-4 bg-white shadow hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
    >      <img
        src={`https://diapo-app.onrender.com/${don.url_image}`}
        alt={don.titre || " "}
        className="w-full h-32 object-cover rounded"
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
          <span>{don.categorie || "Cate gorie"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-500" />
          <span>{formatRelativeTime(don.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
CardDon.defaultProps = {
  don: {
    url_image: "/assets/default.jpg",
    titre: "Don sans titre",
    description: "Pas de description",
    categorie: "Inconnue",
    ville: "Lieu inconnu",
  }
};
export default CardDon;
