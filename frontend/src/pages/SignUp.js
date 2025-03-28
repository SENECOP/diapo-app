import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Pour la navigation

const SignUp = () => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [numero_telephone, setNumeroTelephone] = useState('');
  const [ville_residence, setVilleResidence] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Pour la redirection vers la page de connexion

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Vérifier que le pseudo et mot de passe sont renseignés
    if (!pseudo || !password) {
      setError('Le pseudo et le mot de passe sont obligatoires.');
      return;
    }

    const newUser = { pseudo, email, numero_telephone, ville_residence, password };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', newUser);
      alert(response.data.message);  // Message de succès
      navigate('/login');  // Redirection vers la page de connexion
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');  // Gestion d'erreur
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Pseudo <span style={{ color: 'red' }}>*</span>
        </label>
        <input 
          type="text" 
          value={pseudo} 
          onChange={(e) => setPseudo(e.target.value)} 
          required 
        />

        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <label>Numéro de téléphone </label>
        <input 
          type="text" 
          value={numero_telephone} 
          onChange={(e) => setNumeroTelephone(e.target.value)} 
        />

        <label>Ville de résidence</label>
        <input 
          type="text" 
          value={ville_residence} 
          onChange={(e) => setVilleResidence(e.target.value)} 
        />

        <label>
          Mot de passe <span style={{ color: 'red' }}>*</span>
        </label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default SignUp;
