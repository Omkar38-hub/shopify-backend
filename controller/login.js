const User = require("../models/User")
const Merchant = require("../models/Merchant")
const bcrypt = require("bcrypt")

// User/Merchant login
exports.login = async (req,res) => {

    try {

        const {email, password} = req.body;

        let user = await User.findOne({email}).select("+password");    //to match the password.. select should be true for password

        if(user){
            const isMatch = await user.matchPassword(password);         //function is defined below User schema
            // console.log(isMatch)

            if(!isMatch){
                return res.status(400).json({
                    success:false,
                    message:"Incorrect password"
                })
            }

            const token = await user.generateToken();               // YOU FORGET TO ADD AWAIT
            const options = {                                       // Creating cookie named "token" whose value is token
                expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
                httpOnly: true
            }

            user.lastLogin =  Date.now();
            await user.save()

            return res.status(200)
                .cookie("token", token, options)
                .json({
                success:true,
                user,                                                //from here we are fetching user._id
                token
            })
        }

        let merchant = await Merchant.findOne({email}).select("+password");

        if(!merchant){
            return res.status(400).json({
                success: false,
                message: "No user or merchant is registered with this email"
            })
        }

        if(merchant){
            const isMatch = await merchant.matchPassword(password);         //function is defined below User schema
            // console.log(isMatch)

            if(!isMatch){
                return res.status(400).json({
                    success:false,
                    message:"Incorrect password"
                })
            }

            const token = await merchant.generateToken();               // YOU FORGET TO ADD AWAIT
            const options = {                                       // Creating cookie named "token" whose value is token
                expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
                httpOnly: true
            }

            merchant.lastLogin =  Date.now();
            await merchant.save()

            return res.status(200)
                .cookie("token", token, options)
                .json({
                success:true,
                merchant,                                                //from here we are fetching user._id
                token
            })
        }



    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//My profile data
exports.myProfile = async (req,res) => {

    try {

        if(req.user){
            const user = await User.findById(req.user._id);

            if(user){
                return res.status(200).json({
                    success:true,
                    user,            
                })
            }
        }

        if(req.merchant){
            const merchant = await Merchant.findById(req.merchant._id);

            if(merchant){
                return res.status(200).json({
                    success:true,
                    merchant,
                })
            }
        }

        return res.status(400).json({
            success: false,
            message: "Invalid user or merchant"
        })


        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
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