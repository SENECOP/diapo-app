const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  don_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Don',
    required: true,
  },
  utilisateur_1: {
    type: String,
    required: true,
  },
  utilisateur_2: {
    type: String,
    required: true,
  },
  cree_le: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

conversationSchema.index({ don_id: 1, utilisateur_1: 1, utilisateur_2: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
