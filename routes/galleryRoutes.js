const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const galleryController = require("../controllers/galleryController");
const AuthController = require("../controllers/authController");

// Configuration de multer pour les uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
  fileFilter: (req, file, cb) => {
    // Autoriser seulement les images
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Seules les images au format JPEG, JPG, PNG et GIF sont autorisées"
      )
    );
  },
});

// Routes publiques
router.get("/photos", galleryController.getAllPhotos);
router.get("/photos/game/:gameId", galleryController.getPhotosByGame);

// Routes protégées (nécessite authentification)
router.post(
  "/upload",
  AuthController.verifyToken,
  upload.single("photo"),
  galleryController.uploadPhoto
);

// Route pour gérer les likes (CORRIGER LA ROUTE DUPLIQUÉE)
router.post(
  "/photos/:photoId/like",
  AuthController.verifyToken,
  galleryController.toggleLike
);

// Route pour supprimer une photo
router.delete(
  "/photos/:photoId",
  AuthController.verifyToken,
  galleryController.deletePhoto
);

// Route pour supprimer un commentaire
router.delete(
    "/photos/comments/:commentId",
    AuthController.verifyToken,
    galleryController.deleteComment
  );

router.get(
  "/photos/:photoId/comments",
  AuthController.verifyToken,
  galleryController.getPhotoComments
);

// Route pour ajouter un commentaire (NOUVELLE ROUTE)
router.post(
  "/photos/:photoId/comment",
  AuthController.verifyToken,
  galleryController.addComment
);

module.exports = router;
