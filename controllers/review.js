
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");


module.exports.reviewRoute = async (req, res) => {
    try {
      let listing = await Listing.findById(req.params.id);
      if (!listing) {
        throw new ExpressError(404, 'Listing not found');
      }
  
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
      await newReview.save();
      let result = await listing.save();
      req.flash("success" , "New Review Created !");
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      // Handle errors here or pass them to the next middleware
      next(err);
    }
  }

  module.exports.deleteReviewRoute = async  (req,res)=>{
    let {id , reviewId} = req.params ;

    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , " Review deleted !");
    res.redirect(`/listings/${id}`);
 }