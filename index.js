const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
//  const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl =  process.env.ATLASDB_URL;
const passport = require("passport");
const LocalStrategy = require("passport-local");
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env);

// const User = require(path.resolve(__dirname, '../models/user.js'));

const User = require("./models/user.js");
// const Listing= require("./models/listing.js");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review= require("./models/review.js");
// const { error } = require("console");
// const review = require("./models/review.js");

const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto:{
        secret: process.env.SECRET ,  
    },
    touchAfter:24 * 3600 ,
})

store.on("error", ()=>{
    console.log("ERROR in mongo session store" , err);
});

const sessionOption = {
    store ,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge:7 * 24 * 60 * 60 * 1000 ,
        httpOnly: true ,

    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL );
}



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings" , listing);
app.use("/listings/:id/reviews" , reviews);
app.use("/" , user);



app.all("*" , (req,res,next)=>{
    next(new ExpressError(404 , message = "Something went wrong"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message= "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs" , {message});
    
});

app.get("/privacy" , (req,res)=>{
    res.render("../includes/privacy.ejs");
})












// //validation
// const validateListing  = (req,res , next)=>{
//      let {error} = listingSchema.validate(req.body);
//      if(error){
//         let errmsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400 , errmsg);
//      }else{
//         next();
//      }
// };

// // index route
// app.get("/listings" , wrapAsync (async (req,res)=>{
//     const allListings =await Listing.find({});
//     res.render("listings/index.ejs" , {allListings});
// })
// );


// // new route
// app.get("/listings/new" , (req,res)=>{
//     res.render("listings/new.ejs");
// });

// //create route

// app.post("/listings",
// validateListing,
// wrapAsync( async (req, res ) => {
//       let result =   listingSchema.validate(req.body);
//       console.log(result);
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
    
//   })
  
//   );

//  // Edit Route
//  app.get("/listings/:id/edit",wrapAsync( async (req, res ) => {

//         let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
   
   
//   })
//   );

  
// //Update Route
// app.put("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   });
  
// //Delete Route
// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
//   });
  
 
// //show route
// app.get("/listings/:id" , async (req,res)=>{
//      let {id} = req.params;
//      const listing = await Listing.findById(id).populate("reviews");
//      res.render("listings/show.ejs" , {listing});

// });
// //validation
// const validatereview = (req,res , next)=>{
    //     let {error} = reviewSchema.validate(req.body);
    //     if(error){
        //        let errmsg = error.details.map((el)=> el.message).join(",");
        //        throw new ExpressError(400 , errmsg);
//     }else{
//        next();
//     }
// };

// //Review
// //post route
// app.post("/listings/:id/reviews" , validatereview, wrapAsync( async (req,res)=>{
//    let listing =  await Listing.findById(req.params.id);
//    let newReview = new Review(req.body.review);

//    listing.reviews.push(newReview);

//    await newReview.save();
//    let result = await listing.save();
//    res.redirect(`/listings/${listing._id}`);
// })
// );

// //delete review route

// app.delete("/listing/:id/reviews/:reviewId",
//  wrapAsync (async  (req,res)=>{
//    let {id , reviewId} = req.params ;
//    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
//    await Review.findByIdAndDelete(reviewId);

//    res.redirect(`/listings/${id}`);
// })
// );
