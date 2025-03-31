const reservationService = require("../services/reservationService");

async function allReservations(req, res) {
  try {
    const allReservations = await reservationService.allReservations();
    res.status(200);
    res.json(allReservations);
  } catch (error) {
    res.status(500);
    res.json({ error: "An error occurred while fetching reservations." });
  }
}

async function OneReservation(req, res) {
  try {
    const oneReservation = await reservationService.OneReservation(
      req.params.id
    );
    res.status(200);
    res.json(oneReservation);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservation." });
  }
}

async function reservationsByStatus(req, res) {
  try {
    const reservationsByStatus = await reservationService.reservationsByStatus(
      req.params.reservation_status
    );
    res.status(200);
    res.json(reservationsByStatus);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservations." });
  }
}

async function averageTotalCost(req, res) {
  try {
    const averageTotalCost = await reservationService.averageTotalCost();
    res.status(200);
    res.json(averageTotalCost);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      error: "An error occurred while fetching the average total cost.",
    });
  }
}

async function costAbove(req, res) {
  try {
    const costAbove = await reservationService.costAbove(req.params.price);
    res.status(200);
    res.json(costAbove);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservations." });
  }
}

async function reservationsByNomEscape(req, res) {
  try {
    const reservationsByNomEscape =
      await reservationService.reservationsByNomEscape(req.params.nom);
    res.status(200);
    res.json(reservationsByNomEscape);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while fetching the reservations." });
  }
}

async function maxReservations(req, res) {
  try {
    const maxReservations = await reservationService.maxReservations();
    res.status(200);
    res.json(maxReservations);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({
      error: "An error occurred while fetching the maximum reservations.",
    });
  }
}

async function AddReservation(req, res) {
  try {
    const newReservation = await reservationService.AddReservation(req);
    res.status(201);
    res.json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while adding the reservation." });
  }
}

async function UpdateReservation(req, res) {
  try {
    const updatedReservation = await reservationService.UpdateReservation(
      req.params.id,
      req.body
    );
    res.status(200);
    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while updating the reservation." });
  }
}
async function DeleteReservation(req, res) {
  try {
    await reservationService.DeleteReservation(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: "An error occurred while deleting the reservation." });
  }
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
