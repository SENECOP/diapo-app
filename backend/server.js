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
const allowedOrigins = [
  'http://localhost:3000',
  'https://diapo-app.netlify.app',
  'https://6807e3441990cc5285c01a17--diapo-app.netlify.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS bloqué :', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ... tes routes ici

app.listen(5000, () => {
  console.log("Serveur démarré sur le port 5000");
});

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

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
