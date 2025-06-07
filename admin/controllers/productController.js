const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

exports.createProduct = async (req, res) => {
    const { productName, productDescription, price, brand } = req.body;

    if (!productName || !productDescription || !price || !brand) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const [newProduct] =  await Product.create([{ productName, productDescription, price, brand }], { session });

        await Inventory.create([{ stock: 0, minimunStock: 10, maximunStock: 25, product: newProduct._id }], 
        { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newProduct);

    } catch (error) {   
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Error creating product', error });
    }
};  

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, price, brand } = req.body;

    if (!productName || !price || !brand || !productDescription) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productName, price, brand, productDescription },
            { new: true }
        ).populate('inventory');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Inventory.deleteOne({ product: id });
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
}


