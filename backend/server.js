const path = require('path');
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js"); 
const authRoutes = require('./routes/authRoutes'); 
const donRoutes = require('./routes/donRoutes');



const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
if (!process.env.MONGO_URI) {
  console.error("❌ Erreur : La variable d'environnement MONGODB_URI est introuvable.");
  process.exit(1);
}

 // Connexion à la base de données MongoDB

 app.use(cors({
  origin: 'https://ton-site.netlify.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/dons', donRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Test route
app.get("/", (req, res) => {
  res.send("Backend Diapo fonctionne avec MongoDB !");
}); 

app.post('/', (req, res) => {
  
});


app.listen(5000, '0.0.0.0', () => {
  console.log("Serveur backend lancé sur le port 5000");
});
