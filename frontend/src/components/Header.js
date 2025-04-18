import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from '../context/UserContext';
import { Link } from "react-router-dom";
import { FiFilter, FiX } from 'react-icons/fi'; // Importation des icônes de filtre et de fermeture

const Header = () => {
  const { user } = useContext(UserContext);

  // États pour afficher le menu de filtres et pour les barres de recherche
  const [showFilters, setShowFilters] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');

  // Références pour le menu de filtre
  const filterMenuRef = useRef(null);

  // Gérer la fermeture du filtre lorsqu'on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilters(false); // Ferme le filtre si on clique à l'extérieur
      }
    };

    // Ajouter un gestionnaire d'événements pour détecter les clics à l'extérieur
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyer l'événement au démontage
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Gérer la modification des entrées de recherche
  const handleSearchCategory = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleSearchCity = (event) => {
    setSearchCity(event.target.value);
  };

  // Fonction pour obtenir les initiales de l'utilisateur
  const getInitials = (name) => {
    if (!name) return "XX"; // Si le pseudo est vide, on retourne XX par défaut
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0]; // Prénom et Nom
    }
    return name.substring(0, 2).toUpperCase(); // Prise des deux premières lettres du pseudo
  };

  return (
    <header className="bg-white shadow p-3 flex items-center justify-between">
      {/* Left - Logo */}
      <div className="flex items-center gap-4">
        <img src="/logo_diapo.png" alt="Diapo Logo" className="h-16 w-auto" />
      </div>

      {/* Center - Search bar + Filter icon */}
      <div className="flex items-center gap-2 flex-1 max-w-3xl mx-4 relative">
        <input
          type="text"
          placeholder="Ex: Pillow, iPhone cases, rugs"
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        
        {/* Icône de filtre */}
        <button onClick={() => setShowFilters(!showFilters)} className="p-2 border rounded hover:bg-gray-100">
          <FiFilter size={20} />
        </button>

        {/* Menu de filtres */}
        {showFilters && (
          <div 
            ref={filterMenuRef} 
            className="absolute right-0 mt-2 w-48 bg-white shadow-md border rounded p-4 z-10"
          >
            <div className="mb-4">
              {/* Label visible et correctement stylé */}
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Filtrer par catégorie</label>
              <input
                type="text"
                id="category"
                placeholder="Recherche catégorie"
                value={searchCategory}
                onChange={handleSearchCategory}
                className="border px-3 py-2 mt-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Filtrer par ville</label>
              <input
                type="text"
                id="city"
                placeholder="Recherche ville"
                value={searchCity}
                onChange={handleSearchCity}
                className="border px-3 py-2 mt-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Bouton de fermeture du filtre */}
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-2 right-2 p-2 rounded-full text-gray-600 hover:text-gray-800"
            >
              <FiX size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Right - Faire un don + Profil utilisateur ou Mon compte */}
      <div className="flex items-center gap-4">
        <Link to="/creer-don">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Faire un don
          </button>
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            {/* Affichage des initiales */}
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
              {getInitials(user.pseudo)} {/* Affichage des initiales */}
            </div>
            {user.avatar && (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full border object-cover"
              />
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="text-gray-700 hover:underline">Mon compte</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
