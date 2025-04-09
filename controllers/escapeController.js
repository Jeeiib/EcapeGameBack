const EscapeService = require('../services/escapeService');

async function AllGames(req, res) {
  try {
    const games = await EscapeService.AllGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function OneGame (req,res) {
    try {
        const OneGame = await EscapeService.OneGame(req.params.id);
        res.status(200);
        res.json(OneGame);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function AvailableGames (req,res) {
    try {
        const AvailableGames = await EscapeService.AvailableGames();
        res.status(200);
        res.json(AvailableGames);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function averageCapacity(req, res) {
    try {
      const averageCapacity = await EscapeService.averageCapacity();
      res.status(200).json(averageCapacity); // Ajouter .json() pour renvoyer les données
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the average capacity" });
    }
  }

async function CapacityAbove (req,res) {
    try {
        const CapacityAbove = await EscapeService.CapacityAbove(req.params.capacity);
        res.status(200);
        res.json(CapacityAbove);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function PricesAbove (req,res) {
    try {
        const PricesAbove = await EscapeService.PricesAbove(req.params.price);
        res.status(200);
        res.json(PricesAbove);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function GamesByDifficulty (req,res) {
    try {
        const GamesByDifficulty = await EscapeService.GamesByDifficulty(req.params.difficulty);
        res.status(200);
        res.json(GamesByDifficulty);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function AvailableGamesByDifficulty (req,res) {
    try {
        const AvailableGamesByDifficulty = await EscapeService.AvailableGamesByDifficulty(req.params.difficulty);
        res.status(200);
        res.json(AvailableGamesByDifficulty);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function PricesBelow (req,res) {
    try {
        const PricesBelow = await EscapeService.PricesBelow(req.params.price);
        res.status(200);
        res.json(PricesBelow);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function PricesBetween (req,res) {
    try {
        const PricesBetween = await EscapeService.PricesBetween(req.params.minPrice, req.params.maxPrice);
        res.status(200);
        res.json(PricesBetween);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function AddGame (req,res) {
    try {
        const newGame = await EscapeService.AddGame(req.body);
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function UpdateGame (req,res) {
    try {
        const UpdateGame = await EscapeService.UpdateGame(req.params.id, req.body);
        res.status(200);
        res.json(UpdateGame);
    } catch (error) {
        res.status(500);
        res.json({ message : "An error as occurred while fetching the game"})
    }
}

async function DeleteGame (req,res) {
    try {
        await EscapeService.DeleteGame(req.params.id);
        // Pour 204 No Content, envoyez juste le statut sans corps
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).json({ 
            message: "An error occurred while deleting the game",
            error: error.message 
        });
    }
}

module.exports = {
    AllGames,
    OneGame,
    AvailableGames,
    averageCapacity,
    CapacityAbove,
    PricesAbove,
    GamesByDifficulty,
    AvailableGamesByDifficulty,
    PricesBelow,
    PricesBetween,
    AddGame,
    UpdateGame,
    DeleteGame
    };