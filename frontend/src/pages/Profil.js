import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profil = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Mon profil</h2>
        {user ? (
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.pseudo)}`}
                alt={`Avatar de ${user.pseudo}`}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <p><strong>Pseudo :</strong> {user.pseudo}</p>
                <p><strong>Email :</strong> {user.email || 'Non renseigné'}</p>
                <p><strong>Ville :</strong> {user.ville_residence || 'Non renseignée'}</p>
              </div>
            </div>

            {/* Bouton de déconnexion */}
            <div className="text-center mt-6">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center">Vous devez être connecté(e) pour accéder à votre profil.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profil;
