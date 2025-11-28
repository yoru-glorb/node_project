const express = require('express');
const router = express.Router();

const homeRoutes = require('./home');
const authRoutes = require('./auth');
const catalogRoutes = require('./catalog');
const bookRoutes = require('./books');
const cartRoutes = require('./cart');
const profileRoutes = require('./profile');

router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/', catalogRoutes);
router.use('/', bookRoutes);
router.use('/', cartRoutes);
router.use('/', profileRoutes);

module.exports = router;

