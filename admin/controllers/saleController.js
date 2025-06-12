const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find()
        .populate("clientID", "clientName")
        .populate("employeeID", "employeeName")
        .populate({
            path: "products.inventoryID",
            populate: {
                path: "product",
                select: "productName price"
            }
        });
    res.status(200).json(sales);
    }catch (error) {
        res.status(500).json({ message: 'Error fetching sales', error });
    }
}

exports.createSale = async (req, res) => {
    const { products, totalPrice, clientID, employeeID } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'At least one product is required' });
    }

    if (!products || !Array.isArray(products) || products.length === 0 || !totalPrice || !clientID || !employeeID) {
    return res.status(400).json({ message: 'Products, total, clientID, and employeeID are required' });
    }


    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const product of products) {
            const { inventoryID, quantity } = product;

            const inventoryItem = await Inventory.findById(inventoryID).session(session);
            if (!inventoryItem) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Inventory item with ID ${inventoryID} not found` });
            }
            if (inventoryItem.stock < quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for product with ID ${inventoryID}` });
            }
            inventoryItem.stock -= quantity;
            await inventoryItem.save({ session });
        }
    
       const newSale = new Sale({
        total: totalPrice,
        clientID,
        employeeID,
        products
    });

    await newSale.save({ session });


        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Sale created successfully', sale: newSale});
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Error creating sale', error });
    }
};
