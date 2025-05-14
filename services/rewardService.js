const connection = require("../config/bdd");

const Reward = {
  create: (reward) => {
    return connection
      .promise()
      .query("INSERT INTO rewards SET ?", reward)
      .then(([result]) => {
        return { id: result.insertId, ...reward };
      });
  },
  
  findByCode: (code) => {
    return connection
      .promise()
      .query("SELECT * FROM rewards WHERE code = ?", [code])
      .then(([results]) => results[0]);
  },
  
  findByUserId: (userId) => {
    return connection
      .promise()
      .query("SELECT * FROM rewards WHERE id_client = ?", [userId])
      .then(([results]) => results);
  },
  
  markAsUsed: (id) => {
    return connection
      .promise()
      .query("UPDATE rewards SET used = 1 WHERE id_reward = ?", [id])
      .then(([result]) => {
        // Vérifier si la mise à jour a réellement modifié une ligne
        if (result.affectedRows === 0) {
          throw new Error("Aucun code de réduction trouvé avec cet ID");
        }
        // Retourner un objet avec la confirmation de mise à jour
        return { 
          success: true, 
          message: "Code de réduction marqué comme utilisé",
          affectedRows: result.affectedRows 
        };
      });
  },
  
  // Ajouter une méthode pour vérifier l'état d'utilisation d'un code
  checkUsageStatus: (id) => {
    return connection
      .promise()
      .query("SELECT used FROM rewards WHERE id_reward = ?", [id])
      .then(([results]) => {
        if (results.length === 0) {
          throw new Error("Code de réduction non trouvé");
        }
        return { 
          used: results[0].used === 1,
          id: id
        };
      });
  }
};

module.exports = Reward;