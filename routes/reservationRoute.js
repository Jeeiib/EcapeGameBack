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

// Route to get average total cost
router.get("/averageTotalCost", (req, res) => {
  ReservationsController.averageTotalCost(req, res);
});

// Route to get reservations with total cost above a certain amount
router.get("/costAbove/:price", (req, res) => {
  ReservationsController.costAbove(req, res);
});

// Route to get reservations by name of the game
router.get("/nameEscape/:nom", (req, res) => {
  ReservationsController.reservationsByNomEscape(req, res);
});

// Route to get the maximum number of reservations
router.get("/maxReservations", (req, res) => {
  ReservationsController.maxReservations(req, res);
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
