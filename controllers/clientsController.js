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
        const result = await clientsService.maxAmountSpent();
        
        // Vérifier si le résultat est vide et gérer ce cas
        if (!result || result.length === 0) {
            return res.status(404).json({ 
                message: "Aucun client avec des paiements n'a été trouvé" 
            });
        }
        
        // Utiliser le chaînage pour éviter les erreurs potentielles
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in maxAmountSpent:", error);
        res.status(500).json({ 
            error: 'An error occurred while fetching the maximum amount spent.',
            details: error.message 
        });
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

async function UpdateClient(req, res) {
    try {
        // Vérifier que l'ID client existe
        const existingClient = await clientsService.oneClient(req.params.id);
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found.' });
        }
        
        // Créer un objet avec les données à mettre à jour
        const updateData = {};
        
        // Copier les champs à mettre à jour (sauf le mot de passe pour l'instant)
        const allowedFields = ['prenom', 'nom', 'email', 'phone', 'role'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        
        // Traiter le mot de passe séparément s'il est fourni
        if (req.body.password) {
            // Hasher le mot de passe avant de le stocker
            updateData.password = bcrypt.hashSync(req.body.password, 10);
        }
        
        // Vérifier qu'il y a des données à mettre à jour
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update.' });
        }
        
        // Mettre à jour le client
        const updatedClient = await clientsService.UpdateClient(updateData, req.params.id);
        
        // Retourner la réponse
        res.status(200).json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ 
            error: 'An error occurred while updating the client.',
            details: error.message 
        });
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

async function GetClientByEmail(req, res) {
    try {
        const client = await clientsService.findClientByEmail(req.params.email);
        if (!client) {
            res.status(404);
            res.json({ error: 'Client not found.' });
            return;
        }
        res.status(200);
        res.json(client);
    } catch (error) {
        res.status(500);
        res.json({ error: 'An error occurred while fetching the client by email.' });
    }
}

async function findMe(req,res) {
    try {
        // req.user est extrait du token par le middleware verifyToken
        // et contient l'ID du client dans req.user.id
        const user = await clientsService.oneClient(req.user.id);
        
        if (!user) {
          return res.status(404).json({ error: 'Client not found.' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Erreur dans findMe:", error);
        res.status(500).json({ error: 'An error occurred while fetching the client details.' });
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
    findMe,
    GetClientByEmail
};