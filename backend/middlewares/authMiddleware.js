const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Format de token invalide (Bearer attendu)' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token mal formé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔁 On va chercher l'utilisateur complet depuis la DB
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user; // 🧠 On stocke l'utilisateur dans la requête
    next();
  } catch (err) {
    console.error('Erreur de vérification de token:', err);
    return res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = verifyToken;
