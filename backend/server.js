const path = require('path');
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require("./config/db.js"); 
const authRoutes = require('./routes/authRoutes'); 
const donRoutes = require('./routes/donRoutes');
const notificationsRoutes = require('./routes/notificationsRoute');
const messageRoute = require('./routes/messageRoute');
const Message = require('./models/Message');
const Conversation = require('./models/conversation');
const conversationRoutes = require('./routes/conversationRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

if (!process.env.MONGO_URI) {
  console.error("❌ Erreur : La variable d'environnement MONGODB_URI est introuvable.");
  process.exit(1);
}

app.use(cors({
  origin: '*',
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
app.use('/api/conversations', conversationRoutes);


app.get("/", (req, res) => {
  res.send("Backend Diapo fonctionne avec MongoDB !");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('🟢 Un client est connecté :', socket.id);

  // ✅ Gérer la connexion de l'utilisateur (pseudo)
  socket.on("userConnected", (pseudo) => {
    connectedUsers[pseudo] = socket.id;
    console.log("👤 Utilisateur connecté :", pseudo, socket.id);
  });

  // ✅ Gérer l'envoi d'un message
  socket.on('sendMessage', async (message) => {
    console.log('📨 Nouveau message reçu :', message);

    try {

      let conversation = await Conversation.findOne({
        participants: { $all: [message.envoye_par, message.recu_par] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [message.envoye_par, message.recu_par],
        });
      }

      const savedMessage = await Message.create({
        contenu: message.contenu,
        don_id: message.don_id,
        envoye_par: message.envoye_par,
        recu_par: message.recu_par,
        conversation: conversation._id,
        envoye_le: new Date(),
      });


      console.log("✅ Message sauvegardé dans MongoDB :", savedMessage);

      const destinataireSocketId = connectedUsers[message.recu_par];
      if (destinataireSocketId) {
        io.to(destinataireSocketId).emit('receiveMessage', savedMessage);
        console.log("📤 Message envoyé à", message.recu_par, "via socket", destinataireSocketId);
      } else {
        console.log("⚠️ Destinataire", message.recu_par, "non connecté.");
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du message :', error.message);
    }
  });

  // ✅ Déconnexion
  socket.on('disconnect', () => {
    for (const pseudo in connectedUsers) {
      if (connectedUsers[pseudo] === socket.id) {
        console.log(`👋 ${pseudo} (${socket.id}) déconnecté`);
        delete connectedUsers[pseudo];
        break;
      }
    }

    console.log('🔌 Un client s’est déconnecté :', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur (avec WebSocket) démarré sur le port ${PORT}`);
});
