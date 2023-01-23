const User = require("../models/User")

exports.register = async (req,res) => {

    try {

        const {fname, lname, email, password, phone, city, pincode, state} = req.body;

        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"User with same email already exists"
            })
        }

        user = await User.create({
            name: fname + " " + lname,
            email, 
            password,
            phone,
            city,
            pincode,
            state,
            avatar:{
                public_id: "Public id",
                url:"Image url"
            },
        })

        //Logging in user As soon as registered
        const token = await user.generateToken();
        const options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days  
            httpOnly: true
        }

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
        const options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
            httpOnly: true
        }

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