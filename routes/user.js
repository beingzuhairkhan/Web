const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isOwner} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup" , (req,res)=>{
    res.render("./users/signup.ejs");

});

// Sign Route
router.post("/signup" , wrapAsync(userController.signUpRoute));


//login Get
router.get("/login" ,userController.loginGet )


//login Post
router.post("/login" ,saveRedirectUrl, passport.authenticate("local" ,
 {failureRedirect: '/login', failureFlash: true}), userController.loginPost);


 //logout Get
router.get("/logout" , userController.logoutGet)
module.exports = router ;