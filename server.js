const { readdirSync } = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");

// const router = require('./routes/userRoute');

//Application Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(helmet());

// Routes Middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`)))

// ||
// app.use("/api/v1", router)

// Server 
const port = process.env.PORT || 5000;

// Connect to Database and start server
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        app.listen(port, () => {
            console.log(` Server Running on port ${port}`);
        })
    })
    .catch((error) => console.log(error));
