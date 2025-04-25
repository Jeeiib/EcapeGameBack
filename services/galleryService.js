const connection = require("../config/bdd");
const fs = require("fs");
const path = require("path");

/**
 * Récupère toutes les photos de la galerie
 */
async function getAllPhotos(userId = null) {
  try {
    let query = `
        SELECT gp.*, 
          e.nom_escape AS game_name,
          CONCAT(c.prenom, ' ', c.nom) AS user_name
        FROM gallery_photos gp
        JOIN escape_game e ON gp.id_escape = e.id_escape
        JOIN client c ON gp.id_client = c.id_client
        ORDER BY gp.upload_date DESC
      `;

    const [photos] = await connection.promise().query(query);

    // Si un userId est fourni, vérifier quelles photos l'utilisateur a aimées
    if (userId) {
      const [userLikes] = await connection
        .promise()
        .query("SELECT id_photo FROM photo_likes WHERE id_client = ?", [
          userId,
        ]);

      // Assurez-vous que userLikes est un tableau (même vide) avant d'appeler map
      const likedPhotoIds =
        userLikes && userLikes.length
          ? userLikes.map((like) => like.id_photo)
          : [];

      // Ajouter l'information userLiked à chaque photo
      return photos.map((photo) => ({
        ...photo,
        userLiked: likedPhotoIds.includes(photo.id_photo),
      }));
    }

    return photos;
  } catch (error) {
    console.error("Erreur dans getAllPhotos:", error);
    // Ajoutons plus de détails sur l'erreur pour le débogage
    console.error("Détails de l'erreur:", error.message);
    if (error.stack) console.error("Stack trace:", error.stack);
    throw error;
  }
}

/**
 * Récupère les photos filtrées par jeu
 */
async function getPhotosByGame(gameId) {
  try {
    const [photos] = await connection.promise().query(
      `SELECT gp.*, 
        c.prenom, c.nom, 
        eg.nom_escape 
      FROM gallery_photos gp 
      JOIN client c ON gp.id_client = c.id_client 
      JOIN escape_game eg ON gp.id_escape = eg.id_escape 
      WHERE gp.id_escape = ? 
      ORDER BY gp.upload_date DESC`,
      [gameId]
    );

    return photos.map((photo) => ({
      ...photo,
      userName: `${photo.prenom} ${photo.nom}`,
      gameName: photo.nom_escape,
    }));
  } catch (error) {
    console.error(
      `Erreur lors de la récupération des photos pour le jeu #${gameId}:`,
      error
    );
    throw error;
  }
}

/**
 * Enregistre une nouvelle photo dans la galerie
 */
async function addPhoto(photoData, file) {
  try {
    // Vérifier si l'utilisateur a une réservation
    const [reservations] = await connection.promise().query(
      `SELECT * FROM reservation 
         WHERE id_client = ? AND id_escape = ? AND 
         (DATE(date_heure) < CURRENT_DATE() OR reservation_status = 'Confirmée')`,
      [photoData.userId, photoData.gameId]
    );

    if (reservations.length === 0) {
      throw new Error(
        "Vous devez avoir participé à cet escape game pour partager des photos"
      );
    }

    // Générer un nom de fichier unique
    const fileName = `photo_${Date.now()}_${path
      .basename(file.originalname)
      .replace(/\s+/g, "_")}`;

    // Définir le chemin de stockage et l'URL
    const uploadsDir = path.join(__dirname, "../uploads/gallery");
    const filePath = path.join(uploadsDir, fileName);
    const fileUrl = `/uploads/gallery/${fileName}`;

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Déplacer le fichier
    fs.writeFileSync(filePath, file.buffer);

    // Enregistrer les informations dans la base de données
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO gallery_photos (id_client, id_escape, image_url, description) VALUES (?, ?, ?, ?)",
        [
          photoData.userId,
          photoData.gameId,
          fileUrl,
          photoData.description || "",
        ]
      );

    // Récupérer la nouvelle photo avec les informations complètes
    const [photos] = await connection.promise().query(
      `SELECT gp.*, 
        c.prenom, c.nom, 
        eg.nom_escape 
      FROM gallery_photos gp 
      JOIN client c ON gp.id_client = c.id_client 
      JOIN escape_game eg ON gp.id_escape = eg.id_escape 
      WHERE gp.id_photo = ?`,
      [result.insertId]
    );

    return {
      ...photos[0],
      userName: `${photos[0].prenom} ${photos[0].nom}`,
      gameName: photos[0].nom_escape,
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo:", error);
    throw error;
  }
}

/**
 * Récupère les commentaires d'une photo
 * @param {number} photoId - ID de la photo
 * @returns {Array} - Liste des commentaires
 */
async function getPhotoComments(photoId) {
  try {
    // Vérifier si la photo existe
    const [photos] = await connection
      .promise()
      .query("SELECT * FROM gallery_photos WHERE id_photo = ?", [photoId]);

    if (photos.length === 0) {
      throw new Error("Photo non trouvée");
    }

    // Récupérer les commentaires avec les informations sur l'utilisateur
    const [comments] = await connection.promise().query(
      `SELECT pc.*, 
          CONCAT(c.prenom, ' ', c.nom) AS userName 
        FROM photo_comments pc 
        JOIN client c ON pc.id_client = c.id_client 
        WHERE pc.id_photo = ? 
        ORDER BY pc.comment_date DESC`,
      [photoId]
    );

    return comments;
  } catch (error) {
    console.error("Erreur dans getPhotoComments:", error);
    throw error;
  }
}

/**
 * Ajoute ou retire un like à une photo
 */
async function toggleLike(photoId, userId) {
    try {
      // Débuter une transaction pour assurer la cohérence des données
      await connection.promise().beginTransaction();
      
      // 1. Vérifier si l'utilisateur a déjà aimé cette photo
      const [existingLikes] = await connection
        .promise()
        .query("SELECT * FROM photo_likes WHERE id_photo = ? AND id_client = ?", [
          photoId,
          userId,
        ]);
  
      console.log(`User ${userId} a-t-il déjà aimé la photo ${photoId}? ${existingLikes.length > 0 ? 'Oui' : 'Non'}`);
      
      let liked = false;
      let action = "";
  
      // Si l'utilisateur a déjà aimé, supprimer le like
      if (existingLikes.length > 0) {
        await connection
          .promise()
          .query("DELETE FROM photo_likes WHERE id_photo = ? AND id_client = ?", [
            photoId,
            userId,
          ]);
  
        // Mettre à jour le compteur de likes dans la table gallery_photos (DÉCRÉMENTER)
        await connection
          .promise()
          .query(
            "UPDATE gallery_photos SET likes = GREATEST(0, likes - 1) WHERE id_photo = ?",
            [photoId]
          );
        
        liked = false;
        action = "remove";
      } else {
        // L'utilisateur n'a pas encore aimé cette photo, ajouter un like
        await connection
          .promise()
          .query(
            "INSERT INTO photo_likes (id_photo, id_client, like_date) VALUES (?, ?, NOW())",
            [photoId, userId]
          );
  
        // Mettre à jour le compteur de likes dans la table gallery_photos (INCRÉMENTER)
        await connection
          .promise()
          .query(
            "UPDATE gallery_photos SET likes = IFNULL(likes, 0) + 1 WHERE id_photo = ?",
            [photoId]
          );
        
        liked = true;
        action = "add";
      }
      
      // Récupérer le nombre total actuel de likes pour cette photo
      const [updatedPhoto] = await connection
        .promise()
        .query("SELECT likes FROM gallery_photos WHERE id_photo = ?", [photoId]);
      
      // Valider la transaction
      await connection.promise().commit();
      
      console.log(`Action effectuée: ${action}, total likes: ${updatedPhoto[0].likes}`);
      
      return {
        success: true,
        liked: liked,
        totalLikes: updatedPhoto[0].likes,
        message: liked ? "Photo aimée" : "Like retiré"
      };
    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await connection.promise().rollback();
      console.error("Erreur dans toggleLike:", error);
      throw error;
    }
  }
/**
 * Ajoute un commentaire à une photo
 * @param {number} photoId - ID de la photo
 * @param {number} userId - ID de l'utilisateur
 * @param {string} commentText - Texte du commentaire
 * @returns {Object} - Le commentaire ajouté
 */
async function addComment(photoId, userId, commentText) {
  try {
    // Vérifier si la photo existe
    const [photos] = await connection
      .promise()
      .query("SELECT * FROM gallery_photos WHERE id_photo = ?", [photoId]);

    if (photos.length === 0) {
      throw new Error("Photo non trouvée");
    }

    // Insérer le commentaire
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO photo_comments (id_photo, id_client, comment_text, comment_date) VALUES (?, ?, ?, NOW())",
        [photoId, userId, commentText]
      );

    // Mettre à jour le compteur de commentaires dans la table gallery_photos
    await connection
      .promise()
      .query(
        "UPDATE gallery_photos SET comments = IFNULL(comments, 0) + 1 WHERE id_photo = ?",
        [photoId]
      );

    // Récupérer les informations de l'utilisateur
    const [users] = await connection
      .promise()
      .query("SELECT prenom, nom FROM client WHERE id_client = ?", [userId]);

    const userName =
      users.length > 0 ? `${users[0].prenom} ${users[0].nom}` : "Utilisateur";

    return {
      id: result.insertId,
      photoId,
      userId,
      userName,
      commentText,
      commentDate: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erreur dans addComment:", error);
    throw error;
  }
}

/**
 * Supprime une photo (seul le propriétaire ou un admin peut supprimer)
 */
async function deletePhoto(photoId, userId, isAdmin) {
  try {
    // Récupérer la photo pour vérifier l'appartenance et l'URL du fichier
    const [photo] = await connection
      .promise()
      .query("SELECT * FROM gallery_photos WHERE id_photo = ?", [photoId]);

    if (photo.length === 0) {
      throw new Error("Photo non trouvée");
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    if (photo[0].id_client !== userId && !isAdmin) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette photo");
    }

    // Supprimer le fichier physique
    const filePath = path.join(__dirname, "..", photo[0].image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'entrée dans la base de données
    const [result] = await connection
      .promise()
      .query("DELETE FROM gallery_photos WHERE id_photo = ?", [photoId]);

    return { success: result.affectedRows > 0 };
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo:", error);
    throw error;
  }
}

/**
 * Supprime un commentaire
 * @param {number} commentId - ID du commentaire à supprimer
 * @param {number} userId - ID de l'utilisateur qui tente de supprimer le commentaire
 * @returns {Object} - Résultat de la suppression
 */
async function deleteComment(commentId, userId) {
  try {
    // Vérifier si le commentaire existe et appartient à l'utilisateur
    const [comments] = await connection
      .promise()
      .query("SELECT * FROM photo_comments WHERE id_comment = ?", [commentId]);

    if (comments.length === 0) {
      throw new Error("Commentaire non trouvé");
    }

    const comment = comments[0];

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (comment.id_client !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce commentaire");
    }

    // Récupérer l'ID de la photo pour mettre à jour le compteur
    const photoId = comment.id_photo;

    // Supprimer le commentaire
    await connection
      .promise()
      .query("DELETE FROM photo_comments WHERE id_comment = ?", [commentId]);

    // Mettre à jour le compteur de commentaires
    await connection
      .promise()
      .query(
        "UPDATE gallery_photos SET comments = GREATEST(0, comments - 1) WHERE id_photo = ?",
        [photoId]
      );

    return { success: true };
  } catch (error) {
    console.error("Erreur dans deleteComment:", error);
    throw error;
  }
}

module.exports = {
  deleteComment,
  getAllPhotos,
  getPhotosByGame,
  addPhoto,
  toggleLike,
  getPhotoComments,
  deletePhoto,
  addComment,
};
