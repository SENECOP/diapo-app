const mongoose = require('mongoose');

const donSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    categorie: { type: String, required: true },
    url_image: { type: String, required: false },
    ville_don: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tu peux garder ce champ si nécessaire
    createur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // AJOUT DU CHAMP createur
    archived: { type: Boolean, default: false },
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
