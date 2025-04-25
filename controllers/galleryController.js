const galleryService = require("../services/galleryService");

/**
 * Récupère toutes les photos de la galerie
 */
async function getAllPhotos(req, res) {
  try {
    const photos = await galleryService.getAllPhotos();
    res.status(200).json(photos);
  } catch (error) {
    console.error("Erreur dans getAllPhotos:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des photos",
      details: error.message,
    });
  }
}

/**
 * Récupère les photos filtrées par jeu
 */
async function getPhotosByGame(req, res) {
  try {
    const photos = await galleryService.getPhotosByGame(req.params.gameId);
    res.status(200).json(photos);
  } catch (error) {
    console.error("Erreur dans getPhotosByGame:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des photos",
      details: error.message,
    });
  }
}

/**
 * Ajoute une nouvelle photo à la galerie
 */
async function uploadPhoto(req, res) {
  try {
    // Vérifier si une image a été téléchargée
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Aucune image n'a été téléchargée" });
    }

    // Vérifier les données requises
    if (!req.body.gameId || !req.user.id) {
      return res
        .status(400)
        .json({ error: "Informations manquantes (gameId ou userId)" });
    }

    const photoData = {
      userId: req.user.id,
      gameId: req.body.gameId,
      description: req.body.description,
    };

    const photo = await galleryService.addPhoto(photoData, req.file);
    res.status(201).json(photo);
  } catch (error) {
    console.error("Erreur dans uploadPhoto:", error);
    res
      .status(error.message.includes("devez avoir participé") ? 403 : 500)
      .json({
        error: "Erreur lors de l'ajout de la photo",
        details: error.message,
      });
  }
}

/**
 * Ajoute ou retire un like à une photo
 */
async function toggleLike(req, res) {
  try {
    const result = await galleryService.toggleLike(
      req.params.photoId,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur dans toggleLike:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour des likes",
      details: error.message,
    });
  }
}

// * Ajoute un commentaire à une photo
//  */
async function addComment(req, res) {
  try {
    if (!req.body.comment || req.body.comment.trim() === "") {
      return res
        .status(400)
        .json({ error: "Le commentaire ne peut pas être vide" });
    }

    const result = await galleryService.addComment(
      req.params.photoId,
      req.user.id,
      req.body.comment.trim()
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur dans addComment:", error);

    if (error.message.includes("non trouvée")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({
      error: "Erreur lors de l'ajout du commentaire",
      details: error.message,
    });
  }
}

//   Récupère les commentaires d'une photo

async function getPhotoComments(req, res) {
  try {
    const { photoId } = req.params;
    const comments = await galleryService.getPhotoComments(photoId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur dans getPhotoComments:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des commentaires",
      details: error.message,
    });
  }
}

/**
 * Supprime une photo
 */
async function deletePhoto(req, res) {
  try {
    const result = await galleryService.deletePhoto(
      req.params.photoId,
      req.user.id,
      req.user.role === "ADMIN"
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur dans deletePhoto:", error);

    if (error.message.includes("n'êtes pas autorisé")) {
      return res.status(403).json({ error: error.message });
    }

    if (error.message.includes("non trouvée")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({
      error: "Erreur lors de la suppression de la photo",
      details: error.message,
    });
  }
}

/**
 * Supprime un commentaire
 */
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // ID de l'utilisateur authentifié

    // Supprimer le commentaire s'il appartient à l'utilisateur
    const result = await galleryService.deleteComment(commentId, userId);

    res.status(200).json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur dans deleteComment:", error);

    if (error.message.includes("non autorisé")) {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({
      error: "Erreur lors de la suppression du commentaire",
      details: error.message,
    });
  }
}

module.exports = {
  getPhotoComments,
  getAllPhotos,
  getPhotosByGame,
  uploadPhoto,
  toggleLike,
  deletePhoto,
  addComment,
  deleteComment,
};
