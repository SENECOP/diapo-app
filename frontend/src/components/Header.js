import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow p-1 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src="/logo_diapo.png" alt="Diapo Logo" className="h-13 w-auto" />
        <input
          type="text"
          placeholder="Chercher des articles sur diapo"
          className="border px-4 py-2 rounded w-80"
        />
      </div>

      {/* Boutons faire un don */}
      <div className="flex items-center gap-4">
        <Link to="/creer-don">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Faire un don
          </button>
        </Link>
        <Link to="/login">
          <button className="text-gray-700 hover:underline">Mon compte</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
