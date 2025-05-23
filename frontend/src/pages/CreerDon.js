import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const CreerDon = () => {
  const fileInput = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [existingImages, setExistingImages] = useState([]);
  const [user, setUser] = useState('');
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    description: '',
    ville_don: '',
    images: [],
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
            images: [], // Reset images array
          });
          setExistingImages(don.images || []);
        })
        .catch((err) => {
          console.error('Erreur lors du chargement du don à modifier :', err);
        });
    }
  }, [id]);

  const handleClick = () => {
    fileInput.current.click();
  };
  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setImages(files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const validImages = files.filter((file) => file.type.startsWith('image/'));
  if (validImages.length !== files.length) {
    Swal.fire({
      icon: 'error',
      title: 'Fichiers invalides',
      text: 'Veuillez sélectionner uniquement des fichiers image.',
    });
    return;
  }

  setImages((prev) => [...prev, ...validImages]);
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
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: `Merci de remplir ${champsManquants.join(', ')}.`,
      });
      return;
    }

    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('categorie', formData.categorie);
      data.append('description', formData.description);
      data.append('ville_don', formData.ville_don);

      images.forEach((image) => {
        data.append('images', image); // "images" est un tableau de fichiers
      });
      
      if (id) {
        await axios.put(`https://diapo-app.onrender.com/api/dons/${id}`, data);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Don modifié avec succès',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await axios.post('https://diapo-app.onrender.com/api/dons', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Don créé avec succès',
          confirmButtonColor: '#2563eb'
        });
      }

      navigate("/Listedons");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col justify-between">
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
            <label className="block font-semibold mb-1">Images</label>
            <button
              type="button"
              onClick={handleClick}
              className="bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200"
            >
              Choisir des images
            </button>
            <input
              type="file"
              ref={fileInput}
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }}
            />
            {images.length > 0 &&  (
              <div className="mt-2">
                {formData.images.map((image, index) => (
                  <p key={index} className="text-sm text-green-600">{image.name} sélectionné</p>
                ))}
              </div>
            )}
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Images actuelles :</p>
                <div className="flex space-x-2">
                  {existingImages.map((image, index) => (
                    <img
                      key={index}
                      src={`https://diapo-app.onrender.com/${image}`}
                      alt={`Don  ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
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
