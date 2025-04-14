import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ Ajouté
import Header from '../components/Header';
import Footer from '../components/Footer';

const ListeDons = ({ allDons }) => {
  const [dons, setDons] = useState([]);
  const [currentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const donsParPage = 6;

  useEffect(() => {
    const fetchDons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dons`);
        setDons(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des dons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDons();
  }, []);

  const indexOfLastDon = currentPage * donsParPage;
  const indexOfFirstDon = indexOfLastDon - donsParPage;
  const currentDons = dons.slice(indexOfFirstDon, indexOfLastDon);


  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />

      {/* Bande bleue avec flèche de retour et Dashboard */}
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
        {/* SIDEBAR */}
        <aside className="w-64 bg-blue-100 shadow-md relative z-10 -mt-5 ml-10">
          <nav className="py-4">
            {['Don', 'Recuperation', 'Notifications', 'Messages', 'Archives', 'Parametres', 'Profil'].map(
              (item, index) => (
                <a
                  key={index}
                  href="/recuperatin"
                  className={`block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300 ${
                    index === 0 ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 -mt-5 ml-6 mr-10">
          <div className="bg-white rounded-lg shadow-md p-6 h-[600px] overflow-y-scroll">
            <h2 className="text-2xl font-semibold mb-2">Liste des Dons</h2>
            {loading ? (
              <div className="text-center py-10 text-blue-600 font-semibold animate-pulse">
                Chargement des dons...
              </div>
            ) : (
              <div className="space-y-6">
                {currentDons.map((don, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-xl shadow-sm hover:shadow-md transition flex items-start space-x-4"
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${don.url_image}`}
                      alt={don.titre}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{don.titre || 'Nom du don'}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {don.description || 'Lorem ipsum dolor sit amet...'}
                      </p>
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center">
                          MC
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center">
                          ND
                        </div>
                        <span className="text-xs text-gray-500">+5</span>
                      </div>
                    </div>
                    <div className="ml-auto text-gray-400">⋮</div>
                  </div>
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
