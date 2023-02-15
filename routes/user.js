const express=require("express");
const { getShopProducts, getProduct } = require("../controller/shop");
const { register, login, logout, myProfile, convertToBusiness,changePassword} = require("../controller/user");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated, myProfile)
router.route("/to/merchant").post(isAuthenticated, convertToBusiness)
router.route("/shop/products/:shopid").get( getShopProducts)//mere kaam
router.route("/password/change").put(isAuthenticated,changePassword)
router.route("/product/:id").get(getProduct)

module.exports = router;