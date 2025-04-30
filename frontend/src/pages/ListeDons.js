import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiMenu, FiX, FiMoreVertical, FiEdit, FiTrash2, FiArchive } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);



const ListeDons = () => {
  const [dons, setDons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDons = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://diapo-app.onrender.com/api/dons');
        const data = response.data;
        if (Array.isArray(data)) {
          setDons(data);
        } else if (Array.isArray(data.data)) {
          setDons(data.data);
        } else {
          console.error("Format inattendu des données :", data);
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

  const handleEdit = (id) => {
    navigate(`/creer-don/${id}`);
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet article ?',
      html: 'Cette action est irréversible. Une fois supprimé, cet article ne pourra pas être récupéré.',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      icon: null, // supprime l'icône
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html',
        actions: 'custom-swal-actions'
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://diapo-app.onrender.com/api/dons/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          Swal.fire('Supprimé', 'Don supprimé avec succès.', 'success');
          setDons((prev) => prev.filter((don) => don._id !== id));
        } catch (error) {
          console.error('Erreur lors de la suppression :', error);
          Swal.fire('Erreur', 'Erreur lors de la suppression', 'error');
        }
      }
    });
  };
  const handleArchive = async (id) => {
    console.log("ID du don à archiver :", id);
    if (window.confirm("Voulez-vous archiver ce don ?")) {
      try {
        await axios.put(`https://diapo-app.onrender.com/api/dons/${id}/archives`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Don archivé avec succès');
        setDons((prev) => prev.filter((don) => don._id !== id)); // Supposons que l'archivage implique de supprimer le don de la liste actuelle
      } catch (error) {
        console.error('Erreur lors de l\'archivage :', error);
        alert('Erreur lors de l\'archivage');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />

      <div className="bg-blue-700 text-white px-10 py-10 flex items-center space-x-4">
        <Link to="/" className="text-white text-2xl hover:text-gray-200 transition-transform transform hover:-translate-x-1">←</Link>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'bg-blue-100 w-64 shadow-md' : 'w-10'} relative z-10 -mt-5 ml-10`}>
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="absolute top-6 left-2 text-blue-700 text-2xl z-20">
              <FiMenu />
            </button>
          )}

          {isSidebarOpen && (
            <>
              <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-4 text-blue-700 text-2xl">
                <FiX />
              </button>

              <nav className="py-4 mt-10">
                <Link to="/ListeDons" className="block px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded">Don</Link>
                <Link to="/recuperation" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300">Récupération</Link>
              </nav>
            </>
          )}
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 -mt-5 ml-6 mr-10">
          <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Liste des Dons</h2>
            <Link to="/archives" className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
              <FiArchive size={20} />
              <span className="text-sm font-medium">Archives</span>
            </Link>
          </div>

            {loading ? (
              <div className="text-center py-10 text-blue-600 font-semibold animate-pulse">Chargement des dons...</div>
            ) : (
              <div className="space-y-6">
                {[...dons].reverse().map((don) => {
                  const isOwner = user && user._id === don.userId;

                  return (
                    <div key={don._id} className="border p-4 rounded-xl shadow-sm flex items-start space-x-4 hover:bg-gray-50 relative">
                      {don.url_image && (
                        <img
                          src={`https://diapo-app.onrender.com/${don.url_image}`}
                          alt={don.titre || 'Image du don'}
                          className="w-28 h-28 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{don.titre || 'Titre non disponible'}</h3>
                        <p className="text-sm text-gray-600 mt-1">{don.description || 'Aucune description fournie.'}</p>
                        <p className="text-sm text-gray-500 italic mt-1">
                          {don.categorie || 'Catégorie inconnue'} — {don.ville_don || 'Ville non précisée'}
                        </p>
                      </div>

                      {isOwner && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === don._id ? null : don._id)}
                            className="text-gray-600"
                          >
                            <FiMoreVertical size={20} />
                          </button>

                          {activeMenuId === don._id && (
                            <div className="absolute right-0 top-6 bg-white border shadow-md rounded-md z-10">
                              <button
                                onClick={() => handleEdit(don._id)}
                                className="px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center space-x-2"
                              >
                                <FiEdit />
                                <span>Modifier</span>
                              </button>
                              <button
                                onClick={() => handleDelete(don._id)}
                                className=" px-4 py-2 hover:bg-gray-100 w-full text-left text-gray-900 flex items-center space-x-2"
                              >
                                <FiTrash2 />
                                <span>Supprimer</span>
                              </button>
                              <button
                                onClick={() => handleArchive(don._id)}
                                className=" px-4 py-2 hover:bg-gray-100 w-full text-left text-gray-900 flex items-center space-x-2"
                              >
                                <FiArchive />
                                <span>Archiver</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
