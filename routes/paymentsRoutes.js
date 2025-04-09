const express = require("express");
const router = express.Router();
const PaymentsController = require("../controllers/paymentsController");
const AuthController = require("../controllers/authController");

// Route to get all payments
router.get("/", (req, res) => {
  PaymentsController.allPayments(req, res);
});

// Route to get a payment by ID
router.get("/:id", (req, res) => {
  PaymentsController.onePayment(req, res);
});

// Route to get the payment method
router.get("/method/:method", (req, res) => {
  PaymentsController.paymentsByMethod(req, res);
});

// Route to get the total amount by month and year
router.get("/total/:month/:year", (req, res) => {
  PaymentsController.totalByMonthAndYear(req, res);
});

// Route to get payments above a certain amount
router.get("/above/:amount", (req, res) => {
  PaymentsController.paymentsAbove(req, res);
});

// Route to get payments by reservation status
router.get("/reservationStatus/:status", (req, res) => {
  PaymentsController.paymentsByReservationsStatus(req, res);
});

// Route to get the total amount by reservation status
router.get("/total/status/:status", (req, res) => {
  PaymentsController.totalByReservationsStatus(req, res);
});

// Route to get the count of payments by method
router.get("/count/:method", (req, res) => {
  PaymentsController.countByMethod(req, res);
});

// Route to create a new payment
router.post("/", AuthController.verifyToken, (req, res) => {
  PaymentsController.AddPayment(req, res);
});

// Route to update a payment
router.patch("/:id", AuthController.verifyToken, (req, res) => {
  PaymentsController.UpdatePayment(req, res);
});

// Route to delete a payment
router.delete("/:id", AuthController.verifyToken, (req, res) => {
  PaymentsController.DeletePayment(req, res);
});


module.exports = router;