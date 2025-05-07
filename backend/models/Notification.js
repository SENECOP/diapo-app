const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  emetteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  don: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Don",
    default: null
  },
  vu: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
