const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');

router.get('/cart', CartController.index);
router.post('/cart/add', CartController.add);
router.post('/cart/remove', CartController.remove);

module.exports = router;

