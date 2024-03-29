const User = require("../models/User")
const Merchant = require("../models/Merchant")
const jwt = require("jsonwebtoken")

exports.isAuthenticated = async (req,res,next) => {

    try {
        const {token} = req.cookies;              //npm i cookie-parser
        // console.log(token)

        if(!token){
        return res.status(401).json({
            success:false,
            message: "Please login first"
        })
        }

        //First we gave user._id and JWT_SECRET to generate "encoded token"
        //Now we are giving token and JWT_SECRET to encode the given user_.id    
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        //From here we are defining req.user
        if(decoded.role==="USER"){
            req.user = await User.findById(decoded._id);
            next()
        }else{
            req.merchant = await Merchant.findById(decoded._id)
            next()
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}