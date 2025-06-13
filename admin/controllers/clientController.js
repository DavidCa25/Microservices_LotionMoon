const Client = require('../models/Client');

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error });
    }
}

exports.createClient = async (req, res) => {
    console.log('REQ.BODY:', req.body); // <-- Línea clave
    const { clientName, clientEmail } = req.body;

    if (!clientName || !clientEmail) {
        return res.status(400).json({ message: 'Client name and email are required' });
    }

    try {
        const newClient = await Client.create({
            clientName,
            clientEmail
        });

        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error });
    }
};



exports.updateClient = async (req, res) => {
    const { clientID } = req.params;
    const { clientName, clientEmail } = req.body;

    if (!clientName || !clientEmail) {
        return res.status(400).json({ message: 'Client name and email are required' });
    }

    try {
        const updatedClient = await Client.findByIdAndUpdate(clientID, {
            clientName,
            clientEmail
        }, { new: true });

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
}

exports.deleteClient = async (req, res) => {
    const { clientID } = req.params;

    try {
        const deletedClient = await Client.findByIdAndDelete(clientID);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error });
    }
}