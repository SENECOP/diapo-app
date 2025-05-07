import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreerDon = () => {

  const fileInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [existingImage, setExistingImage] = useState(null);
  const [user, setUser] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    description: '',
    ville_don: '',
    url_image: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  
    }

    if (id) {
      axios.get(`https://diapo-app.onrender.com/api/dons/${id}`)
        .then((res) => {
          const don = res.data;
          setFormData({
            titre: don.titre || '',
            categorie: don.categorie || '',
            description: don.description || '',
            ville_don: don.ville_don || '',
            url_image: null,
          });
          setExistingImage(don.url_image);
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
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    const champsManquants = [];
    if (!formData.titre) champsManquants.push("le titre");
    if (!formData.description) champsManquants.push("la description");
    if (!formData.categorie) champsManquants.push("la catégorie");
    if (!formData.ville_don) champsManquants.push("la ville");
  
    if (champsManquants.length > 0) {
      alert(`Merci de remplir ${champsManquants.join(', ')}.`);
      return;
    }
  
    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('categorie', formData.categorie);
      data.append('description', formData.description);
      data.append('ville_don', formData.ville_don);
      if (formData.url_image) {
        data.append('url_image', formData.url_image);
      }
  
      if (id) {
        await axios.put(`https://diapo-app.onrender.com/api/dons/${id}`, data);
        alert('Don modifié avec succès');
      } else {
        await axios.post('https://diapo-app.onrender.com/api/dons', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Don créé avec succès');
      }
  
      navigate("/Listedons");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />

      <div className="bg-blue-800 text-white p-27 min-h-[250px] text-l font-semibold flex items-center justify-between">
        
        <span>
          {user ? `Bonjour ${user.pseudo},` : "Bonjour !"} Nous allons vous aider à créer votre annonce.
        </span>
        <img
          src="/assets/Charity1.png" 
          alt=""
          className="w-52 h-53 ml-auto object-cover rounded-full"
          />
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
                  src={`https://diapo-app.onrender.com/${existingImage}`}
                  alt="don"
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
