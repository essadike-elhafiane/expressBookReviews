const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // console.log( "check if exist",users, username);
  //write code to check is the username is valid
  if (users[username]) return true;
  else return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean

  if (users[username] && users[username].password === password) return true;
  else return false;
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer");
    return res
      .status(200)
      .cookie("token", token)
      .json({ message: "customer successfully logged in" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const { review } = req.query;
  // console.log(username, review);
  if (books[req.params.isbn]) {
    if (books[req.params.isbn].reviews[username]) {
      books[req.params.isbn].reviews[username] = { username, review };
      return res
        .status(200)
        .json({
          message:
            "review updated successfully for the book ISBIN " + req.params.isbn,
        });
    }
    books[req.params.isbn].reviews[username] = { username, review };
    return res
      .status(200)
      .json({
        message:
          "review added successfully for the book ISBIN " + req.params.isbn,
      });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  const username = req.user.username;
  const {isbn} = req.params;
  console.log(username, isbn);
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "review for the ISBIN " + isbn + " posted by "+ username +" deleted successfully"});
    }
    return res.status(400).json({message: "review not found"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
}
);

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
