const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  email: {type: String, required: false, unique: true, sparse: true},
  numero_telephone: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  ville_residence: { type: String, required: false },
  verifie: { type: Boolean, default: false },
  cree_le: { type: Date, default: Date.now }
});




module.exports = mongoose.model('User', userSchema);
