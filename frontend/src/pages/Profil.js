import React, { useContext, useRef, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { MdCameraAlt } from 'react-icons/md';


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
    <div className="bg-gray-100 min-h-screen flex flex-col relative">
      <Header />

      {/* Bande bleue */}
      <div className="bg-blue-700 text-white px-10 pt-10 pb-36 relative z-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full bg-white text-blue-700 hover:bg-gray-100 shadow"
          title="Retour au tableau de bord"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-semibold mt-4">Profile</h1>
      </div>

      {/* Contenu principal */}
      <div className="-mt-12 px-6 flex gap-6 relative z-10 items-stretch min-h-[500px]">
        {/* Sidebar */}
        <div className="w-64 bg-blue-100 rounded-md shadow p-4 flex flex-col justify-between h-full">
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profil')}
              className="text-left px-4 py-2 rounded hover:bg-blue-200 bg-blue-300 text-blue-900 font-medium"
            >
              Info personnel
            </button>
            <button
              onClick={() => navigate('/listedons')}
              className="text-left px-4 py-2 rounded hover:bg-blue-200 text-blue-900"
            >
              Dashboard
            </button>
          </nav>
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full border border-red-400 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white shadow-lg rounded-md p-8 flex-1 h-full">
          {/* Avatar centré */}
          <div className="flex justify-center mt-5 mb-6">
            <div className="relative w-24 h-24">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.pseudo)}`}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <button
                onClick={handlePhotoClick}
                className="absolute bottom-0 left-0 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100"
                title="Changer la photo"
              >
                <MdCameraAlt className="text-black w-4 h-4" />
              </button>
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
                  className={`w-full border px-4 py-2 rounded-md ${
                    isEditing ? 'bg-white border-blue-400' : 'bg-gray-100 border-gray-300'
                  }`}
                />
              </div>
            ))}
          </form>

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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profil;
