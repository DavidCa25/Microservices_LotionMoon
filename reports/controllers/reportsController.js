const Report = require('../models/Reports');

exports.createReport = async (req, res) => {
  try {
    const reportData = {
      type: req.body.type,
      parameters: req.body.parameters || {},
      requestedBy: req.user._id, // Asumiendo que tienes autenticación y guardas el usuario en req.user
      status: 'pending'
    };
    const report = new Report(reportData);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const allowedUpdates = ['status', 'fileUrl', 'generatedAt', 'error'];
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Reporte no encontrado' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
