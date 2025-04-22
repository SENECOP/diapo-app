const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  // S'assurer que le header commence par "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Format de token invalide (Bearer attendu)' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token mal formé' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    console.log('✅ Utilisateur décodé :', decoded);
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
