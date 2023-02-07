const express = require("express")
const { register, login, logout, myProfile, addShop } = require("../controller/merchant")
const { addProduct, updateProduct, deleteProduct, getProduct } = require("../controller/shop")
const { isAuthenticated } = require("../middleware/auth")
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated,myProfile)
router.route("/add/shop").post(isAuthenticated, addShop)
router.route("/add/product/:shopid").post(isAuthenticated, addProduct)
router.route("/product/:id").put(isAuthenticated, updateProduct)
                            .delete(isAuthenticated, deleteProduct)
                            .get(getProduct)

module.exports = router