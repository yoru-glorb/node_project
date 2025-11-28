const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const authMiddleware = require('../middleware/auth');

router.get('/profile', authMiddleware, ProfileController.index);

module.exports = router;

