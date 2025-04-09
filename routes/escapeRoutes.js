const express = require("express");
const router = express.Router();
const EscapeController = require("../controllers/escapeController");
const AuthController = require("../controllers/authController");

// Route to get all games
router.get("/", (req, res) => {
  EscapeController.AllGames(req, res);
});

// Route to get all available games
router.get("/available", (req, res) => {
  EscapeController.AvailableGames(req, res);
});

// Route to get average capacity
router.get("/averageCapacity", (req, res) => {
  EscapeController.averageCapacity(req, res);
});

// Route to get games with capacity above a certain number
router.get("/capacityAbove/:capacity", (req, res) => {
  EscapeController.CapacityAbove(req, res);
});

// Route to get games with prices above a certain number
router.get("/pricesAbove/:price", (req, res) => {
  EscapeController.PricesAbove(req, res);
});

// Route to get games by difficulty
router.get("/difficulty/:difficulty", (req, res) => {
  EscapeController.GamesByDifficulty(req, res);
});

// Route to get avalable games by difficulty
router.get("/available/difficulty/:difficulty", (req, res) => {
  EscapeController.AvailableGamesByDifficulty(req, res);
});

// Route to get games below a certain price
router.get("/pricesBelow/:price", (req, res) => {
  EscapeController.PricesBelow(req, res);
});

// Route to get games between two prices
router.get("/pricesBetween/:minPrice/:maxPrice", (req, res) => {
  EscapeController.PricesBetween(req, res);
});

// Route to add a new game
router.post("/", AuthController.verifyToken, (req, res) => {
  EscapeController.AddGame(req, res);
});

// Route to update a game
router.patch("/:id", AuthController.verifyToken, (req, res) => {
  EscapeController.UpdateGame(req, res);
});

// Route to delete a game
router.delete("/:id", AuthController.verifyToken, (req, res) => {
  EscapeController.DeleteGame(req, res);
});

// Route to get one game
router.get("/:id", (req, res) => {
  EscapeController.OneGame(req, res);
});

module.exports = router;
