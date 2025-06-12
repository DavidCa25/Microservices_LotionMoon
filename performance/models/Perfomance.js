const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  totalSalesAmount: {
    type: Number,
    default: 0 // Sumatoria del monto de las ventas del día
  },
  totalSalesCount: {
    type: Number,
    default: 0 // Número total de ventas
  },
  totalPurchasesAmount: {
    type: Number,
    default: 0 // Sumatoria de las compras de stock
  },
  totalPurchasesCount: {
    type: Number,
    default: 0
  },
  totalClients: {
    type: Number,
    default: 0 // Clientes registrados hasta la fecha
  },
  activeClientsToday: {
    type: Number,
    default: 0 
  },
  inventorySnapshot: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      stock: Number
    }
  ],
  topSellingProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      unitsSold: Number,
      revenue: Number
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);
