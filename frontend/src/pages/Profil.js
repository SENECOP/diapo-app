import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header'; // À créer si ce n’est pas encore fait
import { FaEdit } from 'react-icons/fa';
import { MdCameraAlt } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa';


const Profil = () => {
  const { user, logout, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        pseudo: user.pseudo || '',
        numero_telephone: user.numero_telephone || '',
        email: user.email || '',
        ville_residence: user.ville_residence || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Photo sélectionnée :", file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      {/* Bande bleue avec photo et titre */}
      <div className="bg-blue-700 text-white px-10 py-16 relative flex items-center gap-6">
        <div className="absolute left-10 bottom-[-40px]">
        <div className="relative">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.pseudo)}`}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
          />

          {/* Bouton caméra */}
          <button
            onClick={handlePhotoClick}
            className="absolute bottom-0 left-0 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100"
            title="Changer la photo"
          >
            <MdCameraAlt className="text-black w-4 h-4" />
          </button>

          {/* Bouton modifier */}
          <button
            onClick={handleEditToggle}
            className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full shadow hover:bg-yellow-500"
            title="Modifier profil"
          >
            <FaEdit className="text-white w-4 h-4" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        </div>
        <div className="flex items-center h-[150px] gap-4 ">
  <button
    onClick={() => navigate('/dashboard')}
    className="p-2 rounded-full bg-white  text-blue-700 hover:bg-gray-100 shadow"
    title="Retour au tableau de bord"
  >
    <FaArrowLeft />
  </button>
  <h1 className="text-3xl font-semibold">Profile</h1>
</div>      </div>

      {/* Formulaire centré */}
      <div className="flex justify-center px-4 -mt-16">
      <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-2xl relative mt-10">
        <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-6">Info personnel</h2>

          <form className="space-y-4">
            {['pseudo', 'email', 'numero_telephone', 'ville_residence'].map((field, index) => (
              <div key={index}>
                <label className="block text-sm text-gray-600 capitalize mb-1">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  disabled={!isEditing}
                  className={`w-full border px-4 py-2 rounded-md ${isEditing ? 'bg-white border-blue-400' : 'bg-gray-100 border-gray-300'}`}
                />
              </div>
            ))}
          </form>

          {/* Boutons */}
          {isEditing && (
            <div className="text-center mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Enregistrer
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              onClick={handleLogout}
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-400 transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Profil;
