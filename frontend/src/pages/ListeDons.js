import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiMenu, FiX, FiMoreVertical, FiEdit, FiTrash2, FiArchive } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaArrowLeft } from 'react-icons/fa';


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
  if (!user?.id) {
    console.log("user.id absent, pas d'appel à fetchDons");
    return;
  }
  const fetchDons = async () => {
    setLoading(true);
    try {
      const userId = user._id || user.id;
      const response = await axios.get(`https://diapo-app.onrender.com/api/dons?userId=${userId}`);
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
  
      setDons(data);
      console.log("Dons récupérés pour l'utilisateur :", data);
    } catch (error) {
      console.error('Erreur lors de la récupération des dons :', error);
      setDons([]);
    } finally {
      setLoading(false);
      console.log("Chargement terminé");
    }
  };
  
  

  console.log("Appel de fetchDons avec user.id =", user.id);
  fetchDons();
}, [location, user]);  

  
  const handleEdit = (id) => navigate(`/creer-don/${id}`);

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet article ?',
      html: 'Cette action est irréversible.',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-html',
        actions: 'custom-swal-actions',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://diapo-app.onrender.com/api/dons/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          MySwal.fire('Supprimé', 'Don supprimé avec succès.', 'success');
          setDons((prev) => prev.filter((don) => don._id !== id));
        } catch (error) {
          console.error('Erreur lors de la suppression :', error);
          MySwal.fire('Erreur', 'Erreur lors de la suppression', 'error');
        }
      }
    });
  };

  const handleArchive = async (id) => {
    MySwal.fire({
      title: 'Archiver ce don ?',
      showCancelButton: true,
      confirmButtonText: 'Archiver',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `https://diapo-app.onrender.com/api/dons/${id}/archives`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          MySwal.fire('Archivé', 'Don archivé avec succès.', 'success');
          setDons((prev) => prev.filter((don) => don._id !== id));
        } catch (error) {
          console.error('Erreur lors de l\'archivage :', error);
          MySwal.fire('Erreur', 'Erreur lors de l\'archivage', 'error');
        }
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />

      <div className="bg-blue-700 text-white px-10 py-10 flex items-center h-[250px] space-x-4">
      <div className="flex items-center gap-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="p-2 rounded-full bg-white text-blue-700 hover:bg-gray-100 shadow"
        title="Retour au tableau de bord"
      >
        <FaArrowLeft />
      </button>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
    </div>

      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 ${isSidebarOpen ? 'bg-blue-100 w-64' : 'w-10'} relative ml-10`}>
          {!isSidebarOpen ? (
            <button onClick={() => setIsSidebarOpen(true)} className="absolute top-6 left-2 text-blue-700 text-2xl">
              <FiMenu />
            </button>
          ) : (
            <>
              <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-4 text-blue-700 text-2xl">
                <FiX />
              </button>
              <nav className="py-4 mt-10">
                <Link to="/ListeDons" className="block px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">Don</Link>
                <Link to="/recuperation" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-blue-300">Récupération</Link>
              </nav>
            </>
          )}
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 ml-6 mr-10">
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
                {dons.length === 0 ? (
                  <p className="text-gray-500 text-center">Aucun don pour le moment.</p>
                ) : (
                  [...dons].reverse().map((don) => (
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
                      {user && user._id === don.userId && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === don._id ? null : don._id)}
                            className="text-gray-600"
                          >
                            <FiMoreVertical size={20} />
                          </button>
                          {activeMenuId === don._id && (
                            <div className="absolute right-0 top-6 bg-white border shadow-md rounded-md z-10 w-40">
                              <button onClick={() => handleEdit(don._id)} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                <FiEdit />
                                <span>Modifier</span>
                              </button>
                              <button onClick={() => handleDelete(don._id)} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                <FiTrash2 />
                                <span>Supprimer</span>
                              </button>
                              <button onClick={() => handleArchive(don._id)} className="w-full px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                <FiArchive />
                                <span>Archiver</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
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
