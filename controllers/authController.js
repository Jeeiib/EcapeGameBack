const bcrypt = require("bcryptjs");
const AuthServices = require("../services/authService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renartjeanbaptiste@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD, // Mot de passe d'application Google (à configurer)
  },
});

async function login(req, res) {
  try {
    const user = await AuthServices.getUserByEmail(req.body.email);
    console.log(user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // const token = AuthServices.generateToken(user);
    // Par celle-ci qui inclut les données utilisateur
    res.status(200).json({
      token: generateToken(user),
      id_client: user.id_client,
      id: user.id_client, // Pour compatibilité
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      phone: user.phone, // Ajoutez d'autres champs si nécessaire
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id_client,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    },
    "SECRET",
    {
      expiresIn: 86400, // 24 hours
    }
  );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("auth header", authHeader);

  if (!authHeader) {
    return res.status(403).send({ message: "Aucun token fourni" });
  }

  // Extraire le token du format "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  console.log("token extrait", token);

  jwt.verify(token, "SECRET", (err, decoded) => {
    if (err) {
      console.error("Erreur de vérification du token:", err);
      return res.status(401).send({ message: "Non autorisé!" });
    }
    req.user = decoded;
    next();
  });
}

// Demande de réinitialisation de mot de passe
async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "L'adresse email est requise" });
    }

    // Recherche de l'utilisateur par email
    const user = await AuthServices.getUserByEmail(email);

    // Si l'utilisateur n'existe pas, nous renvoyons quand même une réponse positive
    // pour des raisons de sécurité (ne pas divulguer quels emails sont enregistrés)
    if (!user) {
      return res.status(200).json({
        message:
          "Si cette adresse email est associée à un compte, un lien de réinitialisation a été envoyé.",
      });
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 heure

    // Sauvegarder le token dans la base de données
    await AuthServices.saveResetToken(
      user.id_client,
      resetToken,
      resetTokenExpires
    );

    // Créer le lien de réinitialisation (adaptez l'URL à votre frontend)
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Envoyer l'email
    const mailOptions = {
      from: "renartjeanbaptiste@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe - Énigmes Évadées",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #1b263b; text-align: center;">Énigmes Évadées</h1>
          <h2 style="color: #415a77;">Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.prenom},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #1b263b; color: white; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
          </div>
          <p>Ce lien est valable pendant 1 heure.</p>
          <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email.</p>
          <p>Merci,<br>L'équipe Énigmes Évadées</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "Si cette adresse email est associée à un compte, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de l'envoi du lien de réinitialisation.",
      });
  }
}

// Vérification de la validité du token
async function verifyResetToken(req, res) {
  try {
    const { token } = req.params;

    // Vérifier si le token existe et est valide
    const tokenData = await AuthServices.findResetToken(token);

    if (!tokenData || tokenData.expires < new Date()) {
      return res
        .status(400)
        .json({
          valid: false,
          message: "Le lien de réinitialisation est invalide ou a expiré.",
        });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res
      .status(500)
      .json({
        valid: false,
        message: "Une erreur est survenue lors de la vérification du token.",
      });
  }
}

// Réinitialisation du mot de passe
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Le token et le nouveau mot de passe sont requis." });
    }

    // Vérifier si le token existe et est valide
    const tokenData = await AuthServices.findResetToken(token);

    if (!tokenData || tokenData.expires < new Date()) {
      return res
        .status(400)
        .json({
          message: "Le lien de réinitialisation est invalide ou a expiré.",
        });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Mettre à jour le mot de passe
    await AuthServices.updatePassword(tokenData.id_client, hashedPassword);

    // Supprimer le token
    await AuthServices.deleteResetToken(token);

    res
      .status(200)
      .json({ message: "Votre mot de passe a été réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res
      .status(500)
      .json({
        message:
          "Une erreur est survenue lors de la réinitialisation du mot de passe.",
      });
  }
}

module.exports = {
  login,
  verifyToken,
  generateToken,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
};
