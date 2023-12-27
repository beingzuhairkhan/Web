const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js"); // Make sure to import the ExpressError class
const {validatereview, isLoggedIn,isauthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// Review post route
router.post("/", validatereview,isLoggedIn, wrapAsync(reviewController.reviewRoute));

//delete review route

router.delete("/:reviewId",isLoggedIn,isauthor,
 wrapAsync (reviewController.deleteReviewRoute)
);


module.exports = router;
