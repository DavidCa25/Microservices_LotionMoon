const axios = require('axios');
const Performance = require('../models/Perfomance');

const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || 'http://localhost:3001/api/admin';

exports.calculateDailyPerformance = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [salesRes, purchasesRes, clientsRes, inventoryRes, productsRes] = await Promise.all([
      axios.get(`${ADMIN_BASE_URL}/sales`),
      axios.get(`${ADMIN_BASE_URL}/purchases`),
      axios.get(`${ADMIN_BASE_URL}/clients`),
      axios.get(`${ADMIN_BASE_URL}/inventory`),
      axios.get(`${ADMIN_BASE_URL}/products`),
    ]);

    const sales = salesRes.data;
    const purchases = purchasesRes.data;
    const clients = clientsRes.data;
    const inventory = inventoryRes.data;
    const products = productsRes.data;

    const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalSalesCount = sales.length;

    const totalPurchasesAmount = purchases.reduce((acc, purchase) => acc + purchase.total, 0);
    const totalPurchasesCount = purchases.length;

    const totalClients = clients.length;
    const activeClientsToday = new Set(sales.map(s => s.clientId)).size;

    // Mapa de productos vendidos
    const topSellingMap = {};
    for (let sale of sales) {
      for (let item of sale.products) {
        const productId = item.inventoryID?.product?._id;
        const price = item.inventoryID?.product?.price || 0;

        if (!productId) continue;

        if (!topSellingMap[productId]) {
          topSellingMap[productId] = { unitsSold: 0, revenue: 0 };
        }

        topSellingMap[productId].unitsSold += item.quantity;
        topSellingMap[productId].revenue += item.quantity * price;
      }
    }


    const topSellingProducts = Object.entries(topSellingMap).map(([productId, data]) => {
      const product = products.find(p => p._id === productId);
      return {
        productId,
        name: product?.name || 'Desconocido',
        unitsSold: data.unitsSold,
        revenue: data.revenue
      };
    });

    const inventorySnapshot = inventory.map(item => {
      const product = products.find(p => p._id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || 'Desconocido',
        stock: item.stock
      };
    });

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
    console.error('[CRON ERROR] Failed to calculate performance:', err);

  }
};

exports.getPerformanceByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date query param is required' });

  try {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const result = await Performance.findOne({
      date: { $gte: start, $lte: end }
    });

    if (!result) return res.status(404).json({ message: 'No performance data found for this date' });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance by date', error });
  }
};

exports.getLatestPerformance = async (req, res) => {
  try {
    const latest = await Performance.findOne().sort({ date: -1 });
    if (!latest) return res.status(404).json({ message: 'No performance data found' });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest performance data', error });
  }
};

exports.getAllPerformance = async (req, res) => {
  try {
    const performanceData = await Performance.find().sort({ date: -1 });
    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance data', error });
  }
};


