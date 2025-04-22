import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiMenu, FiX } from 'react-icons/fi';

const ListeDons = () => {
  const [dons, setDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchDons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dons`);
        if (Array.isArray(response.data)) {
          setDons(response.data);
        } else if (Array.isArray(response.data.data)) {
          setDons(response.data.data);
        } else {
          console.error("Format inattendu des données :", response.data);
          setDons([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des dons:', error);
        setDons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDons();
  }, [location]);

  if (loading) return <div className="text-center py-10">Chargement des dons...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Erreur : {error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />

      {/* Bandeau supérieur */}
      <div className="bg-blue-700 text-white px-10 py-10 flex items-center space-x-4">
        <Link
          to="/"
          className="text-white text-2xl hover:text-gray-200 transition-transform transform hover:-translate-x-1"
        >
          ←
        </Link>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
          <aside
            className={`transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'bg-blue-100 w-64 shadow-md' : 'w-10'
            } relative z-10 -mt-5 ml-10`}
          >
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-6 left-2 text-blue-700 text-2xl z-20"
            >
              <FiMenu />
            </button>
          )}

          {isSidebarOpen && (
            <>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-4 text-blue-700 text-2xl"
              >
                <FiX />
              </button>

              <nav className="py-4 mt-10">
                <Link
                  to="/ListeDons"
                  className="block px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded"
                >
                  Don
                </Link>
                <Link
                  to="/recuperation"
                  className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300"
                >
                  Récupération
                </Link>
                <Link
                  to="/notifications"
                  className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300"
                >
                  Notifications
                </Link>
                <Link
                  to="/messages"
                  className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300"
                >
                  Messages
                </Link>
                <Link
                  to="/archives"
                  className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300"
                >
                  Archives
                </Link>
                <Link
                  to="/parametres"
                  className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300"
                >
                  Paramètres
                </Link>
                <Link
                  to="/profil"
                  className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300"
                >
                  Profil
                </Link>
              </nav>
            </>
          )}
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 -mt-5 ml-6 mr-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-2">Liste des Dons</h2>
            {loading ? (
              <div className="text-center py-10 text-blue-600 font-semibold animate-pulse">
                Chargement des dons...
              </div>
            ) : (
              <div className="space-y-6">
                {[...dons].reverse().map((don) => (
                  <Link
                    key={don._id}
                    to={`/don/${don._id}`}
                    className="block border p-4 rounded-xl shadow-sm hover:shadow-md transition flex items-start space-x-4 hover:bg-gray-50"
                  >
                    {don.url_image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${don.url_image}`}
                        alt={don.titre || 'Image du don'}
                        className="w-28 h-28 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {don.titre || 'Titre non disponible'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {don.description || 'Aucune description fournie.'}
                      </p>
                      <p className="text-sm text-gray-500 italic mt-1">
                        {don.categorie || 'Catégorie inconnue'} — {don.ville_don || 'Ville non précisée'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ListeDons;
