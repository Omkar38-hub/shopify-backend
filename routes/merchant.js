const express = require("express")
const { register, login, logout, myProfile, shopDetails } = require("../controller/merchant")
const { isAuthenticated } = require("../middleware/auth")
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated,myProfile)
router.route("/shop/details").put(isAuthenticated,shopDetails)

module.exports = router