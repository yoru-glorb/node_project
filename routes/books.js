const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

router.get('/add-book', BookController.showAddBook);
router.post('/add-book', BookController.addBook);
router.get('/add-author', BookController.showAddAuthor);
router.post('/add-author', BookController.addAuthor);
router.get('/add-genre', BookController.showAddGenre);
router.post('/add-genre', BookController.addGenre);
router.get('/add-publisher', BookController.showAddPublisher);
router.post('/add-publisher', BookController.addPublisher);

module.exports = router;

