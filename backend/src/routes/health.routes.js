const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  // In a real scenario, you might check DB connection status here too
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

module.exports = router;