const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all books
router.get('/', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get book by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Add new book
router.post('/', (req, res) => {
  const { title, author, genre, isbn } = req.body;
  db.query('INSERT INTO books (title, author, genre, isbn) VALUES (?, ?, ?, ?)', 
    [title, author, genre, isbn],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, title, author, genre, isbn });
  });
});

// Update book
router.put('/:id', (req, res) => {
  const { title, author, genre, isbn } = req.body;
  db.query('UPDATE books SET title = ?, author = ?, genre = ?, isbn = ? WHERE id = ?', 
    [title, author, genre, isbn, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.send('Book updated.');
  });
});

// Delete book
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, result) => {
    if (err) throw err;
    res.send('Book deleted.');
  });
});

module.exports = router;
