const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  // console.log(username, password);
  if (isValid(username)) {
    return res.status(400).json({message: "customer already exists"});
  }
  users[username] = ({username, password});
  // console.log(users);
  if (users[username]) {
    return res.status(200).json({message: "customer registered successfully, now you can login"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (books) {
    return res.status(200).json(books);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn]);
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  if (books) {
    let bookList = [];
    for (let book in books) {
      if (books[book]?.author === req.params.author) {
       bookList.push( {"sbin":  book ,"title": books[book].title, "reviews": books[book].reviews});
      }
    }
    if (bookList.length > 0) {
      return res.status(200).json({"booksbyauthor" : bookList});
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  if (books) {
    let bookList = [];
    for (let book in books) {
      if (books[book]?.title === req.params.title) {
       bookList.push( {"sbin":  book ,"author": books[book].author, "reviews": books[book].reviews});
      }
    }
    if (bookList.length > 0) {
      return res.status(200).json({"booksbytitle" : bookList});
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn].reviews);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

function getAllBooka() {
  const url = `http://localhost:5001/`;
  return axios.get(url, {
    withCredentials: true
  })
  .then(response => {
    return response.data;
  }
  )
  .catch(error => {
    return error;
  });
}

function getBookDetailsByISBN(isbn) {
  const url = `http://localhost:5001/isbn/${isbn}`;
    return axios.get(url, {
    withCredentials: true
  })
  .then(response => {
    return response.data;
  }
  )
  .catch(error => {
    return error;
  });
}

function getBookDetailsByAuthor(author) {
  const url = `http://localhost:5001/author/${author}`;
  return axios.get(url, {
    withCredentials: true
  })
  .then(response => {
    return response.data;
  }
  )
  .catch(error => {
    return error;
  });
}

async function getBookByTitle(titel)
{
  try{
    const response = await axios.get(`http://localhost:5001/title/${titel}`);
    return response.data;
  }
  catch(err)
  {
    return err
  }
}


module.exports.general = public_users;
