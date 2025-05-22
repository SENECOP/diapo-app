const Message = require('../models/Message');

// Récupérer les messages entre deux utilisateurs pour un don donné
const getMessagesByDonAndUsers = async (req, res) => {
  const { donId, user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      don_id: donId,
      $or: [
        { envoye_par: user1, recu_par: user2 },
        { envoye_par: user2, recu_par: user1 }
      ]
    }).sort({ envoye_le: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error });
  }
};

module.exports = {
  getMessagesByDonAndUsers,
};
