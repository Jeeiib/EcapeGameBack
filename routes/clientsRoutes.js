const express = require("express");
const router = express.Router();
const ClientsController = require("../controllers/clientsController");
const AuthController = require("../controllers/authController");

// Route to get all clients
router.get("/", (req, res) => {
  ClientsController.AllClients(req, res);
});

// Route to get me
router.get("/me", (req, res) => {
  ClientsController.Me(req, res);
});

// Route to get clients by year
router.get("/clientsByYear/:year", (req, res) => {
  ClientsController.clientsByYear(req, res);
});

// Route to get clients with total cost above a certain price
router.get("/totalCostAbove/:price", (req, res) => {
  ClientsController.totalCostAbove(req, res);
});

// Route to get clients by registration date
router.get("/clientsByregistrationDate/:month/:year", (req, res) => {
  ClientsController.clientsByRegistrationDate(req, res);
});

// Route to get clients by reservation date
router.get("/clientsreservationDate/:month/:year", (req, res) => {
  ClientsController.clientsByReservationDate(req, res);
});

// Route to get clients by escape room
router.get("/escapeRoom/:id", (req, res) => {
  ClientsController.clientsByEscapeRoom(req, res);
});

// Route to get the max amount spent
router.get("/maxAmountSpent", (req, res) => {
  ClientsController.maxAmountSpent(req, res);
});

// Route to create a new user
router.post("/", (req, res) => {
  ClientsController.AddClient(req, res);
});

// Route to update a client
router.patch("/:id", AuthController.verifyToken, (req, res) => {
  ClientsController.UpdateClient(req, res);
});

// Route to delete a client
router.delete("/:id", AuthController.verifyToken, (req, res) => {
  ClientsController.DeleteClient(req, res);
});

// Route to get a client by his email
router.get("/email/:email", (req, res) => {
  ClientsController.GetClientByEmail(req, res);
});

// Route to get One client
router.get("/:id", (req, res) => {
    ClientsController.OneClient(req, res);
});

module.exports = router;
