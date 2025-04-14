import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { GiSofa } from "react-icons/gi"; // Pour meuble
// GiSofa = catégorie 'mobilier' / meuble. Tu peux changer si besoin

const CardDon = () => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition">
      <img src="/assets/ordi.jpg" alt="don" className="w-full h-32 object-cover rounded" />
      <h3 className="font-semibold text-lg mt-2">Ordinateur Portable</h3>
      
      {/* Infos verticales */}
      <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500" />
          <span>Dakar</span>
        </div>
        <div className="flex items-center gap-2">
          <GiSofa className="text-gray-800" />
          <span>Meuble</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-500" />
          <span>Il y a 2 heures</span>
        </div>
      </div>
    </div>
  );
};

export default CardDon;
 