import { useParams } from "react-router-dom"; // pour lire l'ID depuis l'URL
import { useEffect, useState } from "react";
import axios from "axios"; // pour appeler l'API
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';




const DonDetails = () => {
  const { id } = useParams();
  const [don, setDon] = useState(null);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();


  const handleEdit = () => {
    navigate(`/creer-don/${don._id}`); // Redirige vers la page avec l'ID du don
  };
  

  const handleDelete = async () => {
    console.log("ID à supprimer :", don._id);
     // Désactive temporairement la règle ESLint pour cette ligne
    /* eslint-disable-next-line no-restricted-globals */
    if (confirm("Voulez-vous vraiment supprimer ce don ?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/dons/${don._id}`);
        console.log("Résultat suppression :", res.data);
        alert('Don supprimé avec succès');
        navigate('/');
      } catch (error) {
        console.error('Erreur suppression côté React :', error.response?.data || error.message);
        alert('Erreur lors de la suppression');
      }
    }
  };
  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/dons/${id}`)
      .then((res) => {
        console.log('Données du don:', res.data);  // Assure-toi que user est bien inclus
        setDon(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du don", err);
        setError('Détails du don non trouvés.');
      });
  }, [id]);

  if (error) return <div className="p-6">{error}</div>;
  if (!don) return <div className="p-6">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      
      <img
        src={`http://localhost:5000/uploads/${don.url_image}`}
        alt={don.titre || "Image du don"}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <button onClick={() => setShowMenu(!showMenu)} className="absolute top-2 right-2">
        <FiMoreVertical size={24} />
      </button>
      {showMenu && (
        <div className="absolute top-10 right-2 bg-white border shadow-md rounded-md z-10">
          <button onClick={handleEdit} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">Modifier</button>
          <button onClick={handleDelete} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">Supprimer</button>
        </div>
      )}


      <h1 className="text-2xl font-bold mb-2">{don.titre || "Titre non disponible"}</h1>
      <p className="mb-2 text-gray-700"><strong>Description :</strong> {don.description}</p>
      <p className="mb-2 text-gray-700"><strong>Catégorie :</strong> {don.categorie}</p>
      <p className="mb-2 text-gray-700"><strong>Ville :</strong> {don.ville_don}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Profil du donneur</h2>
      <p><strong>Pseudo :</strong> {don.user?.pseudo || "Inconnu"}</p>
      <p><strong>ville_residence :</strong> {don.user?.ville_residence || "Non renseignée"}</p>
      <p><strong>Email :</strong> {don.user?.email || "Non disponible"}</p>

      <a
        href={`mailto:${don.user?.email}`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Contacter le donneur
      </a>
    </div>
  );
};

export default DonDetails;
