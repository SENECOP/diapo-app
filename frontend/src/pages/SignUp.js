import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const SignUp = () => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [numero_telephone, setNumeroTelephone] = useState('');
  const [ville_residence, setVilleResidence] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Vérifier si le pseudo est passé par la redirection
    if (location.state && location.state.pseudo) {
      setPseudo(location.state.pseudo); // Pré-remplir le pseudo dans le formulaire
    }
  }, [location.state]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!pseudo || !password || !ville_residence) {
      setError('Les champs obligatoires doivent être remplis.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
  
    const newUser = { pseudo, email, numero_telephone, ville_residence, password };
  
    try {
      await axios.post('http://localhost:5000/api/auth/signup', newUser);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription.');
    }
  };

  
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Partie Gauche : Logo, Texte, Image */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white text-white p-8">
        {/* Logo */}
        <img src="/logo_diapo.png" alt="Logo" className="absolute top-4 left-4 max-w-[150px]" />

        <p className="text-lg text-center text-gray-950 mb-6">"Ensemble, partageons l’espoir et semons la générosité : chaque don, aussi petit soit-il, change une vie." </p>

        {/* Image d'illustration */}
        <img src="/assets/charity1.png" alt="Illustration" className="w-3/4 max-w-md" />
      </div>

      {/* Partie Droite : Formulaire */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">  Créer un compte</h2>

        {error && <p className="text-gray-900 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          <div>
            <label className="block text-gray-700">Pseudo <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={pseudo} 
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700">Numéro de téléphone</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={numero_telephone} 
              onChange={(e) => setNumeroTelephone(e.target.value)}
            />
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
          </div>

          <div>
            <label className="block text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirmer le mot de passe <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
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
