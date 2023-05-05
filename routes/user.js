const express=require("express");
const { getShopProducts,getProduct,getShops, getLocalShops} = require("../controller/shop");
const { register, login, logout, myProfile, convertToBusiness,changePassword,getshopReview,ReviewToShop, addToCart, getCartItem} = require("../controller/user");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated, myProfile)
router.route("/to/merchant").post(isAuthenticated, convertToBusiness)
router.route("/shop/products/:shopid").get(getShopProducts)
router.route("/shops").get(getShops)
router.route("/local-shops").get(getLocalShops)
router.route("/password/change").put(isAuthenticated,changePassword)
router.route("/product/:id").get(getProduct)
router.route("/review-shop/:shopid").post(isAuthenticated,ReviewToShop)
                                    .get(getshopReview)
router.route("/add-to-cart").post(isAuthenticated,addToCart)
                            .get(isAuthenticated,getCartItem)
module.exports = router;