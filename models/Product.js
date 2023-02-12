const mongoose = require("mongoose")

const productSchema = mongoose.Schema({

    name:{
        type:String,
        requires: [true, "Please Enter product Name"],
    },

    image:{
        public_id: String,
        url:String,
    },

    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },

    merchant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },

    description: {
        type: String,
        required: [true, "Please Enter product Description"],
    },

    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
    },

    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },

    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        default: 1,
    },

    numOfReviews: {
        type: Number,
        default: 0,
    },
    
    reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
          },
        },
    ],

})

module.exports = mongoose.model("Product", productSchema)