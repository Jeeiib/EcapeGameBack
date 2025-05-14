const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewardController");
const AuthController = require("../controllers/authController");

// Routes de récompenses (nécessitent authentification)
router.post("/", AuthController.verifyToken, rewardsController.createReward);
router.get("/validate/:code", rewardsController.validateReward);
router.get("/user/:id", AuthController.verifyToken, rewardsController.getUserRewards);
router.patch("/use/:id", AuthController.verifyToken, rewardsController.useReward);
router.delete("/:id", AuthController.verifyToken, rewardsController.deleteReward);

module.exports = router;