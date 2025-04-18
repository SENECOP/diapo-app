import { useParams } from "react-router-dom"; // pour lire l'ID depuis l'URL
import { useEffect, useState } from "react";
import axios from "axios"; // pour appeler l'API

const DonDetails = () => {
  const { id } = useParams();
  const [don, setDon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dons/${id}`)
      .then((res) => setDon(res.data))
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

      <h1 className="text-2xl font-bold mb-2">{don.titre || "Titre non disponible"}</h1>
      <p className="mb-2 text-gray-700"><strong>Description :</strong> {don.description}</p>
      <p className="mb-2 text-gray-700"><strong>Catégorie :</strong> {don.categorie}</p>
      <p className="mb-2 text-gray-700"><strong>Ville :</strong> {don.ville_don}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Profil du donneur</h2>
      <p><strong>Pseudo :</strong> {don.utilisateur?.pseudo || "Inconnu"}</p>
      <p><strong>Adresse :</strong> {don.utilisateur?.adresse || "Non renseignée"}</p>
      <p><strong>Email :</strong> {don.utilisateur?.email || "Non disponible"}</p>

      <a
        href={`mailto:${don.utilisateur?.email}`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Contacter le donneur
      </a>
    </div>
  );
};

export default DonDetails;
