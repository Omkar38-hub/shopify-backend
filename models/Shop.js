const mongoose = require("mongoose")

const shopSchema = mongoose.Schema({

    shopname:{
        type:String,
    },
    shopimage:{
        public_id: String,
        url:String,
    },
    description:{
        type:String,
    },
    category:{
        type:String,
    },

    GSTIN: {
        type: String,
        default: null,
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Merchant",
    },

    contact:{
        type:Number,
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
    rating:{
        type:Number,
    },
    location:{
        latitude:{
            type:String,
        },
        longitude:{
            type:String
        },
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },

})



module.exports = mongoose.model("Shop", shopSchema)