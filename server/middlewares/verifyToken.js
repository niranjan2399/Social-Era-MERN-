if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const JWT_PRIVATE_KEY = fs.readFileSync(path.resolve("jwtRSA256-private.pem"));

exports.verifyToken = (req, res, next) => {
  // const { token } = req.cookies;
  if (req.headers.cookie.includes("token")) {
  } else {
  }

  const token = req.headers.cookie.split(";")[0].split("=")[1];

  try {
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY, {
      algorithms: ["RS256"],
    });
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
