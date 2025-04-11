const express = require("express");
const router = express.Router();
const ReservationsController = require("../controllers/reservationController");
const AuthController = require("../controllers/authController");

// Route to get all reservations
router.get("/", (req, res) => {
  ReservationsController.allReservations(req, res);
});

// Route to get reservations by status
router.get("/status/:reservation_status", (req, res) => {
  ReservationsController.reservationsByStatus(req, res);
});

// Ajouter cette route
router.get("/escape/:id", (req, res) => {
  ReservationsController.reservationsByEscapeId(req, res);
});

// Route to get average total cost
router.get("/averageTotalCost", (req, res) => {
  ReservationsController.averageTotalCost(req, res);
});

// Route to get reservations with total cost above a certain amount
router.get("/costAbove/:price", (req, res) => {
  ReservationsController.costAbove(req, res);
});

// Route to get reservations by client ID
router.get("/client/:id", (req, res) => {
  ReservationsController.reservationsByClientId(req, res);
});

// Route to get reservations by name of the game
router.get("/nameEscape/:nom", (req, res) => {
  ReservationsController.reservationsByNomEscape(req, res);
});

// Route to get the maximum number of reservations
router.get("/maxReservations", (req, res) => {
  ReservationsController.maxReservations(req, res);
});

router.get("/test-confirmation-email", async (req, res) => {
  try {
    const emailService = require('../services/emailService');
    const escapeService = require('../services/escapeService');
    
    // Créer des objets de test
    const game = await escapeService.OneGame(2);
    
    const user = {
      id_client: 9,
      prenom: 'Jean-Baptiste',
      nom: 'renart',
      email: req.query.email || 'renartjeanbaptiste@gmail.com',
      phone: '0618972250'
    };
    
    const reservation = {
      id_reservation: 999,
      date_heure: '2025-04-17T12:00:00.000Z',
      prix_total: '100.00',
      reservation_status: 'Confirmée',
      lieu: 'Sur site',
      nombre_participants: 2
    };
    
    const paymentInfo = {
      payment_method: 'Carte bancaire'
    };
    
    // Envoyer l'email de test
    const result = await emailService.sendBookingConfirmation(reservation, game, user, paymentInfo);
    
    res.status(200).json({
      success: true,
      messageId: result.messageId,
      details: "Email de confirmation envoyé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur lors du test d'envoi d'email de confirmation:", error);
    res.status(500).json({
      error: "Échec de l'envoi d'email de test",
      details: error.message,
      stack: error.stack
    });
  }
});

// Route to add a new reservation
router.post("/", AuthController.verifyToken, (req, res) => {
  ReservationsController.AddReservation(req, res);
});

// Route to update a reservation
router.patch("/:id", AuthController.verifyToken, (req, res) => {
  ReservationsController.UpdateReservation(req, res);
});

// Route to delete a reservation
router.delete("/:id", AuthController.verifyToken, (req, res) => {
  ReservationsController.DeleteReservation(req, res);
});


// Route to get one reservation
router.get("/:id", (req, res) => {
  ReservationsController.OneReservation(req, res);
});



module.exports = router;
