const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emetteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  don: { type: mongoose.Schema.Types.ObjectId, ref: 'Don' },
  lu: { type: Boolean, default: false },
  date_creation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
