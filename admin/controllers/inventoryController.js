const mongoose = require('mongoose');
const Inventory = require('../models/Inventory'); 

    exports.getInventory = async (req, res) => {
        try {
            const products = await Inventory.find().populate("product", "productName price");
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    }

    
    exports.getInventoryById = async (req, res) => {
        const { id } = req.params;
    
        try {
            const inventory = await Inventory.findById(id).populate('product');
    
            if (!inventory) {
                res.status(404).json({ message: "Inventario no encontrado" });
                return;
            }
    
            res.status(200).json({ inventory });
        } catch (error) {
            console.error("Error al obtener inventario:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };
    
    exports.createInventory = async (req, res) => {
        try {
            const { stock, minimumStock, maximumStock, product } = req.body;
    
            if (!stock || !minimumStock || !maximumStock || !product) {
                res.status(400).json({ message: "Faltan campos requeridos" });
                return;
            }

            const newInventory = await Inventory.create({
                stock,
                minimumStock,
                maximumStock,
                product
            });
    
            res.status(201).json({ message: "Inventario creado", inventory: newInventory });
        } catch (error) {
            console.error("Error al crear inventario:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };


    exports.updateInventory = async (req, res) => {
        const { idInventory } = req.params;
        const updateData = req.body;
    
        try {
            const updatedInventory = await Inventory.findByIdAndUpdate(idInventory, updateData, { new: true });
    
            if (!updatedInventory) {
                res.status(404).json({ message: "Inventario no encontrado" });
                return;
            }
    
            res.status(200).json({ message: "Inventario actualizado", inventory: updatedInventory });
        } catch (error) {
            console.error("Error al actualizar inventario:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }; 

    exports.deleteInventory = async (req, res) => {
        const { idInventory } = req.params;
    
        try {
            const deletedInventory = await Inventory.findByIdAndDelete(idInventory);
    
            if (!deletedInventory) {
                res.status(404).json({ message: "Inventario no encontrado" });
                return;
            }
    
            res.status(200).json({ message: "Inventario eliminado" });
        } catch (error) {
            console.error("Error al eliminar inventario:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    };
