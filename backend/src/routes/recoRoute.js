const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recoController');

router.get('/reco', getRecommendations);

module.exports = router;