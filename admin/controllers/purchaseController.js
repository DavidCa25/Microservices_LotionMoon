const Purchase = require('../models/Purchase');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find().populate({
            path: "products.inventoryID",
            populate: {
                path: "product",
                select: "productName price"
            }
        });
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error });
    }
}

exports.createPurchase = async (req, res) => {
    const { products, total, provider, employeeID } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        res.status(400).json({ message: 'Required at least one product' });
        return;
    }

    if (products.length > 1){
        res.status(400).json({ message: 'Only one product is allowed per purchase' });
        return;
    }

    if (!total || !provider || !employeeID) {
        res.status(400).json({ message: 'Total, provider, and employeeID are required' });
        return;
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const purchase = await Purchase.create([{
            products,
            total,
            provider,
            employeeID
        }], { session });

        const { inventoryID, quantity } = products[0];
        
        const productInventory = await Inventory.findById(inventoryID).session(session);
        if (productInventory){
            productInventory.stock += quantity;
            await productInventory.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Purchase created successfully', purchase });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Error creating purchase', error });
    }
}