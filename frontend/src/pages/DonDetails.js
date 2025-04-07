import { Link } from "react-router-dom";

const DonDetails = ({ don }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img src={don.url_image || "https://via.placeholder.com/150"} alt={don.titre} className="w-full h-40 object-cover rounded-lg mb-2" />
      <h2 className="text-xl font-semibold">{don.titre}</h2>
      <p className="text-gray-600">{don.description}</p>
      <p className="text-sm text-gray-500">Ville: {don.ville_don}</p>
      <Link to={`/don/${don._id}`} className="text-blue-500 mt-2 inline-block">Voir détails</Link>
    </div>
  );
};

export default DonDetails;
