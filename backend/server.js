const express=require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const path = require('path');
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
const pollRoute = require("./routes/poll_routes")

server.use(express.static(path.resolve(__dirname, '../frontend/build')))

server.use(cors({credentials: true}))

server.use(express.json())

server.use(cookieParser());

server.use("/api/trends",trendRoute)

server.use("/api/messaging", messageRoute)

server.use("/api/auth", authRoute)

server.use("/api/cron", cron)

server.use("/api/polls", pollRoute)

server.get("*", function(req, res) {
    const filePath = path.resolve(__dirname, '../frontend/build/index.html');
    res.sendFile(filePath);
})


server.listen(5000, function() {
    console.log("Server started on port 5000")
})
