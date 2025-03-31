const clientsService = require('../services/clientsService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function AllClients(req, res) {
    try {
        const allClients = await clientsService.allClients();
        res.status(200);
        res.json(allClients);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching clients.' });
    }
}

async function OneClient(req, res) {
    try {
        const oneClient = await clientsService.oneClient(req.params.id);
        res.status(200);
        res.json(oneClient);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching the client.' });
    }
}

async function clientsByYear(req, res) {
    try {
        const clientsByYear = await clientsService.clientsByYear(req.params.year);
        res.status(200);
        res.json(clientsByYear);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching clients by year.' });
    }
}

async function totalCostAbove(req, res) {
    try {
        const totalCostAbove = await clientsService.totalCostAbove(req.params.price);
        res.status(200);
        res.json(totalCostAbove);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching clients with total cost above.' });
    }
}

async function clientsByRegistrationDate(req, res) {
    try {
        const clientsByRegistrationDate = await clientsService.clientsByRegistrationDate(req.params.month, req.params.year);
        res.status(200);
        res.json(clientsByRegistrationDate);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching clients by registration date.' });
    }
}

async function clientsByReservationDate(req, res) {
    try {
        const clientsByReservationDate = await clientsService.clientsByReservationDate(req.params.month, req.params.year);
        res.status(200);
        res.json(clientsByReservationDate);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching clients by reservation date.' });
    }
}

async function clientsByEscapeRoom(req, res) {
    try {
        const clientsByEscapeRoom = await clientsService.clientsByEscapeRoom(req.params.id);
        res.status(200);
        res.json(clientsByEscapeRoom);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching clients by escape room.' });
    }
}

async function maxAmountSpent(req, res) {
    try {
        const maxAmountSpent = await clientsService.maxAmountSpent();
        res.status(200);
        res.json(maxAmountSpent);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching the maximum amount spent.' });
    }
}

async function AddClient (req,res) {
    try {
        // Hash the password
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const AddClient = await clientsService.AddClient(req.body);
        res.status(201);
        res.json(AddClient);
    } catch (error) {
        console.error ('Error adding client:', error);
        res.status(500);
        res.json({ error: 'An error occurred while adding the client.' });
    }
}

async function UpdateClient (req,res) {
    try {
        const UpdateClient = await clientsService.UpdateClient(req.body, req.params.id);
        res.status(200);
        res.json(UpdateClient);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while updating the client.' });
    }
}

async function DeleteClient (req,res) {
    try{
        if(req.user.role !== "ADMIN") {
            res.status(403);
            res.json({ error: 'You do not have permission to delete this client.' });
            return;
        }
        const DeleteClient = await clientsService.DeleteClient(req.params.id);
        res.status(200);
        res.json(DeleteClient);
    }catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while deleting the client.' });
    }
}

async function findMe(req,res) {
    try {
        const user = await clientsService.oneClient(req.user.id);
        res.status(200);
        res.json(user);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching the client.' });
    }
}

module.exports = {
    AllClients,
    OneClient,
    clientsByYear,
    totalCostAbove,
    clientsByRegistrationDate,
    clientsByReservationDate,
    clientsByEscapeRoom,
    maxAmountSpent,
    AddClient,
    UpdateClient,
    DeleteClient,
    findMe
};