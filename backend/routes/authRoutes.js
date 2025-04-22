const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();
const { login } = require('../controllers/authController');


// ✅ Route d'inscription
router.post('/signup', async (req, res) => {
    try {
        const { pseudo, email, numero_telephone, ville_residence, password } = req.body;

        // Vérification de l'exitence du pseudo
        const userExists = await User.findOne({ pseudo });
        if (userExists) {
            return res.status(400).json({ message: "Ce pseudo est déjà pris" });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        // Créer un nouvel utilisateur
        const user = new User({
            pseudo,
            email,
            numero_telephone,
            ville_residence,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "Compte créé avec succès", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post('/login', login);

// ✅ Route de récupération de mot de passe (email obligatoire)
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Vérifier si l'email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Aucun compte associé à cet email" });
        }

        // Générer un token de réinitialisation
        const resetToken = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });

        // Envoyer l'email avec le token (implémentation avec nodemailer nécessaire)
        console.log(`Lien de réinitialisation : http://localhost:3000/reset-password/${resetToken}`);

        res.json({ message: "Email de réinitialisation envoyé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
