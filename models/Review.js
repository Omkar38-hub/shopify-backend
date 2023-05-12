const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
    rating:{
        type:Number,
        enum:[1,2,3,4,5],
        required:true
    },
    review:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }
    })



module.exports = mongoose.model("Review",reviewSchema)