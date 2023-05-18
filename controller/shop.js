const Merchant = require("../models/Merchant");
const Product = require("../models/Product");
const cloudinary = require("cloudinary")
const Shop = require("../models/Shop");
const Math = require('math');
exports.addProduct = async (req, res) => {

    try {
        const { name, description, price, category, stock, image, sold } = req.body
        const merchant = await Merchant.findById(req.merchant._id);
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }
        const shop = await Shop.findById(req.params.shopid)
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        if (shop.merchant.toString() != req.merchant._id.toString()) {
            return res.status(404).json({
                success: false,
                message: "This shop does not belongs to you"
            })
        }

        const mycloud = await cloudinary.v2.uploader.upload(image, {
            folder: "product"
        })

        const newProductData = {
            name,
            image: {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            },
            shop: req.params.shopid,
            description,
            merchant: req.merchant._id,
            price,
            sold,
            category,
            stock,
        }

        const product = await Product.create(newProductData);

        res.status(201).json({
            success: true,
            product,
            message: "Product added"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getShopProducts = async (req, res) => {

    try {
        //Shop k product koi bhi access kr skta hai
        const shop = await Shop.findById(req.params.shopid)

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        const products = await Product.find({ shop: req.params.shopid })

        return res.status(200).json({
            success: true,
            products: products.sort((a, b) => { if (a.name > b.name) { return 1 } else return -1 })
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateProduct = async (req, res) => {

    try {

        const merchant = await Merchant.findById(req.merchant._id);

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.merchant.toString() !== req.merchant._id.toString()) {
            return res.status(404).json({
                success: false,
                message: "Product does not belongs to you"
            })
        }

        const shop = await Shop.findById(product.shop)

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        const { name, description, price, category, stock, sold, image } = req.body

        if (name) {
            product.name = name
        }
        if (description) {
            product.description = description
        }
        if (price) {
            product.price = price
        }
        if (category) {
            product.category = category
        }
        if (stock) {
            product.stock = stock
        }
        if (sold) {
            console.log(sold)
            product.sold = Number(sold)
        }

        if (image) {
            await cloudinary.v2.uploader.destroy(product.image.public_id)
            const mycloud = await cloudinary.v2.uploader.upload(image, {
                folder: "product"
            })

            product.image = {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            }
        }

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product details updated"
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

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.merchant.toString() !== req.merchant._id.toString()) {
            return res.status(404).json({
                success: false,
                message: "Product does not belongs to you"
            })
        }

        const shop = await Shop.findById(product.shop)

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        await product.remove()

        res.status(200).json({
            success: true,
            message: "Product deleted"
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

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const shop = await Shop.findById(product.shop)

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        res.status(200).json({
            success: true,
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
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "There is no Shops"
            })
        }
        return res.status(200).json({
            success: true,
            shops: shop.sort((a, b) => { if (a.shopname > b.shopname) { return 1 } else return -1 })
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getMyShops = async (req, res) => {

    try {

        const merchant = await Merchant.findById(req.merchant._id)

        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }

        const shop = await Shop.find({ merchant: req.merchant._id })
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "There is no Shops"
            })
        }
        return res.status(200).json({
            success: true,
            shops: shop.sort((a, b) => { if (a.name > b.name) { return 1 } else return -1 })
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get the shop details with shop_id of particular shop
exports.getShopDetail = async (req, res) => {
    try {
        const merchant = await Merchant.findById(req.merchant._id)
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }
        const shop = await Shop.findById(req.params.shopid)

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        // const products = await Product.find({shop:req.params.shopid})

        return res.status(200).json({
            success: true,
            shop
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// edit the shop details with shop_id of particular shop
exports.editShopDetail = async (req, res) => {
    try {
        const merchant = await Merchant.findById(req.merchant._id)
        if (!merchant) {
            return res.status(404).json({
                success: false,
                message: "Merchant not found"
            })
        }
        const shop = await Shop.findById(req.params.shopid)

        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "Shop not found"
            })
        }

        const { shopname, description, category, GSTIN, pincode, contact, image } = req.body

        if (shopname) {
            shop.shopname = shopname
        }
        if (description) {
            shop.description = description
        }
        if (category) {
            shop.category = category
        }
        if (GSTIN) {
            shop.stock = GSTIN
        }
        if (pincode) {
            shop.pincode = pincode
        }
        if (contact) {
            shop.contact = contact
        }
        if (image) {
            await cloudinary.v2.uploader.destroy(shop.shopimage.public_id)
            const mycloud = await cloudinary.v2.uploader.upload(image, {
                folder: "shop"
            })

            shop.shopimage = {
                public_id: mycloud.public_id,
                url: mycloud.secure_url
            }
        }

        await shop.save()

        return res.status(200).json({
            success: true,
            message: "Shop details Updated"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get all shops based on latitude and longitude
exports.getLocalShops = async (req, res) => {

    
    try {
        var lat1= req.url.split('?')[1].split('&')[0].split('=')[1];
        var lon1= req.url.split('?')[1].split('&')[1].split('=')[1];
        var dist= req.url.split('?')[1].split('&')[2].split('=')[1];
        let finalDist = -1
        if(dist)
            finalDist = dist
        //console.log(lat1, lon1, "latlon")
        const shop = await Shop.find()
        const localStore=[]
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: "There is no Shops"
            })
        }
        if (finalDist==-1) {
            return res.status(200).json({
                success: true,
                shops: shop.sort((a, b) => {
                    if (a.shopname > b.shopname) {
                        return 1
                    }
                    else return -1
                })
            })
        }
        // const {dist} = req.body
        for(var i=0;i<shop.length;i++)
        {
            var lat2 = shop[i].location.latitude;
           var lon2 = shop[i].location.longitude;
        //    console.log(lat1);
        //    console.log(lon1);
            if(lat2!=null && lon2!=null){
                var a, c, distance, dlat, dlon, radius;
                radius = 6371;
               //console.log(lat1);
                lt1=lat1 * (Math.PI / 180)
                lg1=lon1 * (Math.PI / 180)
                lt2=lat2 * (Math.PI / 180)
                lg2=lon2 * (Math.PI / 180);
                //console.log("After" +lt1);
                dlat = Math.abs(lt2 - lt1);
                dlon = Math.abs(lg2 - lg1);
                a =Math.sin(dlat / 2) * Math.sin(dlat / 2) +Math.cos((lat1)) * Math.cos((lat2)) *Math.sin(dlon / 2) * Math.sin(dlon / 2);
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                distance = radius * c;
                //console.log(distance);
                if(distance<=finalDist)
                  localStore.push(shop[i])
            }
        }
        return res.status(200).json({
            success: true,
            shops: localStore.sort((a, b) => {
                if (a.shopname > b.shopname) {
                    return 1
                }
                else return -1
            }
            )
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}