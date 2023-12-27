const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema,reviewSchema } = require("./schema.js");
const review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
//    console.log(req.path , ".." , req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to create listing!");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(listing && listing.owner && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of this listing");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}

//validation
module.exports. validateListing  = (req,res , next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
       let errmsg = error.details.map((el)=> el.message).join(",");
       throw new ExpressError(400 , errmsg);
    }else{
       next();
    }
};

// Validation
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };
  
  module.exports.isauthor = async (req,res,next)=>{
    let {id, reviewId } = req.params;
    let listing = await review.findById(reviewId);
    if(review && review.author && !review.autho._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You didn't create review");
       return  res.redirect(`/listings/${id}`);
    }
    next();
}
