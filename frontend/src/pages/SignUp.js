import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const SignUp = () => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [numero_telephone, setNumeroTelephone] = useState('');
  const [ville_residence, setVilleResidence] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.pseudo) {
      setPseudo(location.state.pseudo);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les erreurs à chaque soumission
    setError({});

    if (!pseudo || !password || !ville_residence) {
      setError({ general: 'Les champs obligatoires doivent être remplis.' });
      return;
    }

    if (password !== confirmPassword) {
      setError({ confirmPassword: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    const newUser = { pseudo, email, numero_telephone, ville_residence, password };

    try {
      await axios.post('https://diapo-app.onrender.com/api/auth/signup', newUser);
      navigate('/login');
    } catch (err) {
      console.log('Erreur signup backend:', err.response?.data);

      const apiErrors = err.response?.data?.errors || [];
      const errorObj = {};
      apiErrors.forEach((err) => {
        errorObj[err.field] = err.message;
      });
      setError(errorObj);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Partie Gauche */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white text-white p-8">
        <img src="/logo_diapo.png" alt="Logo" className="absolute top-4 left-4 max-w-[150px]" />
        <p className="text-lg text-center text-gray-950 mb-6">
          "Ensemble, partageons l’espoir et semons la générosité : chaque don, aussi petit soit-il, change une vie."
        </p>
        <img src="/assets/charity1.png" alt="Illustration" className="w-3/4 max-w-md" />
      </div>

      {/* Partie Droite */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          {error.general && (
            <p className="text-red-600 text-sm text-center">{error.general}</p>
          )}

          <div>
            <label className="block text-gray-700">Pseudo <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
            {error.pseudo && <p className="text-red-600 text-sm mt-1">{error.pseudo}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <p className="text-red-600 text-sm mt-1">{error.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Numéro de téléphone</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={numero_telephone}
              onChange={(e) => setNumeroTelephone(e.target.value)}
            />
            {error.numero_telephone && <p className="text-red-600 text-sm mt-1">{error.numero_telephone}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Ville de résidence <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={ville_residence}
              onChange={(e) => setVilleResidence(e.target.value)}
              required
            />
            {error.ville_residence && <p className="text-red-600 text-sm mt-1">{error.ville_residence}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>

            {error.password && <p className="text-red-600 text-sm mt-1">{error.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Confirmer le mot de passe <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>

            {error.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{error.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Créer un compte
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Vous avez déjà un compte ? <a href="/login" className="text-blue-500 hover:underline">Connexion</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
