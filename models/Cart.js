const mongoose = require('mongoose');

// Cart scheme
const CartSchema = mongoose.Schema({

  products:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
      },
      quantity: Number
    }    
  ],

  TotalProducts: Number,
  totalPrice: Number,

  createdAt:{
    type:Date,
    default:Date.now()
  },

  updatedAt:{
    type:Date,
    default:Date.now()
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  
})


module.exports = mongoose.model('Cart', CartSchema);