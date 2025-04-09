const connection = require("../config/bdd");

function allClients() {
  return connection
    .promise()
    .query(
      "SELECT id_client, prenom, nom, email, phone, date_enregistrement FROM client"
    )
    .then((results) => {
      return results[0];
    });
}

function oneClient(id) {
  return connection
    .promise()
    .query(
      "SELECT client.id_client, prenom, nom, email, phone FROM client WHERE id_client = ?",
      [id]
    )
    .then((results) => {
      return results[0][0];
    });
}

function clientsByYear(year) {
  return connection
    .promise()
    .query(
      "SELECT client.id_client, prenom, nom, email, phone, date_enregistrement FROM client INNER JOIN reservation ON reservation.id_client = client.id_client WHERE YEAR(date_heure) = ?",
      [year]
    )
    .then((results) => {
      return results[0];
    });
}

function totalCostAbove(price) {
  return connection
    .promise()
    .query(
      "SELECT client.id_client, prenom, nom, email, phone, date_enregistrement FROM client INNER JOIN reservation ON reservation.id_client = client.id_client WHERE prix_total >= ?",
      [price]
    )
    .then((results) => {
      return results[0];
    });
}

function clientsByRegistrationDate(month, year) {
  return connection
    .promise()
    .query(
      "SELECT id_client, prenom, nom, email, phone, date_enregistrement FROM client WHERE MONTH(date_enregistrement) = ? AND YEAR(date_enregistrement) = ?",
      [month, year]
    )
    .then((results) => {
      return results[0];
    });
}

function clientsByReservationDate(month, year) {
  return connection
    .promise()
    .query(
      "SELECT client.id_client, prenom, nom, email, phone, date_enregistrement FROM client INNER JOIN reservation ON reservation.id_client = client.id_client WHERE MONTH(date_heure) = ? AND YEAR(date_heure) = ?",
      [month, year]
    )
    .then((results) => {
      return results[0];
    });
}

function clientsByEscapeRoom(id) {
  return connection
    .promise()
    .query(
      "SELECT DISTINCT client.id_client, prenom, nom, email, phone, date_enregistrement FROM client INNER JOIN reservation ON reservation.id_client = client.id_client INNER JOIN escape_game ON escape_game.id_escape = reservation.id_escape WHERE escape_game.id_escape = ?",
      [id]
    )
    .then((results) => {
      return results[0];
    });
}

function maxAmountSpent() {
  return connection
    .promise()
    .query(
      'SELECT CONCAT(client.prenom, " ", client.nom) as client, SUM(reservation.prix_total) as total ' +
      'FROM client ' +
      'INNER JOIN reservation ON reservation.id_client = client.id_client ' +
      'GROUP BY client.id_client ' +
      'ORDER BY total DESC ' +
      'LIMIT 1'
    )
    .then((results) => {
      return results[0][0] || { client: "Aucun", total: 0 };
    })
    .catch(error => {
      console.error("Error in maxAmountSpent:", error);
      throw error;
    });
}

function AddClient(clientData) {
  // Assurez-vous d'avoir tous les champs requis par votre table client
  return connection
    .promise()
    .query(
      "INSERT INTO client (prenom, nom, email, phone, password, role, date_enregistrement) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [
        clientData.prenom, 
        clientData.nom, 
        clientData.email, 
        clientData.phone, 
        clientData.password,
        clientData.role || 'USER', // Valeur par défaut si non spécifiée
      ]
    )
    .then(([result]) => {
      return { id: result.insertId, ...clientData, password: undefined };
    });
}

async function UpdateClient(client, id){
    const results = await connection
    .promise()
    .query("UPDATE client SET ? WHERE id_client = ?", [client, id]);
    return await oneClient(id);
}

async function DeleteClient(id){
    await connection
    .promise()
    .query("DELETE FROM client WHERE id_client = ?", [id]);
}

async function findClientByEmail(email) {
  const results = await connection
    .promise()
    .query("SELECT * FROM client WHERE email = ?", [email]);
  return results[0][0];
}

module.exports = {
    allClients,
    oneClient,
    clientsByYear,
    totalCostAbove,
    clientsByRegistrationDate,
    clientsByReservationDate,
    clientsByEscapeRoom,
    maxAmountSpent,
    AddClient,
    UpdateClient,
    DeleteClient,
    findClientByEmail
    };