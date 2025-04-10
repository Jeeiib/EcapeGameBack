const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

// Route to login
router.post("/login", (req, res) => {
  AuthController.login(req, res);
});

// Routes pour la réinitialisation du mot de passe
router.post("/reset-password-request", (req, res) => {
  AuthController.requestPasswordReset(req, res);
});

router.get("/verify-reset-token/:token", (req, res) => {
  AuthController.verifyResetToken(req, res);
});

router.post("/reset-password", (req, res) => {
  AuthController.resetPassword(req, res);
});

module.exports = router;