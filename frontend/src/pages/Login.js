import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Updated to useNavigate hook
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from refreshing the page on submit
    const user = { pseudo, password };

    console.log('Données envoyées :', user);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', user);
      alert('Connexion réussie !');
      navigate('/dashboard');  // Redirection avec navigate()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');  // Gestion d'erreur
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Pseudo</label>
        <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
        
        <label>Mot de passe</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
