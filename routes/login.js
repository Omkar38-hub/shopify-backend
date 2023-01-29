const express=require("express");
const { login, logout} = require("../controller/login");
const router = express.Router()

router.route("/login").post(login)
router.route("/logout").get(logout)

module.exports = router;