const RewardModel = require("../services/rewardService");

// Créer une nouvelle récompense
const createReward = async (req, res) => {
  try {
    const { code, id_client, discount_percent, expiration_date } = req.body;

    // Vérifier si le code existe déjà
    const existingReward = await RewardModel.findByCode(code);
    if (existingReward) {
      return res
        .status(400)
        .json({ error: "Ce code de réduction existe déjà" });
    }

    const reward = {
      code,
      id_client,
      discount_percent: discount_percent || 10, // 10% par défaut
      expiration_date:
        expiration_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours par défaut
      used: 0,
      created_at: new Date(),
    };

    const newReward = await RewardModel.create(reward);
    res.status(201).json(newReward);
  } catch (error) {
    console.error("Erreur lors de la création de la récompense:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la récompense" });
  }
};

// Vérifier la validité d'un code de réduction
const validateReward = async (req, res) => {
    try {
      const { code } = req.params;
      const reward = await RewardModel.findByCode(code);
  
      if (!reward) {
        return res.status(404).json({ 
          valid: false,
          error: "Code de réduction invalide" 
        });
      }
  
      if (reward.used === 1) {
        return res.status(400).json({ 
          valid: false,
          error: "Ce code a déjà été utilisé" 
        });
      }
  
      const expirationDate = new Date(reward.expiration_date);
      if (expirationDate < new Date()) {
        return res.status(400).json({ 
          valid: false,
          error: "Ce code a expiré" 
        });
      }
  
      // Ajouter l'ID de la récompense dans la réponse
      res.status(200).json({
        valid: true,
        id_reward: reward.id_reward, // Ajout de l'ID ici
        discount_percent: reward.discount_percent,
        expiration_date: reward.expiration_date,
      });
    } catch (error) {
      console.error("Erreur lors de la validation du code:", error);
      res.status(500).json({ 
        valid: false,
        error: "Erreur lors de la validation du code" 
      });
    }
  };

// Récupérer les récompenses d'un utilisateur
const getUserRewards = async (req, res) => {
  try {
    const { id } = req.params;
    const rewards = await RewardModel.findByUserId(id);
    res.status(200).json(rewards);
  } catch (error) {
    console.error("Erreur lors de la récupération des récompenses:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des récompenses" });
  }
};

// Marquer une récompense comme utilisée
const useReward = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Vérifiez d'abord si la récompense existe
      const connection = require("../config/bdd");
      const [rewardCheck] = await connection
        .promise()
        .query("SELECT * FROM rewards WHERE id_reward = ?", [id]);
        
      if (rewardCheck.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: "Code de réduction non trouvé" 
        });
      }
      
      // Vérifiez si elle n'est pas déjà utilisée
      if (rewardCheck[0].used === 1) {
        return res.status(400).json({ 
          success: false,
          message: "Ce code a déjà été utilisé" 
        });
      }
      
      // Mettez à jour le statut en utilisé
      await RewardModel.markAsUsed(id);
      
      // Vérifiez que la mise à jour a bien été effectuée
      const [updatedReward] = await connection
        .promise()
        .query("SELECT used FROM rewards WHERE id_reward = ?", [id]);
        
      if (updatedReward.length > 0 && updatedReward[0].used === 1) {
        return res.status(200).json({ 
          success: true,
          message: "Récompense marquée comme utilisée avec succès"
        });
      } else {
        return res.status(500).json({ 
          success: false,
          message: "Échec de la mise à jour du statut de la récompense" 
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'utilisation de la récompense:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'utilisation de la récompense",
        error: error.message
      });
    }
  };

const deleteReward = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si la récompense existe
    const connection = require("../config/bdd");
    const [reward] = await connection
      .promise()
      .query("SELECT * FROM rewards WHERE id_reward = ?", [id]);

    if (reward.length === 0) {
      return res.status(404).json({ error: "Code de réduction non trouvé" });
    }

    // Vérifier que l'utilisateur est bien le propriétaire du code
    if (reward[0].id_client !== req.user.id && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Vous n'êtes pas autorisé à supprimer ce code" });
    }

    // Supprimer la récompense
    await connection
      .promise()
      .query("DELETE FROM rewards WHERE id_reward = ?", [id]);

    res.status(200).json({ message: "Code de réduction supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du code de réduction:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du code de réduction" });
  }
};

module.exports = {
  createReward,
  validateReward,
  getUserRewards,
  useReward,
  deleteReward,
};
