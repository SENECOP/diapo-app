const User = require('../models/User'); // Vérifie le chemin
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clé secrète pour le JWT (à stocker dans un .env en prod)
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const register = async (req, res) => {
  const { pseudo, email, numero_telephone, ville_residence, password } = req.body;
  const errors = [];

  if (!pseudo || !password || !ville_residence) {
    return res.status(400).json({
      errors: [{ field: 'general', message: 'Les champs obligatoires doivent être remplis.' }],
    });
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Veuillez entrer une adresse email valide.' });
  }

  // Validation téléphone
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (numero_telephone && !phoneRegex.test(numero_telephone)) {
    errors.push({ field: 'numero_telephone', message: 'Merci d’entrer un numéro de téléphone valide.' });
  }

  // Vérification pseudo / email déjà utilisé
  const existingUser = await User.findOne({ $or: [{ email }, { pseudo }] });
  if (existingUser) {
    if (existingUser.pseudo === pseudo) {
      errors.push({ field: 'pseudo', message: 'Ce pseudo est déjà utilisé.' });
    }
    if (existingUser.email === email) {
      errors.push({ field: 'email', message: 'Cette adresse email est déjà utilisée.' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      pseudo,
      email,
      numero_telephone,
      ville_residence,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errors: [{ field: '', message: 'Une erreur serveur est survenue.' }],
    });
  }
};

const login = async (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({
      errors: [{ field: 'general', message: 'Pseudo et mot de passe requis.' }],
    });
  }

  try {
    const user = await User.findOne({ pseudo });
    if (!user) {
      return res.status(400).json({
        errors: [{ field: 'pseudo', message: 'Aucun utilisateur trouvé avec ce pseudo.' }],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [{ field: 'password', message: 'Mot de passe incorrect.' }],
      });
    }

    const token = jwt.sign(
      { id: user._id, pseudo: user.pseudo },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        numero_telephone: user.numero_telephone,
        ville_residence: user.ville_residence,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errors: [{ field: '', message: 'Erreur serveur lors de la connexion.' }],
    });
  }
};

module.exports = {
  register,
  login,
};
