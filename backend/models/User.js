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

// Méthodes supplémentaires si nécessaire
userSchema.methods = {
  cree_don: function() { /* Implémentation */ },
  reserve_don: function() { /* Implémentation */ }
};

// Hachage du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
    this.password = await bcrypt.hash(this.password, 12);
  });
  
  // Méthode pour comparer les mots de passe
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);