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

    merchant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Merchant"
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

    Stock: {
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