const connection = require("../config/bdd");

function allPayments() {
  return connection
    .promise()
    .query("SELECT * FROM payment")
    .then((results) => {
      return results[0];
    });
}

function onePayment(id) {
  return connection
    .promise()
    .query("SELECT * FROM payment WHERE id_payment = ?", [id])
    .then((results) => {
      return results[0];
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

function totalByMonthAndYear(month,year){
    return connection.promise().query('SELECT SUM(amount) AS "Montant total" FROM payment WHERE MONTH(payment_date) = ? AND YEAR(payment_date) = ?', [month,year])
    .then((results) => {
        return results[0];
    });
}

function paymentsAbove(amount) {
    return connection.promise().query('SELECT * FROM payment WHERE amount >= ?', [amount])
    .then((results) => {
        return results[0];
    });
}

function paymentsByReservationsStatus(satus) {
    return connection.promise().query('SELECT * FROM payment JOIN payer ON payer.id_payment = payment.id_payment JOIN reservation ON reservation.id_reservation = payer.id_reservation WHERE reservation.status = ?', [satus])
    .then((results) => {
        return results[0];
    });
}

function totalByReservationsStatus(status) {
    return connection.promise().query('SELECT SUM(amount) FROM payment JOIN payer ON payer.id_payment = payment.id_payment JOIN reservation ON reservation.id_reservation = payer.id_reservation WHERE reservation.status = ?', [status])
    .then((results) => {
        return results[0];
    });
}

function countByMethod(method) {
    return connection.promise().query('SELECT COUNT(*) FROM payment WHERE payment_method = ?', [method])
    .then((results) => {
        return results[0];
    });
}

async function AddPayment(payment) {
    return connection.promise().query('INSERT INTO payment SET ?', [payment])
    .then((results) => {
        return results[0];
    });
}
async function UpdatePayment(id, payment) {
    return connection.promise().query('UPDATE payment SET ? WHERE id_payment = ?', [payment, id])
    .then((results) => {
        return results[0];
    });
}

async function DeletePayment(id) {
    return connection.promise().query('DELETE FROM payment WHERE id_payment = ?', [id])
    .then((results) => {
        return results[0];
    });
}

module.exports = {
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
    DeletePayment
    };
