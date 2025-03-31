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
      return results[0];
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
    .query('SELECT AVG(prix_total) AS "Montant moyen" FROM reservation')
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
      "SELECT * FROM reservations INNER JOIN escape_game ON escape_game.id_escape = "
    );
}

function maxReservations() {
  return connection
    .promise()
    .query(
      'SELECT client.id_client, count(id_reservation) AS "Nombre de réservations" FROM client INNER JOIN reservation ON reservation.id_client = client.id_client GROUP, BY client.id_client'
    )
    .then((results) => {
      return results[0];
    });
}

async function AddReservation(reservation) {
  return connection
    .promise()
    .query(
      'INSERT INTO reservation SET id_client = ?, id_escape = ?, date_heure = ?, prix_total = ?, reservation_status = "en attente" ',
      [
        reservation.user.id_client,
        reservation.body_id_escape,
        reservation.body_date_heure,
        reservation.body_prix_total,
      ]
    )
    .then((results) => {
      return results[0];
    });
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