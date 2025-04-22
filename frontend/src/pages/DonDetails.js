import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiMoreVertical } from 'react-icons/fi';

const DonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [don, setDon] = useState(null);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem('token'); // si tu utilises un token

  const handleEdit = () => {
    if (don?._id) {
      navigate(`/creer-don/${don._id}`);
    }
  };

  const handleDelete = async () => {
    if (!don?._id) return;

    if (window.confirm("Voulez-vous vraiment supprimer ce don ?")) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:5000/api/dons/${don._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Don supprimé avec succès');
        navigate('/ListeDons'); // Redirection vers la liste
      } catch (error) {
        console.error('Erreur lors de la suppression :', error.response?.data || error.message);
        alert('Erreur lors de la suppression');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dons/${id}`)
      .then((res) => {
        setDon(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du don :", err);
        setError("Détails du don non trouvés.");
      });
  }, [id]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!don) return <div className="p-6">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-6 relative">
      {don.url_image && (
        <img
          src={`http://localhost:5000/${don.url_image}`}
          alt={don.titre || "don"}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <button onClick={() => setShowMenu(!showMenu)} className="absolute top-2 right-2">
        <FiMoreVertical size={24} />
      </button>

      {showMenu && (
        <div className="absolute top-10 right-2 bg-white border shadow-md rounded-md z-10">
          <button
            onClick={handleEdit}
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
          >
            Modifier
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 disabled:opacity-50"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">{don.titre || "Titre non disponible"}</h1>
      <p className="mb-2 text-gray-700"><strong>Description :</strong> {don.description}</p>
      <p className="mb-2 text-gray-700"><strong>Catégorie :</strong> {don.categorie}</p>
      <p className="mb-2 text-gray-700"><strong>Ville :</strong> {don.ville_don}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Profil du donneur</h2>
      <p><strong>Pseudo :</strong> {don.user?.pseudo || "Inconnu"}</p>
      <p><strong>Ville de résidence :</strong> {don.user?.ville_residence || "Non renseignée"}</p>
      <p><strong>Email :</strong> {don.user?.email || "Non disponible"}</p>

      {don.user?.email && (
        <a
          href={`mailto:${don.user.email}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Contacter le donneur
        </a>
      )}
    </div>
  );
};

export default DonDetails;