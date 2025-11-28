const express = require('express');
const router = express.Router();
const CatalogController = require('../controllers/CatalogController');

router.get('/catalog', CatalogController.index);

module.exports = router;

