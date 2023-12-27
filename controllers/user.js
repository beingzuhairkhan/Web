const User = require("../models/user.js");

module.exports.signUpRoute = async (req,res)=>{
    try{
       let {username , email , password} = req.body ;
   const newUser = new User({email , username});
  const registeredUser = await User.register(newUser , password);
  console.log(registeredUser);
  req.login(registeredUser, (err)=>{
   if(err){
       return next(err);
   }
   req.flash("success" , "Welcome to wanderlusts !");
   res.redirect("/listings");
  });
  
   }catch(e){
       req.flash("error" , e.message);
       res.redirect("/signup");
   }
}

//login Get

module.exports.loginGet = (req,res)=>{
    res.render("./users/login.ejs");
}

//login Post 

module.exports.loginPost = async(req,res)=>{
    req.flash("Success" , "Welcome to Wanderlust your Logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
    // res.redirect("/listings");
}

//logout Get

module.exports.logoutGet = (req,res ,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success" , "You are logges out");
        res.redirect("/listings");
    })
}