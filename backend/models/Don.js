const donSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    categorie: { type: String, required: true },
    url_image: [String],
    ville_don: { type: String, required: true },

    // ✅ Donateur : 1 seul champ explicite
    donateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ Preneur : un seul utilisateur peut prendre le don
    preneur: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    interesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    vusPar: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },

    archived: { type: Boolean, default: false },

    statut: { 
      type: String, 
      enum: ['actif', 'reserve', 'archive'], 
      default: 'actif' 
    }
  },
  { timestamps: true }
);
