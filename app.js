const express = require("express")
const path = require("path")
const app=express()
var cookieParser = require("cookie-parser")
const cors = require("./middleware/cors");

if(process.env.NODE_ENV !== "Production"){
    require("dotenv").config({path:"config/config.env"});
}

//Using middlewares
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cookieParser())
app.use(cors);


//Importing router
const user = require("./routes/user");
const merchant = require("./routes/merchant")
const login = require('./routes/login')


//Using routes
app.use("/api/v1/user",user)
app.use("/api/v1/merchant",merchant)
app.use("/api/v1",login)

module.exports = app;