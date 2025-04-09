const paymentsService = require("../services/paymentsService");

async function allPayments(req, res) {
  try {
    const allPayments = await paymentsService.allPayments();
    res.status(200);
    res.json(allPayments);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while fetching payments." });
  }
}

async function onePayment(req, res) {
  try {
    const onePayment = await paymentsService.onePayment(req.params.id);
    res.status(200);
    res.json(onePayment);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while fetching the payment." });
  }
}

async function paymentsByMethod(req, res) {
  try {
    const payments = await paymentsService.paymentsByMethod(req.params.method);
    res.status(200);
    res.json(payments);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while fetching payments by method." });
  }
}

async function totalByMonthAndYear(req, res) {
  try {
    const total = await paymentsService.totalByMonthAndYear(
      req.params.month,
      req.params.year
    );
    res.status(200);
    res.json(total);
  } catch (error) {
    res.status(500);
    res.json({
      error:
        "An error occurred while fetching total payments by month and year.",
    });
  }
}

async function paymentsAbove(req, res) {
  try {
    const payments = await paymentsService.paymentsAbove(req.params.amount);
    res.status(200);
    res.json(payments);
  } catch (error) {
    res.status(500);
    res.json({
      error:
        "An error occurred while fetching payments above a certain amount.",
    });
  }
}

async function paymentsByReservationsStatus(req, res) {
  try {
    const payments = await paymentsService.paymentsByReservationsStatus(
      req.params.status
    );
    res.status(200);
    res.json(payments);
  } catch (error) {
    res.status(500);
    res.json({
      error: "An error occurred while fetching payments by reservation status.",
    });
  }
}

async function totalByReservationsStatus(req, res) {
  try {
    const total = await paymentsService.totalByReservationsStatus(
      req.params.status
    );
    res.status(200);
    res.json(total);
  } catch (error) {
    res.status(500);
    res.json({
      error:
        "An error occurred while fetching total payments by reservation status.",
    });
  }
}

async function countByMethod(req, res) {
  try {
    const count = await paymentsService.countByMethod(req.params.method);
    res.status(200);
    res.json(count);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while counting payments by method." });
  }
}

async function AddPayment(req, res) {
  try {
    const payment = await paymentsService.AddPayment(req.body);
    res.status(201);
    res.json(payment);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while adding the payment." });
  }
}
async function UpdatePayment(req, res) {
  try {
    const payment = await paymentsService.UpdatePayment(
      req.params.id,
      req.body
    );
    res.status(200);
    res.json(payment);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while updating the payment." });
  }
}

async function DeletePayment(req, res) {
  try {
    const payment = await paymentsService.DeletePayment(req.params.id);
    res.status(204).end;
    res.json(payment);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while deleting the payment." });
  }
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
  DeletePayment,
};
