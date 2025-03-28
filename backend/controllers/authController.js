const User = require('../models/User'); // Assure-toi que le chemin est correct
const bcrypt = require('bcrypt');


const register = async (req, res) => {
    const { pseudo, email, numero_telephone, ville_residence, password } = req.body;
  
    if (!password || !pseudo) {
      return res.status(400).json({ message: 'Pseudo et mot de passe sont requis' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Vérifier si l'email ou le pseudo existent déjà
      const existingUser = await User.findOne({ $or: [{ email }, { pseudo }] });
      if (existingUser) {
        return res.status(400).json({ message: "Pseudo ou email déjà utilisé" });
      }
  
      // Créer un nouvel utilisateur
      const newUser = new User({ pseudo, email, numero_telephone, ville_residence, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "Utilisateur inscrit avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
  const login = async (req, res) => {
    const { pseudo, password } = req.body;
  
    console.log('Données reçues:', req.body);
  
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ pseudo });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }
  
    // Comparer le mot de passe fourni avec le mot de passe haché stocké
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Mot de passe envoyé : ${password}`);
    console.log(`Mot de passe haché : ${user.password}`);
  
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }
  
    // Si tout va bien, renvoyer une réponse de succès avec les données de l'utilisateur
    res.status(200).json({ message: 'Connexion réussie', user: user });
  
    console.log(req.body);
  };
  
  

module.exports = { register, login };
 