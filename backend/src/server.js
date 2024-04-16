const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const API_PORT = 3001;
const app = express();
app.use(cors());
const dbRoute =
  "mongodb+srv://aol2:Az9999@cluster0.ufeirlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
