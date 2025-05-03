const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // ← à adapter selon le chemin réel

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token non fourni ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-motdepasse');
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    req.user = user;
    console.log('✅ Utilisateur authentifié :', user);
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = verifyToken;
