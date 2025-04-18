const mongoose = require('mongoose');

const donSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    categorie: { type: String, required: true },
    url_image: { type: String, require: true },
    ville_don: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 👈 ceci est essentiel

    statut: { 
      type: String, 
      enum: ['actif', 'reserve', 'archive'], 
      default: 'actif' 
    }
  },
  {
    timestamps: true 
  }

);

module.exports = mongoose.model('Don', donSchema);
