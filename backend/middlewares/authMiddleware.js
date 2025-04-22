const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  // Vérifie que le token commence par "Bearer"
  const bearerToken = token.split(' ')[1];
  if (!bearerToken) {
    return res.status(401).json({ message: 'Token mal formé' });
  }

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    req.user = decoded; // Ajoute l'utilisateur au request object
    next();
  });
}
