const mongoose = require("mongoose");
const express = require("express");
const http = require('http'); 
const socketIo = require("socket.io");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const API_PORT = 3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const dbRoute = "mongodb+srv://aol2:Az9999@cluster0.ufeirlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

io.on('connection', (socket) => {
    console.log('A new client connected');
    socket.on('test', (data) => {
        console.log(data);
        socket.emit('testResponse', { message: 'Test response received!' });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
