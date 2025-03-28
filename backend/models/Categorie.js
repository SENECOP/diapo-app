const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Categorie', categorieSchema);
  