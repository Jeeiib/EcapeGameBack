const connection = require("../config/bdd");

function allReservations() {
  return connection
    .promise()
    .query("SELECT * FROM reservation")
    .then((results) => {
      return results[0];
    });
}

function OneReservation(id) {
  return connection
    .promise()
    .query("SELECT * FROM reservation WHERE id_reservation = ?", [id])
    .then((results) => {
      return results[0][0];
    });
}

function reservationsByStatus(reservation_status) {
  return connection
    .promise()
    .query("SELECT * FROM reservation WHERE reservation_status = ?", [
      reservation_status,
    ])
    .then((results) => {
      return results[0];
    });
}

function averageTotalCost() {
  return connection
    .promise()
    .query('SELECT AVG(prix_total) AS averageTotalCost FROM reservation')
    .then((results) => {
      return results[0];
    });
}

function costAbove(price) {
  return connection
    .promise()
    .query("SELECT * FROM reservation WHERE prix_total >= ?", [price])
    .then((results) => {
      return results[0];
    });
}

function reservationsByNomEscape(nom) {
  return connection
    .promise()
    .query(
      "SELECT reservation.* FROM reservation " +
      "INNER JOIN escape_game ON escape_game.id_escape = reservation.id_escape " +
      "WHERE escape_game.nom_escape = ?",
      [nom]
    )
    .then((results) => {
      return results[0];
    })
    .catch(error => {
      console.error("Error in reservationsByNomEscape:", error);
      throw error;
    });
}

function maxReservations() {
  return connection
    .promise()
    .query(
      'SELECT client.id_client, count(id_reservation) AS "Nombre de réservations" FROM client INNER JOIN reservation ON reservation.id_client = client.id_client GROUP BY client.id_client'
    )
    .then((results) => {
      return results[0];
    });
}

async function AddReservation(reservation) {
  console.log("Données de réservation reçues:", reservation);
  
  try {
    const results = await connection
      .promise()
      .query(
        "INSERT INTO reservation (id_client, id_escape, lieu, reservation_status, prix_total, date_heure) VALUES (?, ?, ?, ?, ?, ?)",
        [
          reservation.id_client,
          reservation.id_escape,
          reservation.lieu,
          reservation.reservation_status || "En attente", // Par défaut "En attente" si non fourni
          reservation.prix_total,
          reservation.date_heure,
        ]
      );
    console.log("Résultat de l'insertion:", results);
    return { id_reservation: results[0].insertId }; // Retourner l'ID généré
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réservation:", error);
    throw error;
  }
}

async function UpdateReservation(id, reservation) {
  await connection
    .promise()
    .query("UPDATE reservation SET ? WHERE id_reservation = ?", [
      reservation,
      id,
    ]);
  return await OneReservation(id);
}

async function DeleteReservation(id) {
    return connection
    .promise()
    .query("DELETE FROM reservation WHERE id_reservation = ?", [id])
    .then((results) => {
      return results[0];
    }); 
}

module.exports = {
    allReservations,
    OneReservation,
    reservationsByStatus,
    averageTotalCost,
    costAbove,
    reservationsByNomEscape,
    maxReservations,
    AddReservation,
    UpdateReservation,
    DeleteReservation,
    };