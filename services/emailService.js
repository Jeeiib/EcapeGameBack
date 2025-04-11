const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

// Helper pour comparer des valeurs
handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

// Helper pour l'année en cours
handlebars.registerHelper("currentYear", function () {
  return new Date().getFullYear();
});

// Configurer le transporteur d'email (à adapter selon votre service d'email)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "renartjeanbaptiste@gmail.com", // Utiliser une variable d'environnement ou email par défaut
    pass: process.env.EMAIL_APP_PASSWORD, // Stocker le mot de passe dans les variables d'environnement
  },
});

/**
 * Envoie un email de confirmation de réservation
 * @param {Object} reservation - Les détails de la réservation
 * @param {Object} game - Les informations du jeu réservé
 * @param {Object} user - Les informations de l'utilisateur
 * @param {Object} paymentInfo - Les informations de paiement
 */

function getGameImage(gameName) {
  if (!gameName) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/default-game.jpg`;
  }

  const gameNameLower = gameName.toLowerCase();
  
  // Même logique que dans vos composants React
  if (gameNameLower.includes("trône de fer") || gameNameLower.includes("trone de fer")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/TroneDeFer.png`;
  } else if (gameNameLower.includes("quête du jedi") || gameNameLower.includes("quete du jedi")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/LaQueteduJedi.jpg`;
  } else if (gameNameLower.includes("épreuve des sorciers") || gameNameLower.includes("epreuve des sorciers")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/EpreuveDesSorciers.jpg`;
  } else if (gameNameLower.includes("quête d'azeroth") || gameNameLower.includes("quete d'azeroth")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/LaQueteAzeroth.jpg`;
  } else if (gameNameLower.includes("légende de l'arène") || gameNameLower.includes("legende de l'arene")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/LaLegendeDeArene.jpg`;
  } else if (gameNameLower.includes("énigmes de l'absence") || gameNameLower.includes("enigmes de l'absence")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/EnigmeAbsence.webp`;
  } else if (gameNameLower.includes("atelier des engrenages")) {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/AtelierDesEngrenages.jpg`;
  } else {
    return `${process.env.FRONTEND_URL || "http://localhost:5173"}/assets/default-game.jpg`;
  }
}

// Ajouter cette fonction à votre service d'email
async function sendTestEmail(toEmail) {
  try {
    console.log("=== ENVOI EMAIL DE TEST ===");
    console.log("Email de destination:", toEmail);

    const mailOptions = {
      from: `"Test Énigmes Évadées" <${
        process.env.EMAIL_USER || "renartjeanbaptiste@gmail.com"
      }>`,
      to: toEmail,
      subject: "Test d'envoi d'email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h1 style="color: #0056b3;">Test d'envoi d'email</h1>
          <p>Ceci est un email de test envoyé le ${new Date().toLocaleString(
            "fr-FR"
          )}.</p>
          <p>Si vous recevez cet email, la configuration nodemailer fonctionne correctement.</p>
        </div>
      `,
    };

    console.log("Configuration de l'email de test:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email de test envoyé avec succès:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ ERREUR LORS DE L'ENVOI DE L'EMAIL DE TEST:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  }
}

async function sendBookingConfirmation(reservation, game, user, paymentInfo) {
  try {
    console.log("=== DÉBUT ENVOI EMAIL ===");
    console.log("Données de réservation:", JSON.stringify(reservation));
    console.log("Données du jeu:", JSON.stringify(game));
    console.log("Données utilisateur:", JSON.stringify(user));
    console.log("Email de destination:", user?.email || "AUCUN EMAIL TROUVÉ!");

    // Charger le template d'email
    const templatePath = path.join(
      __dirname,
      "../templates/booking-confirmation.html"
    );
    console.log("Chemin du template:", templatePath);
    console.log("Le template existe:", fs.existsSync(templatePath));

    let templateSource;
    // Vérifier si le fichier existe avant de le lire
    if (fs.existsSync(templatePath)) {
      templateSource = fs.readFileSync(templatePath, "utf8");
      console.log(
        "Template chargé, premières lignes:",
        templateSource.substring(0, 100)
      );
    } else {
      console.warn("Template non trouvé, utilisation du template par défaut");
      // Utiliser un template par défaut
      templateSource = `
<div>
  <h1>Confirmation de réservation</h1>
  <p>Bonjour ${user.prenom},</p>
  <p>Votre réservation pour <strong>${game.nom_escape}</strong> a été confirmée.</p>
  <ul>
    <li>Date: ${formattedDate}</li>
    <li>Heure: ${formattedTime}</li>
    <li>Lieu: ${reservation.lieu}</li>
    <li>Prix: ${reservation.prix_total}€</li>
  </ul>
  <p>Merci de votre réservation!</p>
</div>
`;
      // Utiliser un template par défaut
    }

    const template = handlebars.compile(templateSource);

    // Formatage de la date et de l'heure
    let reservationDate;
if (typeof reservation.date_heure === 'string') {
  if (reservation.date_heure.includes('T')) {
    // Si le format est déjà ISO
    reservationDate = new Date(reservation.date_heure);
  } else {
    // Si le format est 'YYYY-MM-DD HH:MM:SS' (MySQL)
    // Parsez explicitement la chaîne pour éviter les problèmes de fuseau horaire
    const [datePart, timePart] = reservation.date_heure.split(' ');
    reservationDate = new Date(`${datePart}T${timePart}`);
  }
} else {
  reservationDate = new Date(reservation.date_heure);
}

// Ajouter un jour à la date pour corriger le décalage
reservationDate.setDate(reservationDate.getDate() + 1);

    const formattedDate = reservationDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formattedTime = reservationDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Préparer les données pour le template
    const context = {
      userName: user.prenom + " " + user.nom,
      gameName: game.nom_escape,
      date: formattedDate,
      time: formattedTime,
      location: reservation.lieu,
      participants: reservation.nombre_participants,
      totalPrice: reservation.prix_total,
      reservationStatus: reservation.reservation_status,
      paymentMethod: paymentInfo.payment_method,
      isAtHome: reservation.lieu === "À domicile",
      address: reservation.contact_info?.address || user.address || "Non spécifiée",
      specialRequests: reservation.contact_info?.specialRequests || user.specialRequests || "Aucune",
      reservationNumber: reservation.id_reservation,
      contactEmail: "renartjeanbaptiste@gmail.com",
      contactPhone: "06 18 97 22 50",
      websiteUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    };

    // Générer le HTML de l'email
    const html = template(context);

    // Configuration de l'email
    const mailOptions = {
      from: `"Énigmes Évadées" <${
        process.env.EMAIL_USER || "renartjeanbaptiste@gmail.com"
      }>`,
      to: user.email,
      subject: `Confirmation de votre réservation - ${game.nom_escape}`,
      html: html,
    };

    console.log("Configuration de l'email:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email de confirmation envoyé:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ ERREUR LORS DE L'ENVOI DE L'EMAIL:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Erreur complète:", error);
    throw error;
  }
}

module.exports = {
  sendBookingConfirmation,
  sendTestEmail,
};
