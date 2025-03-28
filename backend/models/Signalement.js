const mongoose = require('mongoose');

const signalementSchema = new mongoose.Schema({
  raison: { type: String, required: true },
  details: { type: String },
  cree_le: { type: Date, default: Date.now },
  statut: { 
    type: String, 
    enum: ['en_attente', 'resolu'], 
    default: 'en_attente' 
  },
  utilisateur_signale_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  utilisateur_signalant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  don_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Don' 
  }
});

module.exports = mongoose.model('Signalement', signalementSchema);
  