const User = require('../models/User'); // Assure-toi que le chemin est correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { pseudo, email, numero_telephone, ville_residence, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ errors: [{ field: "pseudo", message: "Pseudo et mot de passe sont requis" }] });
  }

  const error = [];

  // Email format basique
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    error.push({ field: "email", message: "Veuillez entrer une adresse email valide." });
  }

  // Numéro de téléphone basique
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (numero_telephone && !phoneRegex.test(numero_telephone)) {
    error.push({ field: "numero_telephone", message: "Merci d’entrer un numéro de téléphone valide." });
  }

  // Vérification pseudo/email existants
  const existingUser = await User.findOne({ $or: [{ email }, { pseudo }] });
  if (existingUser) {
    if (existingUser.pseudo === pseudo) {
      error.push({ field: "pseudo", message: "Ce pseudo est déjà utilisé." });
    }
    if (existingUser.email === email) {
      error.push({ field: "email", message: "Cette adresse email est déjà utilisée." });
    }
  }

  if (error.length > 0) {
    return res.status(400).json({ error });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ pseudo, email, numero_telephone, ville_residence, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur inscrit avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: [{ field: "", message: "Erreur serveur" }] });
  }
};

  
  const login = async (req, res) => {
    const { pseudo, password } = req.body;
  
    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ pseudo });
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
      }
  
      // Générer le token JWT
      const token = jwt.sign(
        { id: user._id, pseudo: user.pseudo },
        process.env.JWT_SECRET || 'diapo-secret-key',
        { expiresIn: '7d' }
      );
  
      // Envoyer la réponse avec le token et les infos utilisateur
      return res.status(200).json({
        message: "Connexion réussie",
        token,
        user: {
          id: user._id,
          pseudo: user.pseudo,
          email: user.email || '',
          numero_telephone: user.numero_telephone || '',
          avatar: user.avatar || '',
          ville_residence: user.ville_residence || '',

        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur lors de la connexion" });
    }
  };
  
  

module.exports = { register, login };
 