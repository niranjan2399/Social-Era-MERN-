if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT;

exports.verifyToken = (req, res, next) => {
  const token = req.headers.cookie.split("=")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
    console.log(err);
  }
  return next();
};
