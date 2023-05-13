// In your index.js file
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.set('view engine', 'ejs');

const dataFile = 'books.json';

let books = [];

fs.readFile(dataFile, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    books = JSON.parse(data);
  }
});

const saveBooks = () => {
  fs.writeFile(dataFile, JSON.stringify(books), err => {
    if (err) {
      console.log(err);
    }
  });
};

app.get('/', (req, res) => {
  res.render('index', { books });
});

app.get('/books/new', (req, res) => {
  res.render('new');
});

app.post('/books', (req, res) => {
  const book = req.body;
  books.push(book);
  saveBooks();
  res.redirect('/');
});

app.get('/books/:id/edit', (req, res) => {
  const id = req.params.id;
  const book = books.find(book => book.id === id);
  res.render('edit', { book });
});

app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const updatedBook = req.body;
  books = books.map(book => book.id === id ? updatedBook : book);
  saveBooks();
  res.redirect('/');
});

app.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  books = books.filter(book => book.id !== id);
  saveBooks();
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

