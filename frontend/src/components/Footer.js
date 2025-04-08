import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-5 gap-8 text-black">
        {/* Logo */}
        <div>
          <img src="/logo_diapo.png" alt="Logo" className="h-14 w-auto mb-2" />
        </div>

        {/* Colonne 1 */}
        <div>
          <h4 className="font-bold mb-2">Nous contacter</h4>
          <ul>
            <li>Contact</li>
          </ul>
        </div>

        {/* Colonne 2 */}
        <div>
          <h4 className="font-bold mb-2">À propos</h4>
          <ul>
            <li>Aide</li>
            <li>Conditions Générales</li>
          </ul>
        </div>

        {/* Colonne 3 */}
        <div>
          <h4 className="font-bold mb-2">Liens rapides</h4>
          <ul>
            <li>Se connecter</li>
            <li>S'inscrire</li>
            <li>Créer une annonce</li>
          </ul>
        </div>

        {/* Colonne 4 - Newsletter */}
        <div>
          <h4 className="font-bold mb-2">Newsletter</h4>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 rounded w-full mb-2"
          />
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition">
            S'abonner
          </button>
        </div>
      </div>

      {/* Bas de page bleu foncé */}
      <div className="bg-blue-900 text-white text-sm py-3 px-4 flex items-center justify-center gap-2">
        <span>Suivez-nous</span>
        <FaFacebook className="text-xl" />
      </div>
    </footer>
  );
};

export default Footer;
