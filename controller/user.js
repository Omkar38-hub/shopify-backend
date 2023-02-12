const User = require("../models/User")
const Merchant = require("../models/Merchant")
const bcrypt = require("bcrypt")

exports.register = async (req,res) => {

    try {

        const {name, email, password, phone} = req.body;

        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"User with same email already exists"
            })
        }

        const newPass = await bcrypt.hash(password,10)

        user = await User.create({
            name,
            email, 
            password: newPass,
            phone,
            avatar:{
                public_id: "Public id",
                url:"Image url"
            },
        })

        //Logging in user As soon as registered
        const token = await user.generateToken();
        let options = {}
        if(process.env.NODE_ENV === "Production")
        {
            options = {
                domain:"https://shopend.netlify.app", 
                expires: new Date(Date.now() + 90*24*60*60*1000),
            }
        }
        else {
            options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
            // httpOnly: true
        }}
        // const options = {                                       // Creating cookie named "token" whose value is token
        //     expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days  
        //     // httpOnly: true
        // }

        res.status(201)                                //201 => created
            .cookie("token", token, options)           //Option contains token expiry details
            .json({
            success:true,
            user,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//User login
exports.login = async (req,res) => {

    try {

        const {email, password} = req.body;

        let user = await User.findOne({email}).select("+password");    //to match the password.. select should be true for password

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exists",
            })
        }

        const isMatch = await user.matchPassword(password);         //function is defined below User schema
        // console.log(isMatch)

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }

        const token = await user.generateToken();               // YOU FORGET TO ADD AWAIT
        let options = {}
        if(process.env.NODE_ENV === "Production")
        {
            options = {
                expires: new Date(Date.now() + 90*24*60*60*1000),
                domain:"https://shopend.netlify.app", 
            }
        }
        else {
            options = {                                       // Creating cookie named "token" whose value is token
                expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
            // httpOnly: true
        }}
        // const options = {                                       // Creating cookie named "token" whose value is token
        //     expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
        //     // httpOnly: true
        // }

        user.lastLogin =  Date.now();
        await user.save()

        res.status(200)
            .cookie("token", token, options)
            .json({
            success:true,
            user,                                                //from here we are fetching user._id
            token
        })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//user Logout
exports.logout = async (req,res) => {

    try {

        res.status(200)
            .cookie("token",null, {expires: new Date(Date.now()), httpOnly:true})
            .json({
                success:true,
                message:"User Logged out"
            })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//My profile data
exports.myProfile = async (req,res) => {

    try {

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            user,            
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//Convert base account to Business account
exports.convertToBusiness = async (req,res) => {

    try {

        const user = await User.findById(req.user._id).select("+password");

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        let merchant = await Merchant.findOne({email: user.email})

        if(merchant){
            return res.status(400).json({
                success: false,
                message: "Merchant with same email already exist",
                merchant
            })
        }

        merchant = await Merchant.create({
            name: user.name,
            email: user.email, 
            password: user.password,
            phone: user.phone,
            avatar:user.avatar
        })

        await merchant.save()
        await user.remove()

        //Logging in merchant As soon as registered
        const token = await merchant.generateToken();
        let options = {}
        if(process.env.NODE_ENV === "Production")
        {
            options = {
                expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
                domain:"https://shopend.netlify.app",
            }
        }
        else {
            options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
            // httpOnly: true
        }}
        // const options = {                                       // Creating cookie named "token" whose value is token
        //     expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
        //     // httpOnly: true
        // }

        res.status(201)                                //201 => created
            .cookie("token", token, options)           //Option contains token expiry details
            .json({
            success:true,
            merchant,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })        
    }

}