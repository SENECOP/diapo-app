import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import du UserContext

const Login = () => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext); // Accéder à setUser du UserContext
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Si le pseudo est passé par la redirection, le pré-remplir
    if (location.state?.pseudo) {
      setPseudo(location.state.pseudo);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { pseudo, password };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', user);
      const loggedInUser = response.data.user;

      // Sauvegarde dans le contexte et dans le localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      // Redirection vers le Dashboard
      navigate('/Dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Ce pseudo n'a pas de compte, créer un compte.");
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Partie Gauche : Logo, Texte, Image */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white text-white p-8">
        {/* Logo */}
        <img src="/logo_diapo.png" alt="Logo" className="absolute top-4 left-4 max-w-[150px]" />

        <p className="text-lg text-center text-gray-950 mb-6">
          "Ensemble, partageons l’espoir et semons la générosité : chaque don, aussi petit soit-il, change une vie."
        </p>

        {/* Image d'illustration */}
        <img src="/assets/charity1.png" alt="Illustration" className="w-3/4 max-w-md" />
      </div>

      {/* Partie Droite : Formulaire de Connexion */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Se connecter</h2>

        {error && <p className="text-gray-900 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 w-full max-w-md">
          <div>
            <label className="block text-gray-700">Pseudo <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              autoComplete="off"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={pseudo} 
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              autoComplete="off"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Se connecter
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Vous n'avez pas de compte ? <a href="/signup" className="text-blue-500 hover:underline">Créer un compte</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
