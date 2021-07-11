if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
require("./config/dbConfig.js");
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("common"));
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
