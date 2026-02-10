const express = require('express');
const router = express.Router();
const { getStaticSports, getDbSports } = require('../controllers/sports.controller');

// Static JSON response
router.get('/', getStaticSports);

// Database response
router.get('/db', getDbSports);

module.exports = router;