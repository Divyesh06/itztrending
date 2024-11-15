const express=require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const cron = require("./cron")
const url="mongodb+srv://divyesh:div123@cluster0.538la.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const server=express();
const cookieParser = require('cookie-parser');

mongoose.connect(url)

const conn = mongoose.connection

conn.on("open",function() {
    console.log("Database Connected")
})

const trendRoute = require("./routes/trend_routes")
const messageRoute = require("./routes/messaging_routes")
const authRoute = require("./routes/auth_routes")

server.use(cors({credentials: true, origin: "http://localhost:3000"}))

server.use(express.json())

server.use(cookieParser());

server.use("/api/trends",trendRoute)

server.use("/api/messaging", messageRoute)

server.use("/api/auth", authRoute)

server.listen(5000, function() {
    console.log("Server started on port 5000")
})