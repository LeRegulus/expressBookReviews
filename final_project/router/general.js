const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// function to fetch books
async function fetchBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); // Replace this with actual database/API call
    }, 1000);
  });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await fetchBooks();
    return res.status(200).json({ message: "All books available", books: allBooks });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
});

// Get book details based on isbn
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  // Simulate an asynchronous operation to fetch book details
  fetchBookByISBN(isbn)
    .then((book) => {
      return res.status(200).json({ message: "Book found", book: book });
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

//  function to fetch a book by ISBN
function fetchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]); // Book exists
      } else {
        reject({ status: 404, message: "Book not found" }); // Book does not exist
      }
    }, 1000); // Simulating delay (1 second)
  });
}
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;

  // Simulate an asynchronous operation to fetch books by author
  fetchBooksByAuthor(author)
    .then((authorBooks) => {
      if (authorBooks.length > 0) {
        return res.status(200).json({ message: "Books found", books: authorBooks });
      } else {
        return res.status(404).json({ message: "Books not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// function to fetch books by author
function fetchBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let authorBooks = [];
      for (let book in books) {
        if (books[book].author === author) {
          authorBooks.push(books[book]);
        }
      }
      if (authorBooks.length > 0) {
        resolve(authorBooks); // Found books by author
      } else {
        reject({ message: "Books not found" }); // No books found by author
      }
    }, 1000); // Simulating a delay of 1 second
  });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  let titleBooks = [];
  for (let book in books) {
    if (books[book].title === title) {
      titleBooks.push(books[book]);
    }
  }
  if (titleBooks.length > 0) {
    return res.status(200).json({message: "Books found", books: titleBooks});
  } else {
    return res.status(404).json({message: "Books not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json({message: "Book found", reviews: books[isbn].reviews});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
