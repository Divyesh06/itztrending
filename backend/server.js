const express=require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const cron = require("./cron")

const url="mongodb+srv://divyesh:div123@cluster0.538la.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const server=express();

mongoose.connect(url)

const conn = mongoose.connection

conn.on("open",function() {
    console.log("Database Connected")
})

const trendRoute = require("./routes/trend_routes")


server.use(cors())

server.use(express.json())

server.use("/api/trends",trendRoute)

server.listen(5000, function() {
    console.log("Server started on port 5000")
})