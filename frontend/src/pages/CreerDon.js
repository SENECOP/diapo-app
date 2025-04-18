import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreerDon = () => {
  const fileInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // ID du don à modifier
  const [existingImage, setExistingImage] = useState(null);

  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    description: '',
    ville_don: '',
    url_image: null,
  });

  // Chargement des données si en mode édition
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/dons/${id}`)
        .then((res) => {
          const don = res.data;
          setFormData({
            titre: don.titre || '',
            categorie: don.categorie || '',
            description: don.description || '',
            ville_don: don.ville_don || '',
            url_image: null, // L'utilisateur peut choisir de modifier ou non l'image
          });
          setExistingImage(don.url_image); // Conserver le nom de l'image
        })
        .catch((err) => {
          console.error('Erreur lors du chargement du don à modifier :', err);
        });
    }
  }, [id]);

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      url_image: file,
    }));
    setExistingImage(null); // Supprimer l'image existante affichée
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titre || !formData.categorie || !formData.ville_don) {
      alert('Tous les champs doivent être remplis');
      return;
    }

    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('categorie', formData.categorie);
    data.append('description', formData.description);
    data.append('ville_don', formData.ville_don);

    if (formData.url_image) {
      data.append('url_image', formData.url_image);
    }

    try {
      if (id) {
        // 🔄 Mode modification
        await axios.put(`http://localhost:5000/api/dons/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Don modifié avec succès');
      } else {
        // ➕ Mode création
        await axios.post(`${process.env.REACT_APP_API_URL}/api/dons`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Don créé avec succès');
      }

      navigate('/ListeDons');
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />

      <div className="bg-blue-800 text-white p-24 min-h-[350px] text-xl font-semibold">
        {id ? "Modifier votre annonce" : "Bonjour ! Nous allons vous aider à créer votre première annonce."}
      </div>

      <main className="flex justify-center py-10 mt-[-110px]">
        <form onSubmit={handleSubmit} className="bg-white p-10 shadow-lg rounded-md w-full max-w-2xl space-y-6">
          <div>
            <label className="block font-semibold mb-1">Titre</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Entrer le titre de l'annonce"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Catégorie</label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Choisir une catégorie</option>
              <option value="Technologie">Technologie</option>
              <option value="Vêtements">Vêtements</option>
              <option value="Meubles">Meubles</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              maxLength="300"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Décrivez votre don..."
            ></textarea>
            <p className="text-sm text-gray-400 text-right">300 caractères max</p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Adresse</label>
            <input
              type="text"
              name="ville_don"
              value={formData.ville_don}
              onChange={handleChange}
              placeholder="Entrer votre adresse"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Image</label>
            <button
              type="button"
              onClick={handleClick}
              className="bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200"
            >
              Choisir une image
            </button>
            <input
              type="file"
              ref={fileInput}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {formData.url_image && (
              <p className="mt-2 text-sm text-green-600">{formData.url_image.name} sélectionné</p>
            )}
            {existingImage && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Image actuelle :</p>
                <img
                  src={`http://localhost:5000/uploads/${existingImage}`}
                  alt="Image actuelle"
                  className="w-full max-w-xs rounded"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {id ? "Modifier le don" : "Publier"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreerDon;
