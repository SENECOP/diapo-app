import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { FiFilter, FiX, FiBell, FiMail } from "react-icons/fi";

const Header = () => {
  const { user } = useContext(UserContext);

  const [showFilters, setShowFilters] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const filterMenuRef = useRef(null);

  const categories = ["Technologie", "Vêtements", "Électroménager", "Livres"];
  const villes = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchCategory = (event) => setSearchCategory(event.target.value);
  const handleSearchCity = (event) => setSearchCity(event.target.value);

  const getInitials = (name) => {
    if (!name) return "XX";
    const nameParts = name.split(' ');
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white shadow p-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src="/logo_diapo.png" alt="Diapo Logo" className="h-16 w-auto" />
      </div>

      {/* Barre de recherche et filtre */}
      <div className="flex items-center gap-2 flex-1 max-w-3xl mx-4 relative">
        <input
          type="text"
          placeholder="Ex: Pillow, iPhone cases, rugs"
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button onClick={() => setShowFilters(!showFilters)} className="p-2 border rounded hover:bg-gray-100">
          <FiFilter size={20} />
        </button>

        {showFilters && (
          <div ref={filterMenuRef} className="absolute right-0 mt-2 w-60 bg-white shadow-md border rounded p-4 z-10">
            {/* Catégories */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                id="category"
                value={searchCategory}
                onChange={handleSearchCategory}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Villes */}
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <select
                id="city"
                value={searchCity}
                onChange={handleSearchCity}
                className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Toutes les villes</option>
                {villes.map((ville) => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            <button onClick={() => setShowFilters(false)} className="absolute top-2 right-2 p-2 rounded-full text-gray-600 hover:text-gray-800">
              <FiX size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Boutons droite */}
      <div className="flex items-center gap-4">
       <Link to={user ? "/CreerDon" : "/login"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Faire un don
          </button>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-blue-600">
          <FiBell size={22} />
        </button>
        <button className="relative p-2 text-gray-600 hover:text-blue-600">
          <FiMail size={22} />
        </button>

        {/* Utilisateur connecté ou liens */}
        {user && user.pseudo ? (
          <Link to="/profil" className="flex items-center gap-2 cursor-pointer">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`Avatar de ${user.pseudo}`}
                className="w-8 h-8 rounded-full border object-cover"
              />
            ) : (
              <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                {getInitials(user.pseudo)}
              </div>
            )}
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to="/login">
              <button className="text-gray-700 hover:underline">Se connecter</button>
            </Link>
            <Link to="/Signup">
              <button className="text-gray-700 hover:underline">S'inscrire</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
