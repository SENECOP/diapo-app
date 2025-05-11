const Notification = require("../models/Notification");

const reserverDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id).populate('user');

    if (!don) return res.status(404).json({ message: "Don non trouvé" });

    if (don.statut !== 'actif') {
      return res.status(400).json({ message: "Ce don n'est pas disponible" });
    }

    don.statut = 'reserve';
    don.preneur = req.user._id;
    await don.save();

    // Créer la notification pour le donateur
    await Notification.create({
      destinataire: don.user._id,
      emetteur: req.user._id,
      message: `${req.user.pseudo} a exprimé son intérêt pour votre don "${don.titre}".`,
      don: don._id
    });

    res.status(200).json({ message: "Don réservé et notification envoyée", don });
  } catch (error) {
    console.error("Erreur réservation ou notification :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
