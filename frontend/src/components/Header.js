import { useState, useContext } from "react";
import { UserContext } from '../context/UserContext';
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-white shadow p-3 flex items-center justify-between">
      {/* Left - Logo */}
      <div className="flex items-center gap-4">
        <img src="/logo_diapo.png" alt="Diapo Logo" className="h-16 w-auto" />
      </div>

      {/* Center - Search bar + Categories */}
      <div className="flex items-center gap-2 flex-1 max-w-3xl mx-4 relative">
        <input
          type="text"
          placeholder="Ex: Pillow, iPhone cases, rugs"
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Categories dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="border px-4 py-2 rounded bg-white hover:bg-gray-100"
          >
            Catégories ▾
          </button>

          {showDropdown && (
            <ul className="absolute z-10 mt-1 bg-white border rounded shadow-md w-48">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Technologie
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Ameublement
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Mobilier
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Vêtement
              </li>
            </ul>
          )}
        </div>
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
            <span className="text-gray-800 font-semibold">{user.pseudo}</span>
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
