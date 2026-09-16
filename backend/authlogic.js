const express = require("express");
const router = express.Router();

const { signup,login } = require("./AUTH"); 
// const { login }=require("./AUTH")

router.post("/signup", signup);
router.post("/login",login)

module.exports = router;