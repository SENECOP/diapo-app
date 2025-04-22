import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaEdit } from 'react-icons/fa';

const Profil = () => {
  const { user, logout, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);


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

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

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
      // Traitement backend
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
    <div>


        <div className="bg-blue-700 text-white px-10 py-24 relative">
          <Link
            to="/"
            className="absolute left-10 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-200 transition-transform hover:-translate-x-1"
          >
            ←
          </Link>
          <h1 className="text-3xl font-semibold text-center">Profil</h1>
        </div>
      <div className="flex justify-center mt-[-40px]">
        <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-2xl relative">

          {user ? (
            <>
              {/* Photo + bouton modifier */}
              <div className="flex justify-center mb-4 relative">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.pseudo)}`}
                  alt="Avatar utilisateur"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                />
                
                {/* Icône caméra pour changer photo */}
                <button
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-[42%] bg-yellow-400 rounded-full p-2 hover:bg-yellow-500"
                  title="Changer la photo"
                >
                  <img src="/camera-icon.png" alt="Avatar" className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Petit bouton modifier */}
                {!isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="absolute top-0 right-0 text-gray-800 p-2"
                    title="Modifier profil"
                  >
                    <FaEdit size={18} />
                  </button>
                )}
              </div>

              {/* Formulaire d'infos */}
              <form className="space-y-4">
                {['pseudo', 'email', 'numero_telephone', 'ville_residence'].map((field, index) => (
                  <div key={index}>
                    <label className="text-sm text-gray-600 capitalize">
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

              {/* Bouton enregistrer */}
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

              {/* Bouton déconnexion */}
              <div className="text-center mt-4">
                <button
                  onClick={handleLogout}
                  className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-400 transition"
                >
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <p className="text-red-500 text-center">
              Vous devez être connecté(e) pour accéder à votre profil.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profil;
