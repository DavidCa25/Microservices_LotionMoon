const axios = require('axios');
const Performance = require('../models/Perfomance');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Client = require('../models/Client');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

exports.calculateDailyPerformance = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const sales = await Sale.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const purchases = await Purchase.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });

    const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalSalesCount = sales.length;

    const totalPurchasesAmount = purchases.reduce((acc, purchase) => acc + purchase.total, 0);
    const totalPurchasesCount = purchases.length;

    const allClients = await Client.find();
    const totalClients = allClients.length;

    const activeClientsToday = new Set(sales.map(s => s.clientId.toString())).size;

    const topSellingMap = {};
    for (let sale of sales) {
      for (let item of sale.items) {
        const productId = item.productId.toString();
        if (!topSellingMap[productId]) {
          topSellingMap[productId] = { unitsSold: 0, revenue: 0 };
        }
        topSellingMap[productId].unitsSold += item.quantity;
        topSellingMap[productId].revenue += item.total;
      }
    }

    const topSellingProducts = await Promise.all(
      Object.entries(topSellingMap).map(async ([productId, data]) => {
        const product = await Product.findById(productId);
        return {
          productId: product._id,
          name: product.name,
          unitsSold: data.unitsSold,
          revenue: data.revenue
        };
      })
    );

    const allInventory = await Inventory.find().populate('productId');
    const inventorySnapshot = allInventory.map(inv => ({
      productId: inv.productId._id,
      name: inv.productId.name,
      stock: inv.stock
    }));

    await Performance.create({
      date: new Date(),
      totalSalesAmount,
      totalSalesCount,
      totalPurchasesAmount,
      totalPurchasesCount,
      totalClients,
      activeClientsToday,
      inventorySnapshot,
      topSellingProducts
    });

    console.log('[CRON] Performance snapshot saved successfully.');
  } catch (err) {
    console.error('[CRON ERROR] Failed to calculate daily performance:', err);
  }
};
