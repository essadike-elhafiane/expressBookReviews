const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
    //   console.log(req.user.username)
      next();
    });
  } else {
    return res.status(401).json({ message: "Token not found" });
  }
});

const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
