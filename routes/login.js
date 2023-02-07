const express=require("express");
const { login, logout, myProfile} = require("../controller/login");
const router = express.Router()
const { isAuthenticated } = require("../middleware/auth");

router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticated, myProfile)

module.exports = router;