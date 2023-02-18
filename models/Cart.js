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
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
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
  
})


module.exports = mongoose.model('Cart', CartSchema);