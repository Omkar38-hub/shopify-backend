const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const merchantSchema = mongoose.Schema({

    name:{
        type:String,
        required: [true,"Please enter a name"]
    },

    avatar:{
        public_id: String,
        url:String,
    },

    email:{
        type:String,
        required:[true,"Please enter an email"],
        unique:[true,"email already exists"],
    },

    password:{
        type:String,
        required:[true, "Please enter a password"],
        minLength:[6,"Password must be atleast 6 characters"],
        select:false
    },

    contact:{
        type: Number,
    },

    state:{
        type:String,
    },
    city:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    dob:{
        type: Date,
    },
    shops:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Shop",
    }],

    role:{
        type:String,
        default:"MERCHANT"
    },

    createdAt:{
        type:Date,
        default: Date.now()
    },
    lastLogin:{
        type:Date,
        default: Date.now()
    },

    //Newly added for resetting passwords through mail
    resetPasswordToken: String,
    resetPasswordExpire: Date,


})


//Before saving(for first time) or updating the schema run this function
// merchantSchema.pre("save", async function (next) {

//     //But this might hash the hased password when we'll update data other than password Thus adding if condition

//     if(this.isModified("password")){
//         this.password = await bcrypt.hash(this.password,10);
//     }

//     next();  // move to next statement
// })

merchantSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);        //Boolean function 
}

merchantSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex")   //This token will be sent to mail (see post.js on controller => forget pass)
    // console.log(resetToken)

    //now hashing and saving this token on database
    //"sha256" is a hash algo/method
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10*60*1000         //reset password token will expire within 10min of generation

    return resetToken;
}

//Proving user._id and JWT_SECRET to generate token (encoded token)
merchantSchema.methods.generateToken = async function (){
    return await jwt.sign({_id:this._id, role:"MERCHANT"}, process.env.JWT_SECRET)
}




module.exports = mongoose.model("Merchant", merchantSchema)