const path = require('path');
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require("./config/db.js"); 
const authRoutes = require('./routes/authRoutes'); 
const donRoutes = require('./routes/donRoutes');
const notificationsRoutes = require('./routes/notificationsRoute');
const messageRoute = require('./routes/messageRoute');
const Message = require('./models/Message');



const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
if (!process.env.MONGO_URI) {
  console.error("❌ Erreur : La variable d'environnement MONGODB_URI est introuvable.");
  process.exit(1);
}

app.use(cors({
  origin:  '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
 credentials: false 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/dons', donRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use('/api/messages', messageRoute);

app.use('/uploads', express.static('uploads'));
//app.options('*', cors());



app.get("/", (req, res) => {
  res.send("Backend Diapo fonctionne avec MongoDB !");
}); 

app.post('/', (req, res) => {
  
});

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('✅ Utilisateur connecté :', socket.id);

  socket.on('sendMessage', async (data) => {
    try {
      const { contenu, don_id, envoye_par, recu_par } = data;

      const message = new Message({
        contenu,
        don_id,
        envoye_par,
        recu_par
      });

      await message.save(); // Enregistre en base

      // Renvoie au destinataire
      io.emit('receiveMessage', {
        contenu: message.contenu,
        don_id: message.don_id,
        envoye_par: message.envoye_par,
        recu_par: message.recu_par,
        envoye_le: message.envoye_le,
        _id: message._id
      });

    } catch (error) {
      console.error('❌ Erreur lors de l’enregistrement du message :', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Utilisateur déconnecté :', socket.id);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
