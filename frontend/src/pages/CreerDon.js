import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import axios from 'axios';
const formData = new FormData();

const CreerDon = () => {
  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    description: '',
    ville_don: '',
    url_image: null,
  });

  // Fonction pour mettre à jour l'état local
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fonction pour gérer le changement de l'image
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      url_image: e.target.files[0],
    });
  };

formData.append('image', fileInput.files[0]); // 'image' doit être le même que dans Multer

axios.post('http://localhost:5000/upload', formData)
  .then(response => {
    console.log('Fichier téléchargé avec succès:', response.data);
  })
  .catch(error => {
    console.error('Erreur lors du téléchargement:', error);
  });
  
  // Fonction pour envoyer le formulaire
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    
  // Vérifier que tous les champs sont remplis
  if (!formData.titre || !formData.categorie|| !formData.ville_don) {
    alert('Tous les champs doivent être remplis');
    return;
  }

  // Vérifier que l'image est bien sélectionnée si nécessaire
  if (!formData.url_image) {
    alert('Veuillez télécharger une image');
    return;
  }
    // Créer un FormData pour envoyer le fichier
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('categorie', formData.categorie);
    data.append('description', formData.description);
    data.append('adresse', formData.ville_don);
    data.append('image', formData.url_image);

    try {
      // Envoi de la requête POST pour créer un don
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/dons`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Don créé avec succès:', response.data);
        // Ajouter ici une action après la réussite (ex: redirection ou message de succès)
      }
    } catch (error) {
      console.error('Erreur lors de la création du don:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />

      {/* Bandeau bleu */}
      <div className="bg-blue-800 text-white p-24 min-h-[350px] text-xl font-semibold">
        Bonjour ! Nous allons vous aider à créer votre première annonce.
      </div>

      {/* Formulaire de création */}
      <main className="flex justify-center py-10 mt-[-110PX]"> 
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
              maxLength="500"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Décrivez votre don..."
            ></textarea>
            <p className="text-sm text-gray-400 text-right">300 caractères max</p>
          </div>

          <div>
            <label className="block font-semibold mb-1"> Adresse</label>
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
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Publier
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreerDon;
