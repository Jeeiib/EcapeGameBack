const connection = require("../config/bdd");

function allPayments() {
  return connection
    .promise()
    .query(`
      SELECT p.*, 
             r.id_reservation, 
             c.id_client,
             CONCAT(c.prenom, ' ', c.nom) as client_name,
             e.nom_escape
      FROM payment p
      LEFT JOIN payer py ON py.id_payment = p.id_payment
      LEFT JOIN reservation r ON r.id_reservation = py.id_reservation
      LEFT JOIN client c ON c.id_client = r.id_client
      LEFT JOIN escape_game e ON e.id_escape = r.id_escape
    `)
    .then((results) => {
      return results[0];
    });
}

function onePayment(id) {
  return connection
    .promise()
    .query("SELECT * FROM payment WHERE id_payment = ?", [id])
    .then((results) => {
      return results[0][0];
    });
}

function paymentsByMethod(method) {
  return connection
    .promise()
    .query("SELECT * FROM payment WHERE payment_method LIKE ?", [method])
    .then((results) => {
      return results[0];
    });
}

function totalByMonthAndYear(month, year) {
  return connection
    .promise()
    .query(
      'SELECT SUM(amount) AS "Montant total" FROM payment WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?',
      [month, year]
    )
    .then((results) => {
      return results[0][0];
    });
}

function paymentsAbove(amount) {
  return connection
    .promise()
    .query("SELECT * FROM payment WHERE amount >= ?", [amount])
    .then((results) => {
      return results[0];
    });
}

function paymentsByReservationsStatus(status) {
  return connection
    .promise()
    .query(
      "SELECT * FROM payment JOIN payer ON payer.id_payment = payment.id_payment JOIN reservation ON reservation.id_reservation = payer.id_reservation WHERE reservation.reservation_status = ?",
      [status]
    )
    .then((results) => {
      return results[0];
    });
}
async function linkPaymentToReservation(id_payment, id_reservation) {
  try {
    // Vérifier que le paiement existe
    const payment = await onePayment(id_payment);
    if (!payment) {
      throw new Error(`Le paiement avec l'ID ${id_payment} n'existe pas.`);
    }

    // Vérifier que la réservation existe
    const reservationService = require("./reservationService");
    const reservation = await reservationService.OneReservation(id_reservation);
    if (!reservation) {
      throw new Error(
        `La réservation avec l'ID ${id_reservation} n'existe pas.`
      );
    }

    // Établir la relation dans la table payer
    return connection
      .promise()
      .query("INSERT INTO payer (id_payment, id_reservation) VALUES (?, ?)", [
        id_payment,
        id_reservation,
      ])
      .then((result) => {
        console.log(
          `Relation établie entre paiement ${id_payment} et réservation ${id_reservation}`
        );
        return {
          id_payment,
          id_reservation,
        };
      });
  } catch (error) {
    console.error(
      "Erreur lors de la liaison du paiement à la réservation:",
      error
    );
    throw error;
  }
}

function totalByReservationsStatus(status) {
    return connection
      .promise()
      .query(
        'SELECT SUM(amount) AS "Montant total" FROM payment JOIN payer ON payer.id_payment = payment.id_payment JOIN reservation ON reservation.id_reservation = payer.id_reservation WHERE reservation.reservation_status = ?',
        [status]
      )
      .then((results) => {
        // Renvoyer directement le premier objet du résultat
        return results[0][0];
      });
  }

function countByMethod(method) {
  return connection
    .promise()
    .query("SELECT COUNT(*) FROM payment WHERE payment_method = ?", [method])
    .then((results) => {
      return results[0][0];
    });
}

async function AddPayment(payment) {
  return connection
    .promise()
    .query("INSERT INTO payment SET ?", [payment])
    .then((results) => {
      return results[0];
    });
}
async function UpdatePayment(id, payment) {
  return connection
    .promise()
    .query("UPDATE payment SET ? WHERE id_payment = ?", [payment, id])
    .then((results) => {
      return results[0];
    });
}

async function DeletePayment(id) {
  return connection
    .promise()
    .query("DELETE FROM payment WHERE id_payment = ?", [id])
    .then((results) => {
      return results[0];
    });
}

module.exports = {
  linkPaymentToReservation,
  allPayments,
  onePayment,
  paymentsByMethod,
  totalByMonthAndYear,
  paymentsAbove,
  paymentsByReservationsStatus,
  totalByReservationsStatus,
  countByMethod,
  AddPayment,
  UpdatePayment,
  DeletePayment,
};
