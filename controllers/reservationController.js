const reservationService = require("../services/reservationService");
const escapeService = require("../services/escapeService");
const clientsService = require("../services/clientsService");
const emailService = require("../services/emailService");

async function allReservations(req, res) {
  try {
    const allReservations = await reservationService.allReservations();
    res.status(200);
    res.json(allReservations);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while fetching reservations." });
  }
}

async function OneReservation(req, res) {
  try {
    const oneReservation = await reservationService.OneReservation(
      req.params.id
    );
    res.status(200);
    res.json(oneReservation);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservation." });
  }
}

async function reservationsByStatus(req, res) {
  try {
    const reservationsByStatus = await reservationService.reservationsByStatus(
      req.params.reservation_status
    );
    res.status(200);
    res.json(reservationsByStatus);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservations." });
  }
}

async function averageTotalCost(req, res) {
  try {
    const averageTotalCost = await reservationService.averageTotalCost();
    res.status(200);
    res.json(averageTotalCost);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      error: "An error occurred while fetching the average total cost.",
    });
  }
}

async function costAbove(req, res) {
  try {
    const costAbove = await reservationService.costAbove(req.params.price);
    res.status(200);
    res.json(costAbove);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservations." });
  }
}

// Ajouter cette fonction
async function reservationsByEscapeId(req, res) {
  try {
    const reservations = await reservationService.reservationsByEscapeId(
      req.params.id
    );
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "An error occurred while fetching reservations for this escape game.",
    });
  }
}

async function reservationsByNomEscape(req, res) {
  try {
    const reservationsByNomEscape =
      await reservationService.reservationsByNomEscape(req.params.nom);
    res.status(200);
    res.json(reservationsByNomEscape);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservations." });
  }
}

async function maxReservations(req, res) {
  try {
    const maxReservations = await reservationService.maxReservations();
    res.status(200);
    res.json(maxReservations);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      error: "An error occurred while fetching the maximum reservations.",
    });
  }
}

async function AddReservation(req, res) {
  try {
    console.log("=== DÉBUT TRAITEMENT RÉSERVATION ===");
    console.log("Données reçues:", req.body);

    // Vérification des champs obligatoires
    if (
      !req.body.id_client ||
      !req.body.id_escape ||
      !req.body.date_heure ||
      !req.body.prix_total
    ) {
      return res.status(400).json({
        error:
          "Données incomplètes. Veuillez fournir id_client, id_escape, date_heure et prix_total.",
      });
    }

    // Traitement de la réservation
    const newReservation = await reservationService.AddReservation(req.body);
    // Récupération des informations supplémentaires pour l'email
    try {
      // Logs de débogage détaillés
      console.log("=== ENVOI EMAIL DEBUG INFO ===");
      // Récupérer les informations du jeu
      const game = await escapeService.OneGame(req.body.id_escape);
      console.log("Jeu récupéré:", game ? "OK" : "NON TROUVÉ");
      // Récupérer les informations de l'utilisateur
      const user = await clientsService.oneClient(req.body.id_client);
      console.log("Utilisateur récupéré:", user ? "OK" : "NON TROUVÉ");
      console.log("Email utilisateur:", user?.email || "AUCUN EMAIL");
      // TRÈS IMPORTANT : Vérifier que l'email existe bien dans l'objet user
      if (!user || !user.email) {
        console.error("⚠️ EMAIL MANQUANT DANS L'OBJET USER:", user);

        // Si l'email est manquant dans user mais présent dans req.body.contact_info
        if (req.body.contact_info && req.body.contact_info.email) {
          console.log(
            "✅ Email trouvé dans contact_info, utilisation de cette valeur"
          );
          user.email = req.body.contact_info.email;
        }
      }
      // Créer un objet de paiement par défaut (sera mis à jour plus tard)
      const paymentInfo = {
        payment_method: req.body.payment_method || "Non spécifié",
      };

      // Tenter l'envoi de l'email
      const emailResult = await emailService.sendBookingConfirmation(newReservation, game, user, paymentInfo);
      console.log("✅ Email envoyé avec succès:", emailResult.messageId);
    } catch (emailError) {
      console.error("❌ ERREUR LORS DE L'ENVOI DE L'EMAIL:", emailError);
    }

    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réservation:", error);

    // Gérer les erreurs spécifiques avec des codes adaptés
    if (error.message.includes("déjà réservé")) {
      return res.status(409).json({ error: error.message }); // Conflit
    } else if (error.message.includes("Format de date invalide")) {
      return res.status(400).json({ error: error.message }); // Mauvaise requête
    } else if (error.message.includes("manquant")) {
      return res.status(400).json({ error: error.message }); // Mauvaise requête
    }

    // Erreur générique
    res.status(500).json({
      error: "Une erreur est survenue lors de l'ajout de la réservation.",
      details: error.message,
    });
  }
}

async function UpdateReservation(req, res) {
  try {
    const updatedReservation = await reservationService.UpdateReservation(
      req.params.id,
      req.body
    );
    res.status(200);
    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while updating the reservation." });
  }
}
async function DeleteReservation(req, res) {
  try {
    await reservationService.DeleteReservation(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while deleting the reservation." });
  }
}
module.exports = {
  allReservations,
  OneReservation,
  reservationsByStatus,
  averageTotalCost,
  costAbove,
  reservationsByNomEscape,
  maxReservations,
  AddReservation,
  UpdateReservation,
  DeleteReservation,
  reservationsByEscapeId,
};
