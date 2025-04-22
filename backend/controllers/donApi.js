const Don = require('../models/Don');


const createDon = async (req, res) => {
  try {
    const { titre, description, categorie, ville_don } = req.body;
    const imageFilename = req.file?.filename || '';

    const newDon = new Don({
      titre,
      description,
      categorie,
      ville_don,
      url_image: imageFilename,
    });

    await newDon.save();
    res.status(200).json({ message: 'Don créé avec succès', Don: newDon });
  } catch (error) {
    console.error('Erreur lors de la création du don:', error);
    res.status(500).json({ message: error.message });
  }
};


const getDons = async (req, res) => {
  const { categorie } = req.query;
  const dons = await Don.find().sort({ createdAt: -1 });


  try {
    let dons;
    if (categorie) {
      dons = await Don.find({ categorie: categorie });
    } else {
      dons = await Don.find(); // tout afficher si aucune catégorie
    }

    res.status(200).json(dons);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

const getDonById = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id).populate("user"); // 👈 on récupère le donneur ici
    if (!don) return res.status(404).json({ message: "Don non trouvé" });
    
    res.json(don);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateDon = async (req, res) => {
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      return res.status(404).json({ message: 'Don non trouvé' });
    }

    don.titre = req.body.titre || don.titre;
    don.description = req.body.description || don.description;
    don.ville_don = req.body.ville_don || don.ville_don;

    // Si une nouvelle image est envoyée
    if (req.file) {
      don.url_image = `${req.protocol}://${req.get('host')}/${req.file.filename}`; // ou `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    }

    await don.save();
    res.json({ message: 'Don modifié avec succès', don });
  } catch (error) {
    console.error('Erreur dans updateDon :', error);
    res.status(500).json({ message: error.message });
  }
}; 


const deleteDon = async (req, res) => {
  console.log("Suppression demandée pour :", req.params.id);
  try {
    const don = await Don.findById(req.params.id);
    if (!don) {
      console.log("Don introuvable");
      return res.status(404).json({ message: 'Don non trouvé' });
    }

    await don.remove();
    console.log("Don supprimé avec succès");
    res.json({ message: 'Don supprimé avec succès' });
  } catch (error) {
    console.error("Erreur dans deleteDon:", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createDon,
  getDons,
  getDonById,
  updateDon,
  deleteDon
};
