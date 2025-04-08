const mongoose = require('mongoose');

const donSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  url_image: { type: String },
  ville_don: { type: String, required: true },
  cree_le: { type: Date, default: Date.now },
  mis_a_jour_le: { type: Date },
  statut: { 
    type: String, 
    enum: ['actif', 'reserve', 'archive'], 
    default: 'actif' 
  }
});

module.exports = mongoose.model('Don', donSchema);