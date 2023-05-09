const mongoose = require('mongoose');

// Cart scheme
const CartSchema = mongoose.Schema({

  products:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
      },
      quantity:{ 
        type: Number, 
        required: true, 
        default: 1 
      },
      price: {
        type: Number,
      },
      
    }    
  ],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  //totalProducts: Number,
  totalPrice: Number,
  contact:{
    type: Number,
  },
  address:{
      type:String,
  },
  pincode:{
      type:Number,
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },

  updatedAt:{
    type:Date,
    default:Date.now()
  },
  
})


module.exports = mongoose.model('Cart', CartSchema);