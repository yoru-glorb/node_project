const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController');

router.get('/', HomeController.index);
router.get('/old-index', HomeController.oldIndex);

module.exports = router;

