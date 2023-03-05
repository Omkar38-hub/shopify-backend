const Merchant = require("../models/Merchant")
const bcrypt = require("bcrypt");
const Shop = require("../models/Shop");
const cloudinary = require("cloudinary")

exports.register = async (req,res) => {

    try {

        const {name, email, password, phone, city, pincode, state, shopname} = req.body;

        let merchant = await Merchant.findOne({email})

        if(merchant){
            return res.status(400).json({
                success:false,
                message:"Merchant with same email already exists"
            })
        }

        const newPass = await bcrypt.hash(password,10)

        merchant = await Merchant.create({
            name,
            email, 
            password: newPass,
            phone,
            city,
            pincode,
            state,
            shopname,
            avatar:{
                public_id: "Public id",
                url:"Image url"
            },
        })

        //Logging in merchant As soon as registered
        const token = await merchant.generateToken();
        let options = {}
        if(process.env.NODE_ENV === "Production")
        {
            options = {
                expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
                domain:"shopend.netlify.app",
                secure: true,
                httpOnly: true
            }
        }
        else {
            options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days
            httpOnly: true
        }}
        // const options = {                                       // Creating cookie named "token" whose value is token
        //     expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days  
        //     httpOnly: true
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
            success: false,
            message: error.message
        })
    }
}


//Merchant login
exports.login = async (req,res) => {

    try {

        const {email, password} = req.body;

        let merchant = await Merchant.findOne({email}).select("+password");    //to match the password.. select should be true for password

        if(!merchant){
            return res.status(400).json({
                success:false,
                message:"Merchant does not exists",
            })
        }

        const isMatch = await merchant.matchPassword(password);         //function is defined below Merchant schema
        // console.log(isMatch)

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }

        const token = await merchant.generateToken();               // YOU FORGET TO ADD AWAIT

        let options = {}
        if(process.env.NODE_ENV === "Production")
        {
            options = {
                expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days 
                domain:"shopend.netlify.app",
                secure: true,
                httpOnly: true
            }
        }
        else {
            options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 90 days
            httpOnly: true
        }}

        // const options = {                                       // Creating cookie named "token" whose value is token
        //     expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
        //     httpOnly: true
        // }

        merchant.lastLogin =  Date.now();
        await merchant.save()

        res.status(200)
            .cookie("token", token, options)
            .json({
            success:true,
            merchant,                                                //from here we are fetching Merchant._id
            token
        })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//Merchant Logout
exports.logout = async (req,res) => {

    try {

        res.status(200)
            .cookie("token",null, {expires: new Date(Date.now()), httpOnly:true})
            .json({
                success:true,
                message:"Merchant Logged out"
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

        const merchant = await Merchant.findById(req.merchant._id);

        if(!merchant){
            return res.status(404).json({
                success:false,
                message:"Merchant not found"
            })
        }

        res.status(200).json({
            success:true,
            merchant,            
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.addShop = async (req,res) => {

    try {

        let merchant = await Merchant.findById(req.merchant._id)

        if(!merchant){
            return res.status(400).json({
                success: false,
                message: "Merchant not found"
            })
        }

        const{shopname, description, category, GSTIN, state, city, pincode, image} = req.body

        const mycloud = await cloudinary.v2.uploader.upload(image, {
            folder:"shop"
        })

        const shop = await Shop.create({
            shopname,
            description,
            category,
            GSTIN,
            merchant: req.merchant._id,
            state,
            city,
            pincode,
            shopimage:{
                public_id:mycloud.public_id,
                url:mycloud.secure_url
            },

        })

        merchant.shops.push(shop._id)
        await merchant.save()

        return res.status(200).json({
            success:true,
            shop,
            message:"Shop added"
        });
        
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: error.message
        })
    }
}


exports.changePassword = async (req,res) => {  
    try {
        const {oldPassword,newPassword,confirmPassword} = req.body;
        const merchant = await Merchant.findById(req.merchant._id).select("+password");
        
        const isMatch = await merchant.matchPassword(oldPassword);         //function is defined below User schema

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Current password"
            })
        }
        if(confirmPassword!=newPassword){
            res.status(500).json({
                success:false,
                message:"Confirm Password not matched with New password"
            })
        }
        const newPass = await bcrypt.hash(newPassword,10)
        merchant.password = newPass;
        await merchant.save();
        res.status(200).json({
            success:true,
            message:"Password successfully changed"
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// edit profile of merchant
exports.editProfile = async (req,res) => {  
    try {
        const {name,email,contact,dob,pincode, image} = req.body;
        const merchant = await Merchant.findById(req.merchant._id)

        if(!merchant){
            return res.status(400).json({
                success: false,
                message: "Merchant not found"
            })
        }
        if(name){
        merchant.name = name;
        }
        if(email){
        merchant.email = email;
        }
        if(dob){
        merchant.dob = dob;
        }
        if(pincode){
        merchant.pincode = pincode;
        }
        if(contact){
        merchant.contact = contact;
        }
        if(image){
            await cloudinary.v2.uploader.destroy(merchant.avatar.public_id)
            const mycloud = await cloudinary.v2.uploader.upload(image, {
                folder:"merchant"
            })

            merchant.avatar={
                public_id:mycloud.public_id,
                url:mycloud.secure_url
            }
        }
        await merchant.save();
        res.status(200).json({
            success:true,
            message:"Profile Updated Successfully"
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}