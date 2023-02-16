const Merchant = require("../models/Merchant");
const Product = require("../models/Product");
const Shop = require("../models/Shop");

exports.addProduct = async (req,res) =>{

    try {
        const {name, description, price, category, stock } = req.body
        const merchant = await Merchant.findById(req.merchant._id);
        if(!merchant){
            return res.status(404).json({
                success:false,
                message:"Merchant not found"
            })
        }
        const shop = await Shop.findById(req.params.shopid)
        if(!shop){
            return res.status(404).json({
                success:false,
                message:"Shop not found"
            })
        }

        if(shop.merchant.toString()  != req.merchant._id.toString() ){
            return res.status(404).json({
                success:false,
                message:"This shop does not belongs to you"
            })
        }

        const newProductData = {
            name,
            image:{
                public_id:"mycloud.public_id",
                url:"mycloud.secure_url"
            },
            shop: req.params.shopid,
            description,
            merchant: req.merchant._id,
            price,
            category,
            stock,
        }

        const product = await Product.create(newProductData);

        res.status(201).json({
            success:true,
            product,
            message:"Product added"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

exports.getShopProducts = async (req, res) => {

    try {
        //Shop k product koi bhi access kr skta hai
        const shop = await Shop.findById(req.params.shopid)

        if(!shop){
            return res.status(404).json({
                success:false,
                message:"Shop not found"
            })
        }

        const products = await Product.find({shop:req.params.shopid})

        return res.status(200).json({
            success: true,
            products: products.sort((a,b)=>{ if(a.name > b.name){return 1} else return -1})
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

exports.updateProduct = async (req, res) => {

    try {

        const merchant = await Merchant.findById(req.merchant._id);

        if(!merchant){
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }

        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if(product.merchant.toString() !== req.merchant._id.toString()){
            return res.status(404).json({
                success: false,
                message:"Product does not belongs to you"
            })
        }

        const shop = await Shop.findById(product.shop)

        if(!shop){
            return res.status(404).json({
                success: false,
                message:"Shop not found"
            })
        }

        const {name, description, price, category, stock } = req.body

        if(name){
            product.name = name
        }
        if(description){
            product.description = description
        }
        if(price){
            product.price = price
        }
        if(category){
            product.category = category
        }
        if(stock){
            product.stock = stock
        }

        await product.save()

        res.status(200).json({
            success:true,
            message:"Product details updated"
        })        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteProduct = async (req, res) => {

    try {

        const merchant = await Merchant.findById(req.merchant._id);

        if(!merchant){
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }

        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if(product.merchant.toString() !== req.merchant._id.toString()){
            return res.status(404).json({
                success: false,
                message:"Product does not belongs to you"
            })
        }

        const shop = await Shop.findById(product.shop)

        if(!shop){
            return res.status(404).json({
                success: false,
                message:"Shop not found"
            })
        }

        await product.remove()

        res.status(200).json({
            success:true,
            message:"Product deleted"
        })        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.getProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const shop = await Shop.findById(product.shop)

        if(!shop){
            return res.status(404).json({
                success: false,
                message:"Shop not found"
            })
        }

        res.status(200).json({
            success:true,
            product
        })
            
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getShops = async (req, res) => {

    try {
        const shop = await Shop.find()
        if(!shop){
            return res.status(404).json({
                success:false,
                message:"There is no Shops"
            })
        }
        return res.status(200).json({
            success: true,
            shops: shop.sort((a,b)=>{ if(a.name > b.name){return 1} else return -1})
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
}