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

    phone:{
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

    createdAt:{
        type:Date,
        default: Date.now()
    },

})



module.exports = mongoose.model("Shop", shopSchema)