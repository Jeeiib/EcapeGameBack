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

function reservationsByClientId(id_client) {
  return connection
    .promise()
    .query("SELECT reservation.*, escape_game.nom_escape FROM reservation JOIN escape_game ON escape_game.id_escape = reservation.id_escape WHERE id_client = ?", [id_client])
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

function reservationsByEscapeId(id_escape) {
  return connection
    .promise()
    .query("SELECT * FROM reservation WHERE id_escape = ?", [id_escape])
    .then((results) => {
      return results[0];
    });
}

async function AddReservation(reservation) {
  console.log("Données de réservation reçues:", reservation);
  
  try {
    // Validation des données requises
    if (!reservation.id_client) {
      throw new Error("id_client manquant dans les données de réservation");
    }
    if (!reservation.id_escape) {
      throw new Error("id_escape manquant dans les données de réservation");
    }
    if (!reservation.date_heure) {
      throw new Error("date_heure manquant dans les données de réservation");
    }
    
    // S'assurer que la date est au format correct pour MySQL (YYYY-MM-DD HH:MM:SS)
    let dateHeure = reservation.date_heure;
    
    // Vérifier si la date est au bon format
    if (!dateHeure.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      // Si l'heure ne contient pas les secondes, les ajouter
      if (dateHeure.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
        dateHeure += ":00";
      }
      // Si le format n'est toujours pas correct, essayer de parser la date
      if (!dateHeure.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        try {
          const dateObj = new Date(dateHeure);
          if (isNaN(dateObj.getTime())) {
            throw new Error("Format de date invalide");
          }
          // Formatage de la date en YYYY-MM-DD HH:MM:SS
          dateHeure = dateObj.toISOString().slice(0, 19).replace("T", " ");
        } catch (error) {
          console.error("Erreur lors du parsing de la date:", error);
          throw new Error("Format de date invalide: " + dateHeure);
        }
      }
    }
    
    console.log("Date formatée pour insertion:", dateHeure);
    
    // Vérifier si le créneau est déjà réservé
    const existingReservations = await connection
      .promise()
      .query(
        "SELECT * FROM reservation WHERE id_escape = ? AND DATE(date_heure) = DATE(?) AND TIME(date_heure) = TIME(?)",
        [reservation.id_escape, dateHeure, dateHeure]
      );
    
    if (existingReservations[0].length > 0) {
      throw new Error("Ce créneau est déjà réservé pour cet escape game");
    }
    
    // Insertion de la réservation avec tous les champs nécessaires
    const results = await connection
      .promise()
      .query(
        "INSERT INTO reservation (id_client, id_escape, lieu, reservation_status, prix_total, date_heure, nombre_participants) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          reservation.id_client,
          reservation.id_escape,
          reservation.lieu || "Sur site", // Valeur par défaut
          reservation.reservation_status || "En attente",
          reservation.prix_total,
          dateHeure,
          reservation.nombre_participants || 1,
        ]
      );
    
    const insertId = results[0].insertId;
    
    // Récupérer la réservation créée pour la renvoyer
    const newReservation = await connection
      .promise()
      .query("SELECT * FROM reservation WHERE id_reservation = ?", [insertId]);
    
    return {
      id_reservation: insertId,
      ...newReservation[0][0]
    };
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
    reservationsByEscapeId,
    reservationsByClientId
    };